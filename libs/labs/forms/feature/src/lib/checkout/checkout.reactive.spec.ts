import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CheckoutForm } from '../checkout-form/checkout-form';
import { provideFormsTesting } from '../testing';
import { CHECKOUT_CONTENT } from './checkout.content';
import { CheckoutReactiveForm } from './checkout.reactive';

interface Values {
  name: string;
  email: string;
  confirmEmail: string;
  quantity: number;
}

type FieldKey = keyof Values;
type SignalForm = Record<FieldKey, () => { invalid(): boolean }>;

/** Acesso aos membros protegidos do componente, só para comparar as duas implementações. */
interface CheckoutInternals {
  model: { set(value: Values & { coupon: string }): void };
  checkout: SignalForm;
}

const VALID: Values = {
  name: 'Ana Souza',
  email: 'ana@example.com',
  confirmEmail: 'ana@example.com',
  quantity: 2,
};

describe('Signal Forms e Reactive Forms aceitam e recusam os mesmos valores', () => {
  let signalForm: CheckoutInternals;
  let reactiveForm: CheckoutReactiveForm;

  /** Campos inválidos segundo cada implementação (a confirmação, no Reactive, é um erro do grupo). */
  const invalidInSignal = (): FieldKey[] =>
    (['name', 'email', 'confirmEmail', 'quantity'] as FieldKey[]).filter(
      (key) => signalForm.checkout[key]().invalid(),
    );
  const invalidInReactive = (): FieldKey[] => {
    const { controls, errors } = reactiveForm.checkout;
    const fields = (['name', 'email', 'quantity'] as const).filter(
      (key) => controls[key].invalid,
    );
    return errors?.['emailsDiffer'] ? [...fields, 'confirmEmail'] : fields;
  };

  const apply = (values: Values) => {
    signalForm.model.set({ ...values, coupon: '' });
    reactiveForm.checkout.setValue({ ...values, coupon: '' });
    TestBed.tick();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: provideFormsTesting() });
    const fixture = TestBed.createComponent(CheckoutForm);
    fixture.componentRef.setInput('labels', CHECKOUT_CONTENT['pt-br'].demo);
    TestBed.tick();
    signalForm = fixture.componentInstance as unknown as CheckoutInternals;
    reactiveForm = TestBed.runInInjectionContext(
      () => new CheckoutReactiveForm(),
    );
  });

  it.each<[string, Partial<Values>, FieldKey[]]>([
    ['tudo válido', {}, []],
    ['nome curto', { name: 'An' }, ['name']],
    ['nome vazio', { name: '' }, ['name']],
    ['e-mail sem domínio', { email: 'ana@', confirmEmail: 'ana@' }, ['email']],
    ['e-mail vazio', { email: '', confirmEmail: '' }, ['email']],
    [
      'confirmação diferente',
      { confirmEmail: 'outra@example.com' },
      ['confirmEmail'],
    ],
    ['quantidade zero', { quantity: 0 }, ['quantity']],
    ['quantidade acima do limite', { quantity: 11 }, ['quantity']],
    ['quantidade no limite', { quantity: 10 }, []],
    [
      'vários problemas ao mesmo tempo',
      { name: 'A', quantity: 99, confirmEmail: 'x@example.com' },
      ['name', 'confirmEmail', 'quantity'],
    ],
  ])('%s', (_name, changes, expectedInvalid) => {
    apply({ ...VALID, ...changes });

    expect(invalidInSignal().sort()).toEqual([...expectedInvalid].sort());
    expect(invalidInReactive().sort()).toEqual([...expectedInvalid].sort());
  });

  it('o cupom é validado nas duas versões contra o mesmo endpoint', () => {
    vi.useFakeTimers();
    try {
      const http = TestBed.inject(HttpTestingController);
      reactiveForm.checkout.controls.coupon.setValue('PROMO10');
      vi.advanceTimersByTime(400);

      const [request] = http.match('api/lab/coupon?code=PROMO10');
      expect(request.request.method).toBe('GET');
      request.flush({ valid: false });

      expect(reactiveForm.checkout.controls.coupon.errors).toEqual({
        couponInvalid: true,
      });
    } finally {
      vi.useRealTimers();
    }
  });
});
