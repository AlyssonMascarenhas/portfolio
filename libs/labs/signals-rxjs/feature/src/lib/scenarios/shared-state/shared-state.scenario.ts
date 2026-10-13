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
  template: `
    <pf-scenario-page [text]="text()">
      <header class="site-header" [attr.aria-label]="text().demo.headerLabel">
        <nav [attr.aria-label]="text().demo.pages">
          <button
            pButton
            type="button"
            [attr.aria-current]="page() === 'catalog' ? 'page' : null"
            (click)="page.set('catalog')"
          >
            {{ text().demo.catalogTab }}
          </button>
          <button
            pButton
            type="button"
            [attr.aria-current]="page() === 'checkout' ? 'page' : null"
            (click)="page.set('checkout')"
          >
            {{ text().demo.checkoutTab }}
          </button>
        </nav>
        <span class="badge">
          {{ text().demo.cartCount }}: <strong>{{ store.count() }}</strong>
        </span>
      </header>

      @if (page() === 'catalog') {
        <ul class="products">
          @for (product of text().demo.products; track product.id) {
            <li>
              {{ product.name }} · {{ money().format(product.price) }}
              <button pButton type="button" (click)="add(product)">
                {{ text().demo.add }}
              </button>
            </li>
          }
        </ul>
      } @else {
        @if (store.items().length) {
          <ul class="products">
            @for (item of store.items(); track item.id) {
              <li>
                {{ item.quantity }} × {{ item.name }}
                <button pButton type="button" (click)="remove(item)">
                  {{ text().demo.remove }}
                </button>
              </li>
            }
          </ul>
          <p>
            {{ text().demo.total }}:
            <strong>{{ money().format(store.total()) }}</strong>
          </p>
        } @else {
          <p>{{ text().demo.empty }}</p>
        }
      }
      <p class="hint">{{ text().demo.hint }}</p>

      <pf-instrumentation-panel [metrics]="metrics()" [log]="events()" />
    </pf-scenario-page>
  `,
  styles: `
    .site-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--space);
      border: 1px solid var(--color-border);
      border-radius: 0.5rem;
      padding: 0.5rem var(--space);
    }
    nav {
      display: flex;
      gap: 0.5rem;
    }
    button[aria-current='page'] {
      border-color: var(--color-accent);
      color: var(--color-accent);
      font-weight: 600;
    }
    .products {
      padding-left: 1.25rem;
    }
    .products li {
      margin: 0.25rem 0;
    }
    .hint {
      color: var(--color-muted);
      font-size: 0.9rem;
    }
  `,
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
