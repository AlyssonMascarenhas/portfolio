import { Component, computed, inject, input, signal } from '@angular/core';
import {
  FormField,
  debounce,
  email,
  form,
  max,
  min,
  minLength,
  required,
  submit,
  validate,
  validateHttp,
} from '@angular/forms/signals';
import { LabCouponResult } from '@portfolio/contracts';
import { Counters, InstrumentationPanel, Metric } from '@portfolio/lab-kit';
import {
  CheckoutApi,
  CheckoutRejected,
} from '@portfolio/labs/forms/data-access';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { firstValueFrom } from 'rxjs';
import { CheckoutDemoText } from '../checkout/checkout.content';

interface CheckoutModel {
  name: string;
  email: string;
  confirmEmail: string;
  quantity: number;
  coupon: string;
}

/** Código de erro do servidor -> tipo de erro do formulário (traduzido pela UI). */
const SERVER_ERROR_KINDS: Record<string, string> = {
  email_taken: 'emailTaken',
};

/** O que um campo precisa expor para a tela: o estado dele, como signals. */
type FieldLike = () => {
  touched(): boolean;
  dirty(): boolean;
  invalid(): boolean;
  pending(): boolean;
  errors(): readonly { kind: string; message?: string }[];
};

/** Formulário de checkout com Signal Forms: o modelo é um signal e as regras ficam num schema. */
@Component({
  selector: 'pf-checkout-form',
  imports: [
    FormField,
    ButtonModule,
    InputTextModule,
    MessageModule,
    InstrumentationPanel,
  ],
  templateUrl: './checkout-form.html',
  styleUrl: './checkout-form.scss',
})
export class CheckoutForm {
  readonly labels = input.required<CheckoutDemoText>();

  private readonly api = inject(CheckoutApi);
  private readonly counters = new Counters();

  // #region forms-signal-form
  protected readonly model = signal<CheckoutModel>({
    name: '',
    email: '',
    confirmEmail: '',
    quantity: 1,
    coupon: '',
  });

  protected readonly checkout = form(this.model, (p) => {
    required(p.name);
    minLength(p.name, 3);

    required(p.email);
    email(p.email);
    // Regra entre campos: lê o valor de outro campo no mesmo schema.
    validate(p.confirmEmail, ({ value, valueOf }) =>
      value() === valueOf(p.email) ? undefined : { kind: 'emailsDiffer' },
    );

    min(p.quantity, 1);
    max(p.quantity, 10);

    // Validação assíncrona: espera 400 ms de silêncio e consulta o servidor.
    debounce(p.coupon, 400);
    validateHttp(p.coupon, {
      request: ({ value }) => this.couponRequest(value()),
      onSuccess: (result: LabCouponResult) =>
        result.valid ? undefined : { kind: 'couponInvalid' },
      onError: () => ({ kind: 'couponUnavailable' }),
    });
  });
  // #endregion

  protected readonly orderId = signal<string | undefined>(undefined);
  protected readonly failed = signal(false);

  /** Mensagens de erro por campo, só depois que o campo foi tocado (ou o envio foi tentado). */
  protected readonly errors = computed(() => {
    const messages = this.labels().messages;
    const texts = (field: FieldLike) =>
      field().touched()
        ? field()
            .errors()
            .map(
              (error) =>
                messages[error.kind] ?? error.message ?? messages['invalid'],
            )
        : [];
    return {
      name: texts(this.checkout.name),
      email: texts(this.checkout.email),
      confirmEmail: texts(this.checkout.confirmEmail),
      quantity: texts(this.checkout.quantity),
      coupon: texts(this.checkout.coupon),
    };
  });

  /** As mensagens de cada campo já unidas, para o template só exibir. */
  protected readonly errorText = computed(() => {
    const errors = this.errors();
    return {
      name: errors.name.join(' '),
      email: errors.email.join(' '),
      confirmEmail: errors.confirmEmail.join(' '),
      quantity: errors.quantity.join(' '),
      coupon: errors.coupon.join(' '),
    };
  });

  protected readonly successMessage = computed(() => {
    const id = this.orderId();
    return id ? this.labels().success.replace('{id}', id) : undefined;
  });

  protected readonly invalid = computed(() => {
    const flag = (field: FieldLike) => field().touched() && field().invalid();
    return {
      name: flag(this.checkout.name),
      email: flag(this.checkout.email),
      confirmEmail: flag(this.checkout.confirmEmail),
      quantity: flag(this.checkout.quantity),
      coupon: flag(this.checkout.coupon),
    };
  });

  protected readonly metrics = computed<Metric[]>(() => {
    const demo = this.labels();
    const describe = (field: FieldLike) =>
      [
        field().touched() && demo.touched,
        field().dirty() && demo.dirty,
        field().pending()
          ? demo.pending
          : field().invalid()
            ? demo.invalid
            : demo.valid,
      ]
        .filter(Boolean)
        .join(' · ');
    const counts = this.counters.snapshot();
    return [
      { label: demo.name, value: describe(this.checkout.name) },
      { label: demo.email, value: describe(this.checkout.email) },
      { label: demo.confirmEmail, value: describe(this.checkout.confirmEmail) },
      { label: demo.quantity, value: describe(this.checkout.quantity) },
      { label: demo.coupon, value: describe(this.checkout.coupon) },
      { label: demo.metricCouponChecks, value: counts['coupon'] ?? 0 },
      { label: demo.metricSubmits, value: counts['submits'] ?? 0 },
    ];
  });

  /** URL da consulta de cupom (ou nada, se o campo está vazio). Também conta as consultas disparadas. */
  private couponRequest(coupon: string): string | undefined {
    const code = coupon.trim();
    if (!code) return undefined;
    this.counters.increment('coupon');
    return `api/lab/coupon?code=${encodeURIComponent(code)}`;
  }

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.orderId.set(undefined);
    this.failed.set(false);

    await submit(this.checkout, {
      action: async (root) => {
        this.counters.increment('submits');
        const { name, email, quantity, coupon } = this.model();
        try {
          const result = await firstValueFrom(
            this.api.create({ name, email, quantity, coupon }),
          );
          this.orderId.set(result.id);
          return undefined;
        } catch (error) {
          if (error instanceof CheckoutRejected) {
            // O servidor recusou campos: cada erro aparece no campo certo.
            return error.errors.map((rejected) => ({
              kind: SERVER_ERROR_KINDS[rejected.code] ?? 'invalid',
              fieldTree: root[rejected.field],
            }));
          }
          this.failed.set(true);
          return undefined;
        }
      },
      // Com erro, o foco vai para o primeiro campo inválido (teclado e leitor de tela).
      onInvalid: (root) =>
        root().errorSummary()[0]?.fieldTree().focusBoundControl(),
    });
  }
}
