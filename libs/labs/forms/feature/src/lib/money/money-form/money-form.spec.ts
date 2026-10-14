import { TestBed } from '@angular/core/testing';
import { provideFormsTesting } from '../../testing';
import { MONEY_CONTENT } from '../money.content';
import { MoneyForm } from './money-form';

describe('MoneyForm', () => {
  let el: HTMLElement;
  let input: HTMLInputElement;

  const type = (text: string) => {
    input.value = text;
    input.dispatchEvent(new Event('input'));
    TestBed.tick();
  };
  const blur = () => {
    input.dispatchEvent(new Event('blur'));
    TestBed.tick();
  };
  const error = () => el.querySelector('#mo-amount-error')?.textContent;
  const metric = (label: string) =>
    [...el.querySelectorAll('pf-instrumentation-panel *')].find((n) =>
      n.textContent?.includes(label),
    );

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: provideFormsTesting() });
    const fixture = TestBed.createComponent(MoneyForm);
    fixture.componentRef.setInput('labels', MONEY_CONTENT['pt-br'].demo);
    el = fixture.nativeElement;
    TestBed.tick();
    input = el.querySelector('#mo-amount') as HTMLInputElement;
  });

  it('não mostra erro antes de o campo ser tocado', () => {
    type('abc');

    expect(error()).toBe('');
  });

  it('texto que não é dinheiro vira erro do campo depois do blur', () => {
    type('abc');
    blur();

    expect(error()).toBe('Informe um valor em reais, como 1.234,56.');
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('o model preserva o último número válido enquanto o texto está inválido', () => {
    type('50,00');
    type('50,0x');

    expect(metric('Valor no model')?.textContent).toContain('50 (number)');
    expect(metric('Leitura do texto')?.textContent).toContain('falhou');
  });

  it.each([
    ['0,00', 'O valor mínimo é R$ 0,01.'],
    ['10.000,01', 'O valor máximo é R$ 10.000,00.'],
  ])('as regras comparam o número: "%s"', (text, message) => {
    type(text);
    blur();

    expect(error()).toBe(message);
  });

  it('campo vazio é obrigatório', () => {
    blur();

    expect(error()).toBe('Informe um valor.');
  });

  it('valor válido não tem erro e ganha o formato canônico', () => {
    type('1234,5');
    blur();

    expect(error()).toBe('');
    expect(input.value).toBe('1.234,50');
    expect(input.getAttribute('aria-invalid')).toBe('false');
  });

  it('o campo tem rótulo associado e a descrição aponta para a dica', () => {
    expect(el.querySelector('label[for=mo-amount]')).not.toBeNull();
    expect(input.getAttribute('aria-describedby')).toContain('mo-amount-hint');
  });
});
