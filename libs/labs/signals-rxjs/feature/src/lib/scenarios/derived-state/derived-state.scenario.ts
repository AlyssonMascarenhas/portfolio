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

@Component({
  selector: 'pf-derived-state-scenario',
  imports: [ScenarioPage, InstrumentationPanel],
  template: `
    <pf-scenario-page [text]="text()">
      <div class="fields">
        <label>
          {{ text().demo.price }}
          <input
            type="number"
            min="0"
            [value]="price()"
            (input)="setNumber(price, $event)"
          />
        </label>
        <label>
          {{ text().demo.quantity }}
          <input
            type="number"
            min="0"
            [value]="quantity()"
            (input)="setNumber(quantity, $event)"
          />
        </label>
        <label>
          {{ text().demo.discount }}
          <input
            type="number"
            min="0"
            max="100"
            [value]="discountPercent()"
            (input)="setNumber(discountPercent, $event)"
          />
        </label>
        <label>
          {{ text().demo.note }}
          <input type="text" [value]="note()" (input)="setNote($event)" />
        </label>
      </div>

      <dl class="summary">
        <dt>{{ text().demo.subtotal }}</dt>
        <dd>{{ summary().subtotal }}</dd>
        <dt>{{ text().demo.discountAmount }}</dt>
        <dd>{{ summary().discount }}</dd>
        <dt>{{ text().demo.total }}</dt>
        <dd>
          <strong>{{ summary().total }}</strong>
        </dd>
      </dl>
      <p class="hint">{{ text().demo.hint }}</p>

      <pf-instrumentation-panel [metrics]="metrics()" />
    </pf-scenario-page>
  `,
  styles: `
    .fields {
      display: grid;
      gap: 0.75rem;
      grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
    }
    label {
      display: grid;
      gap: 0.25rem;
      font-size: 0.9rem;
    }
    input {
      font: inherit;
      padding: 0.4rem;
    }
    .summary {
      display: grid;
      grid-template-columns: max-content 1fr;
      gap: 0.25rem 1rem;
      margin: var(--space) 0 0;
    }
    dd {
      margin: 0;
    }
    .hint {
      color: var(--color-muted);
      font-size: 0.9rem;
    }
  `,
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
