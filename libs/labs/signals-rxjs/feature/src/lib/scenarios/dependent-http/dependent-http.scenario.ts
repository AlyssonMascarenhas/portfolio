import { httpResource } from '@angular/common/http';
import { Component, computed, inject, signal, untracked } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  LAB_PRODUCT_CATEGORIES,
  LabProduct,
  LabProductCategory,
} from '@portfolio/contracts';
import { Subject, merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import {
  FAILED,
  IDLE,
  LOADING,
  LabProductsApi,
  ProductListState,
} from '../../scenario/lab-products.api';
import { ProductList } from '../../scenario/product-list';
import { DEPENDENT_HTTP_CONTENT } from './dependent-http.content';
import { localized } from '@portfolio/i18n';
import {
  Counters,
  InstrumentationPanel,
  Metric,
  RequestLog,
  ScenarioPage,
  tracked,
} from '@portfolio/lab-kit';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FieldsetModule } from 'primeng/fieldset';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'pf-dependent-http-scenario',
  imports: [
    ScenarioPage,
    ProductList,
    InstrumentationPanel,
    RadioButtonModule,
    FieldsetModule,
    FormsModule,
  ],
  template: `
    <pf-scenario-page [text]="text()">
      <p-fieldset [legend]="text().demo.category" class="group">
        @for (option of categories(); track option.id) {
          <div class="option">
            <p-radiobutton
              inputId="category-{{ option.id }}"
              name="category"
              [value]="option.id"
              [ngModel]="category()"
              (ngModelChange)="category.set($event)"
            />
            <label [for]="'category-' + option.id">{{ option.label }}</label>
          </div>
        }
      </p-fieldset>
      <p class="hint">{{ text().demo.hint }}</p>

      <div class="columns">
        <section aria-labelledby="col-rxjs">
          <h2 id="col-rxjs">{{ text().demo.rxjsColumn }}</h2>
          <pf-product-list [state]="viaRxjs()" (retry)="retry$.next()" />
        </section>
        <section aria-labelledby="col-resource">
          <h2 id="col-resource">{{ text().demo.resourceColumn }}</h2>
          <pf-product-list
            [state]="resourceState()"
            (retry)="viaResource.reload()"
          />
        </section>
      </div>

      <pf-instrumentation-panel [metrics]="metrics()" />
    </pf-scenario-page>
  `,
  styles: `
    fieldset {
      border: 1px solid var(--color-border);
      border-radius: 0.5rem;
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem 1rem;
    }
    .hint {
      color: var(--color-muted);
      font-size: 0.9rem;
    }
    .columns {
      display: grid;
      gap: var(--space);
      grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
    }
    .columns h2 {
      font-size: 1rem;
    }
  `,
})
export class DependentHttpScenario {
  protected readonly text = localized(DEPENDENT_HTTP_CONTENT);
  private readonly api = inject(LabProductsApi);
  private readonly rxjsLog = new RequestLog();
  private readonly resourceRequests = new Counters();
  protected readonly retry$ = new Subject<void>();

  protected readonly category = signal<LabProductCategory>('keyboards');

  // #region dependent-http-rxjs
  protected readonly viaRxjs = toSignal(
    merge(
      toObservable(this.category),
      this.retry$.pipe(map(() => this.category())),
    ).pipe(
      switchMap((category) =>
        this.fetch(category).pipe(
          map((items): ProductListState => ({ status: 'ready', items })),
          startWith(LOADING),
          catchError(() => of(FAILED)),
        ),
      ),
    ),
    { initialValue: LOADING },
  );
  // #endregion

  // #region dependent-http-resource
  protected readonly viaResource = httpResource<LabProduct[]>(() =>
    this.request(this.category()),
  );
  // #endregion

  protected readonly resourceState = computed<ProductListState>(() => {
    const resource = this.viaResource;
    if (resource.error()) return FAILED;
    if (resource.isLoading()) return LOADING;
    return resource.hasValue()
      ? { status: 'ready', items: resource.value() }
      : IDLE;
  });

  /** Instrumentação do lado RxJS: registra início, resposta e cancelamento. */
  private fetch(category: LabProductCategory) {
    return this.api.search({ category }).pipe(tracked(this.rxjsLog, category));
  }

  /** Instrumentação do lado resource: conta cada vez que a função de request é reavaliada. */
  private request(category: LabProductCategory) {
    untracked(() => this.resourceRequests.increment('requests'));
    return this.api.request({ category });
  }

  protected readonly categories = computed(() =>
    LAB_PRODUCT_CATEGORIES.map((id) => ({
      id,
      label: this.text().demo.categories[id],
    })),
  );

  protected readonly metrics = computed<Metric[]>(() => {
    const { demo } = this.text();
    return [
      { label: demo.firedRxjs, value: this.rxjsLog.fired() },
      { label: demo.canceledRxjs, value: this.rxjsLog.canceled() },
      {
        label: demo.firedResource,
        value: this.resourceRequests.snapshot()['requests'] ?? 0,
      },
    ];
  });
}
