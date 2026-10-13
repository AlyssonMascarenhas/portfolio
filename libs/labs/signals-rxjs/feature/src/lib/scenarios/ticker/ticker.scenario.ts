import { Component, computed, inject, signal } from '@angular/core';
import { TickerFeed } from './ticker-feed';
import { TickerPrice } from './ticker-price/ticker-price';
import { TICKER_CONTENT } from './ticker.content';
import { localized } from '@portfolio/i18n';
import { InstrumentationPanel, Metric, ScenarioPage } from '@portfolio/lab-kit';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'pf-ticker-scenario',
  imports: [ScenarioPage, TickerPrice, InstrumentationPanel, ButtonModule],
  providers: [TickerFeed],
  templateUrl: './ticker.scenario.html',
  styleUrl: './ticker.scenario.scss',
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
