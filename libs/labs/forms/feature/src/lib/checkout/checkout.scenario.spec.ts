import { TestBed } from '@angular/core/testing';
import { provideFormsTesting } from '../testing';
import { CheckoutScenario } from './checkout.scenario';

describe('CheckoutScenario', () => {
  let el: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: provideFormsTesting() });
    el = TestBed.createComponent(CheckoutScenario).nativeElement;
    TestBed.tick();
  });

  it('mostra o título, o problema e o formulário na aba Demo', () => {
    expect(el.querySelector('h1')?.textContent).toBe('Formulário de checkout');
    expect(el.querySelector('pf-checkout-form form')).not.toBeNull();
    expect(el.querySelectorAll('pf-checkout-form input')).toHaveLength(5);
  });

  it('termina em "quando eu escolheria diferente", como os outros cenários', () => {
    expect(el.textContent).toContain('lab.scenario.differently');
    expect(el.textContent).toContain('Reactive Forms');
  });

  it('cada campo tem um rótulo associado (acessibilidade)', () => {
    const inputs = [
      ...el.querySelectorAll<HTMLInputElement>('pf-checkout-form input'),
    ];

    for (const input of inputs) {
      expect(el.querySelector(`label[for=${input.id}]`)).not.toBeNull();
    }
  });
});
