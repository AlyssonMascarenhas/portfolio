import { FormControl, Validators } from '@angular/forms';
import { MoneyReactiveAccessor } from './money.reactive';

/** Liga o accessor a um FormControl como o Angular faz com um ControlValueAccessor de verdade. */
function connect() {
  const accessor = new MoneyReactiveAccessor();
  const control = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(0.01),
    Validators.max(10000),
    (c) => accessor.validate(c),
  ]);
  accessor.registerOnChange((value) => control.setValue(value));
  accessor.registerOnValidatorChange(() => control.updateValueAndValidity());
  return { accessor, control };
}

describe('MoneyReactiveAccessor', () => {
  it('digitar um valor válido atualiza o model com número', () => {
    const { accessor, control } = connect();

    accessor.handleInput('1.234,56');

    expect(control.value).toBe(1234.56);
    expect(control.valid).toBe(true);
  });

  it('texto inválido não altera o model e marca erro de parse', () => {
    const { accessor, control } = connect();
    accessor.handleInput('50,00');

    accessor.handleInput('abc');

    expect(control.value).toBe(50);
    expect(control.hasError('parse')).toBe(true);
  });

  it('as regras de negócio olham o número', () => {
    const { accessor, control } = connect();

    accessor.handleInput('0,00');
    expect(control.hasError('min')).toBe(true);

    accessor.handleInput('10.000,01');
    expect(control.hasError('max')).toBe(true);

    accessor.handleInput('');
    expect(control.hasError('required')).toBe(true);
  });

  it('no blur o texto válido é reformatado e o inválido fica como digitado', () => {
    const { accessor } = connect();
    accessor.handleInput('1234,5');
    accessor.handleBlur(1234.5);
    expect(accessor.text).toBe('1.234,50');

    accessor.handleInput('abc');
    accessor.handleBlur(1234.5);
    expect(accessor.text).toBe('abc');
  });

  it('writeValue mostra o model formatado e limpa o erro de parse', () => {
    const { accessor } = connect();
    accessor.handleInput('abc');

    accessor.writeValue(9.9);

    expect(accessor.text).toBe('9,90');
    expect(accessor.validate(new FormControl(null))).toBeNull();
  });
});
