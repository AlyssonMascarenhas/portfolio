import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { provideScenarioTesting } from '../../testing';
import { CartTotalRxjs } from './cart-total.rxjs';
import { DerivedStateScenario } from './derived-state.scenario';

describe('DerivedStateScenario', () => {
  let el: HTMLElement;

  const counts = () =>
    [...el.querySelectorAll('pf-instrumentation-panel dd')].map((d) =>
      Number(d.textContent),
    );
  const type = (label: RegExp, value: string) => {
    const input = [...el.querySelectorAll('label')]
      .find((l) => label.test(l.textContent ?? ''))
      ?.querySelector('input');
    if (!input) throw new Error(`campo ${label} não encontrado`);
    input.value = value;
    input.dispatchEvent(new Event('input'));
    TestBed.tick();
    TestBed.tick(); // o contador é publicado depois do render
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: provideScenarioTesting() });
    el = TestBed.createComponent(DerivedStateScenario).nativeElement;
    TestBed.tick();
    TestBed.tick();
  });

  it('calcula subtotal, desconto e total', () => {
    const values = [...el.querySelectorAll('.summary dd')].map((d) =>
      d.textContent?.replace(/\s/g, ' '),
    );

    // 120 × 2 = 240; 10% = 24; total 216
    expect(values.map((v) => v?.replace(/[^\d,]/g, ''))).toEqual([
      '240,00',
      '24,00',
      '216,00',
    ]);
    expect(counts()).toEqual([1, 1, 1]);
  });

  it('mudar a observação não recalcula nada', () => {
    type(/Observação/, 'entregar de manhã');

    expect(counts()).toEqual([1, 1, 1]);
  });

  it('mudar o desconto recalcula desconto e total, mas não o subtotal', () => {
    type(/Desconto/, '20');

    expect(counts()).toEqual([1, 2, 2]);
  });

  it('mudar a quantidade recalcula os três', () => {
    type(/Quantidade/, '3');

    expect(counts()).toEqual([2, 2, 2]);
  });

  it('a versão com combineLatest chega ao mesmo total', async () => {
    const cart = new CartTotalRxjs();
    expect(await firstValueFrom(cart.total$)).toBe(216);

    cart.discountPercent$.next(20);
    expect(await firstValueFrom(cart.total$)).toBe(192);
  });
});
