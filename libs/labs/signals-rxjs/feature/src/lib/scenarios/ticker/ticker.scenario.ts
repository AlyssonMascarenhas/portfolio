import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { toBcp47 } from '@portfolio/contracts';
import { TickerFeed } from './ticker-feed';
import { TICKER_CONTENT } from './ticker.content';
import { LanguageService, localized } from '@portfolio/i18n';
import { InstrumentationPanel, Metric, ScenarioPage } from '@portfolio/lab-kit';
import { ButtonModule } from 'primeng/button';

/** O componente que consome o feed. Ao ser destruído, a assinatura é encerrada. */
@Component({
  selector: 'pf-ticker-price',
  template: `<output>{{ formatted() }}</output>`,
  styles: `
    output {
      font-size: 1.5rem;
      font-variant-numeric: tabular-nums;
      font-weight: 600;
    }
  `,
})
export class TickerPrice {
  private readonly feed = inject(TickerFeed);
  private readonly language = inject(LanguageService);

  // #region ticker-edge
  // O fluxo continua em RxJS; toSignal só entrega o último valor ao template.
  // A assinatura é encerrada automaticamente quando este componente é destruído.
  protected readonly price = toSignal(this.feed.stream$);
  // #endregion

  protected readonly formatted = computed(() => {
    const price = this.price();
    return price === undefined
      ? ''
      : new Intl.NumberFormat(toBcp47(this.language.current()), {
          style: 'currency',
          currency: 'USD',
        }).format(price);
  });
}

@Component({
  selector: 'pf-ticker-scenario',
  imports: [ScenarioPage, TickerPrice, InstrumentationPanel, ButtonModule],
  providers: [TickerFeed],
  template: `
    <pf-scenario-page [text]="text()">
      <p class="price">
        {{ text().demo.price }}:
        @if (mounted()) {
          <pf-ticker-price />
        } @else {
          <span class="destroyed">{{ text().demo.destroyed }}</span>
        }
      </p>
      <button pButton type="button" (click)="mounted.update((value) => !value)">
        {{ mounted() ? text().demo.destroy : text().demo.recreate }}
      </button>
      <p class="hint">{{ text().demo.hint }}</p>

      <pf-instrumentation-panel [metrics]="metrics()" />
    </pf-scenario-page>
  `,
  styles: `
    .destroyed,
    .hint {
      color: var(--color-muted);
      font-size: 0.9rem;
    }
  `,
})
export class TickerScenario {
  protected readonly text = localized(TICKER_CONTENT);
  private readonly feed = inject(TickerFeed);
  protected readonly mounted = signal(true);

  protected readonly metrics = computed<Metric[]>(() => {
    const { demo } = this.text();
    const counts = this.feed.counters.snapshot();
    return [
      { label: demo.activeSubscriptions, value: counts['subscriptions'] ?? 0 },
      { label: demo.emissions, value: counts['emissions'] ?? 0 },
    ];
  });
}
