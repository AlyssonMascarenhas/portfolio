import {
  Component,
  WritableSignal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toBcp47 } from '@portfolio/contracts';
import { DERIVED_STATE_CONTENT } from './derived-state.content';
import { LanguageService, localized } from '@portfolio/i18n';
import {
  Counters,
  InstrumentationPanel,
  Metric,
  ScenarioPage,
} from '@portfolio/lab-kit';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'pf-derived-state-scenario',
  imports: [ScenarioPage, InstrumentationPanel, InputTextModule],
  templateUrl: './derived-state.scenario.html',
  styleUrl: './derived-state.scenario.scss',
})
export class DerivedStateScenario {
  protected readonly text = localized(DERIVED_STATE_CONTENT);
  private readonly language = inject(LanguageService);
  private readonly recalculations = new Counters();

  // #region derived-state
  protected readonly price = signal(120);
  protected readonly quantity = signal(2);
  protected readonly discountPercent = signal(10);
  protected readonly note = signal('');

  protected readonly subtotal = computed(() => {
    this.recalculations.increment('subtotal'); // só instrumentação
    return this.price() * this.quantity();
  });
  protected readonly discount = computed(() => {
    this.recalculations.increment('discount'); // só instrumentação
    return (this.subtotal() * this.discountPercent()) / 100;
  });
  protected readonly total = computed(() => {
    this.recalculations.increment('total'); // só instrumentação
    return this.subtotal() - this.discount();
  });
  // #endregion

  private readonly money = computed(
    () =>
      new Intl.NumberFormat(toBcp47(this.language.current()), {
        style: 'currency',
        currency: 'BRL',
      }),
  );

  protected readonly summary = computed(() => ({
    subtotal: this.money().format(this.subtotal()),
    discount: this.money().format(this.discount()),
    total: this.money().format(this.total()),
  }));

  protected readonly metrics = computed<Metric[]>(() => {
    const counts = this.recalculations.snapshot();
    const { demo } = this.text();
    return [
      { label: demo.recalcSubtotal, value: counts['subtotal'] ?? 0 },
      { label: demo.recalcDiscount, value: counts['discount'] ?? 0 },
      { label: demo.recalcTotal, value: counts['total'] ?? 0 },
    ];
  });

  protected setNumber(target: WritableSignal<number>, event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    target.set(Number.isFinite(value) ? value : 0);
  }

  protected setNote(event: Event): void {
    this.note.set((event.target as HTMLInputElement).value);
  }
}
