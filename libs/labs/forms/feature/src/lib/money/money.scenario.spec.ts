import { TestBed } from '@angular/core/testing';
import { provideFormsTesting } from '../testing';
import { MoneyScenario } from './money.scenario';

describe('MoneyScenario', () => {
  let el: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: provideFormsTesting() });
    el = TestBed.createComponent(MoneyScenario).nativeElement;
    TestBed.tick();
  });

  it('mostra o título, o problema e o campo de moeda na aba Demo', () => {
    expect(el.querySelector('h1')?.textContent).toBe(
      'Campo de moeda com transformedValue',
    );
    expect(el.querySelectorAll('pf-money-form input')).toHaveLength(1);
  });

  it('termina em "quando eu escolheria diferente", como os outros cenários', () => {
    expect(el.textContent).toContain('lab.scenario.differently');
    expect(el.textContent).toContain('centavos inteiros');
  });
});
