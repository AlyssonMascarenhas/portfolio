import {
  Component,
  ElementRef,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';
import { FormValueControl, transformedValue } from '@angular/forms/signals';
import { InputTextModule } from 'primeng/inputtext';
import { formatMoney, parseMoney } from '../money-format';

/**
 * Campo de moeda: a pessoa digita texto ("1.234,56"), o model guarda número (1234.56).
 * Quem usa o campo só enxerga `number | null`; a conversão fica toda aqui, num lugar só.
 */
// #region forms-transformed-value
@Component({
  selector: 'pf-money-input',
  imports: [InputTextModule],
  templateUrl: './money-input.html',
})
export class MoneyInput implements FormValueControl<number | null> {
  /** O valor de negócio. É o que o formulário lê, valida e envia. */
  readonly value = model.required<number | null>();
  readonly touch = output<void>();

  readonly inputId = input.required<string>();
  readonly showInvalid = input(false);
  readonly describedBy = input<string | null>(null);

  private readonly field =
    viewChild.required<ElementRef<HTMLInputElement>>('field');

  /**
   * O que aparece no <input>. `parse` roda a cada digitação: texto válido atualiza o model;
   * texto inválido não toca no model e vira erro do campo (kind "parse").
   */
  readonly raw = transformedValue(this.value, {
    parse: parseMoney,
    format: formatMoney,
  });

  protected onInput(event: Event): void {
    this.raw.set((event.target as HTMLInputElement).value);
  }

  /** Ao sair do campo, o texto válido ganha o formato canônico; o inválido fica como foi digitado. */
  protected onBlur(): void {
    if (this.raw.parseErrors().length === 0) {
      this.raw.set(formatMoney(this.value()));
    }
    this.touch.emit();
  }

  focus(options?: FocusOptions): void {
    this.field().nativeElement.focus(options);
  }
}
// #endregion
