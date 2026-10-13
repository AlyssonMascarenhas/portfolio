import { Component, computed, inject, signal } from '@angular/core';
import { toBcp47 } from '@portfolio/contracts';
import { CartStore } from './cart.store';
import { SHARED_STATE_CONTENT } from './shared-state.content';
import { LanguageService, localized } from '@portfolio/i18n';
import {
  InstrumentationPanel,
  LogEntry,
  Metric,
  ScenarioPage,
} from '@portfolio/lab-kit';
import { ButtonModule } from 'primeng/button';

type Page = 'catalog' | 'checkout';

@Component({
  selector: 'pf-shared-state-scenario',
  imports: [ScenarioPage, InstrumentationPanel, ButtonModule],
  providers: [CartStore],
  templateUrl: './shared-state.scenario.html',
  styleUrl: './shared-state.scenario.scss',
})
export class SharedStateScenario {
  protected readonly text = localized(SHARED_STATE_CONTENT);
  protected readonly store = inject(CartStore);
  private readonly language = inject(LanguageService);

  protected readonly page = signal<Page>('catalog');

  private nextEventId = 1;
  protected readonly events = signal<readonly LogEntry[]>([]);

  protected readonly money = computed(
    () =>
      new Intl.NumberFormat(toBcp47(this.language.current()), {
        style: 'currency',
        currency: 'BRL',
      }),
  );

  protected readonly metrics = computed<Metric[]>(() => {
    const { demo } = this.text();
    return [
      { label: demo.units, value: this.store.count() },
      { label: demo.lines, value: this.store.items().length },
    ];
  });

  protected add(product: { id: number; name: string; price: number }): void {
    this.store.add(product);
    this.log(`${this.text().demo.eventAdded}: ${product.name}`);
  }

  protected remove(item: { id: number; name: string }): void {
    this.store.remove(item.id);
    this.log(`${this.text().demo.eventRemoved}: ${item.name}`);
  }

  private log(text: string): void {
    this.events.update((list) =>
      [{ id: this.nextEventId++, text, state: 'info' as const }, ...list].slice(
        0,
        8,
      ),
    );
  }
}
