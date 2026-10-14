import { TestBed } from '@angular/core/testing';
import { MoneyInput } from './money-input';

describe('MoneyInput', () => {
  function setup(initial: number | null = null) {
    const fixture = TestBed.createComponent(MoneyInput);
    fixture.componentRef.setInput('inputId', 'amount');
    fixture.componentRef.setInput('value', initial);
    TestBed.tick();
    const input = fixture.nativeElement.querySelector(
      'input',
    ) as HTMLInputElement;
    const type = (text: string) => {
      input.value = text;
      input.dispatchEvent(new Event('input'));
      TestBed.tick();
    };
    return { fixture, input, type };
  }

  it('mostra o model formatado no campo', () => {
    const { input } = setup(1234.5);

    expect(input.value).toBe('1.234,50');
  });

  it('digitar um valor válido atualiza o model com número', () => {
    const { fixture, type } = setup();

    type('1.234,56');

    expect(fixture.componentInstance.value()).toBe(1234.56);
  });

  it('texto inválido não altera o model e expõe o erro de parse', () => {
    const { fixture, input, type } = setup(50);

    type('abc');

    expect(fixture.componentInstance.value()).toBe(50);
    expect(input.value).toBe('abc');
    expect(fixture.componentInstance.raw.parseErrors()[0]?.kind).toBe('parse');
  });

  it('esvaziar o campo leva o model a null', () => {
    const { fixture, type } = setup(10);

    type('');

    expect(fixture.componentInstance.value()).toBeNull();
  });

  it('ao sair do campo o texto válido é reformatado e o toque é avisado', () => {
    const { fixture, input, type } = setup();
    const touched = vi.fn();
    fixture.componentInstance.touch.subscribe(touched);
    type('1234,5');

    input.dispatchEvent(new Event('blur'));
    TestBed.tick();

    expect(input.value).toBe('1.234,50');
    expect(touched).toHaveBeenCalledOnce();
  });

  it('ao sair do campo o texto inválido fica como foi digitado', () => {
    const { input, type } = setup();
    type('abc');

    input.dispatchEvent(new Event('blur'));
    TestBed.tick();

    expect(input.value).toBe('abc');
  });

  it('uma mudança do model vinda de fora atualiza o texto', () => {
    const { fixture, input } = setup(1);

    fixture.componentRef.setInput('value', 99.9);
    TestBed.tick();

    expect(input.value).toBe('99,90');
  });
});
