import { TestBed } from '@angular/core/testing';
import { provideScenarioTesting } from '../../testing';
import { CartStore } from './cart.store';
import { SharedStateScenario } from './shared-state.scenario';

describe('CartStore', () => {
  let store: CartStore;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [CartStore] });
    store = TestBed.inject(CartStore);
  });

  it('soma unidades e total, agrupando o mesmo produto', () => {
    store.add({ id: 1, name: 'Keyboard', price: 100 });
    store.add({ id: 1, name: 'Keyboard', price: 100 });
    store.add({ id: 2, name: 'Mouse', price: 50 });

    expect(store.items()).toHaveLength(2);
    expect(store.count()).toBe(3);
    expect(store.total()).toBe(250);
  });

  it('remove uma linha inteira', () => {
    store.add({ id: 1, name: 'Keyboard', price: 100 });
    store.remove(1);

    expect(store.count()).toBe(0);
    expect(store.items()).toEqual([]);
  });
});

describe('SharedStateScenario', () => {
  let el: HTMLElement;

  const click = (label: string) =>
    [...el.querySelectorAll('button')]
      .find((b) => b.textContent?.includes(label))
      ?.click();
  const headerCount = () => el.querySelector('.badge strong')?.textContent;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: provideScenarioTesting() });
    el = TestBed.createComponent(SharedStateScenario).nativeElement;
    TestBed.tick();
  });

  it('o header e o checkout leem o mesmo estado', () => {
    expect(headerCount()).toBe('0');

    click('Adicionar');
    click('Adicionar');
    TestBed.tick();
    expect(headerCount()).toBe('2');

    click('Checkout');
    TestBed.tick();
    expect(el.querySelector('.products li')?.textContent).toContain(
      '2 × Mechanical Keyboard',
    );

    click('Remover');
    TestBed.tick();
    expect(headerCount()).toBe('0');
    expect(el.textContent).toContain('O carrinho está vazio.');
  });

  it('registra as ações no log da instrumentação', () => {
    click('Adicionar');
    TestBed.tick();

    expect(
      el.querySelector('pf-instrumentation-panel .log li')?.textContent,
    ).toContain('Adicionado: Mechanical Keyboard');
  });
});
