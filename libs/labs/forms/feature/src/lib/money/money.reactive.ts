import {
  AbstractControl,
  ControlValueAccessor,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { formatMoney, parseMoney } from './money-format';

// #region forms-money-reactive
/**
 * O mesmo campo de moeda para Reactive Forms: um ControlValueAccessor. A conversão fica espalhada
 * em quatro lugares (writeValue, input, blur e validate); o último parse com erro precisa ser
 * guardado à mão e o validador precisa ser avisado para rodar de novo, já que o model não mudou.
 */
export class MoneyReactiveAccessor implements ControlValueAccessor, Validator {
  text = '';
  private parseFailed = false;
  private onChange: (value: number | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  private onValidatorChange: () => void = () => undefined;

  /** Model -> tela. */
  writeValue(value: number | null): void {
    this.parseFailed = false;
    this.text = formatMoney(value);
  }

  /** Tela -> model: texto inválido não chega ao model, mas precisa avisar o validador. */
  handleInput(text: string): void {
    this.text = text;
    const result = parseMoney(text);
    this.parseFailed = result.error !== undefined;
    if (result.value !== undefined) this.onChange(result.value);
    this.onValidatorChange();
  }

  handleBlur(value: number | null): void {
    if (!this.parseFailed) this.text = formatMoney(value);
    this.onTouched();
  }

  validate(_control: AbstractControl): ValidationErrors | null {
    return this.parseFailed ? { parse: true } : null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
// #endregion
