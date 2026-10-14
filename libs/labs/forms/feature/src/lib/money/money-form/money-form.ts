import { Component, computed, input, signal, viewChild } from '@angular/core';
import { FormField, form, max, min, required } from '@angular/forms/signals';
import { InstrumentationPanel, Metric } from '@portfolio/lab-kit';
import { MoneyInput } from '../money-input/money-input';
import { MoneyDemoText } from '../money.content';

interface MoneyModel {
  amount: number | null;
}

/** Formulário de valor com Signal Forms: as regras olham o número, não o texto digitado. */
@Component({
  selector: 'pf-money-form',
  imports: [FormField, MoneyInput, InstrumentationPanel],
  templateUrl: './money-form.html',
  styleUrl: './money-form.scss',
})
export class MoneyForm {
  readonly labels = input.required<MoneyDemoText>();

  protected readonly model = signal<MoneyModel>({ amount: null });

  // #region forms-money-schema
  protected readonly payment = form(this.model, (p) => {
    required(p.amount);
    // As regras de negócio comparam números: o parse do campo já fez a conversão.
    min(p.amount, 0.01);
    max(p.amount, 10000);
  });
  // #endregion

  private readonly control = viewChild.required(MoneyInput);

  /** Mensagem do campo, só depois que foi tocado. */
  protected readonly errorText = computed(() => {
    const field = this.payment.amount();
    if (!field.touched()) return '';
    const messages = this.labels().messages;
    const errors = field.errors();
    // Texto ilegível deixa o model vazio e dispararia também "obrigatório": só o erro de parse é útil.
    const shown = errors.some((error) => error.kind === 'parse')
      ? errors.filter((error) => error.kind === 'parse')
      : errors;
    return shown
      .map((error) => messages[error.kind] ?? messages['invalid'])
      .join(' ');
  });

  protected readonly showInvalid = computed(
    () => this.payment.amount().touched() && this.payment.amount().invalid(),
  );

  protected readonly metrics = computed<Metric[]>(() => {
    const demo = this.labels();
    const field = this.payment.amount();
    const amount = this.model().amount;
    return [
      { label: demo.metricText, value: `"${this.control().raw()}"` },
      {
        label: demo.metricModel,
        value: amount === null ? 'null' : `${amount} (number)`,
      },
      {
        label: demo.metricParse,
        value: this.control().raw.parseErrors().length
          ? demo.metricParseFailed
          : demo.metricParseOk,
      },
      {
        label: demo.metricState,
        value: [
          field.touched() && demo.touched,
          field.invalid() ? demo.invalid : demo.valid,
        ]
          .filter(Boolean)
          .join(' · '),
      },
    ];
  });
}
