import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Subject, merge, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
} from 'rxjs/operators';
import {
  FAILED,
  IDLE,
  LOADING,
  LabProductsApi,
  ProductListState,
} from '../../scenario/lab-products.api';
import { ProductList } from '../../scenario/product-list/product-list';
import { SEARCH_CONTENT } from './search.content';
import { localized } from '@portfolio/i18n';
import {
  InstrumentationPanel,
  Metric,
  RequestLog,
  ScenarioPage,
  tracked,
} from '@portfolio/lab-kit';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'pf-search-scenario',
  imports: [ScenarioPage, ProductList, InstrumentationPanel, InputTextModule],
  templateUrl: './search.scenario.html',
  styleUrl: './search.scenario.scss',
})
export class SearchScenario {
  protected readonly text = localized(SEARCH_CONTENT);
  private readonly api = inject(LabProductsApi);
  protected readonly log = new RequestLog();

  private readonly term$ = new BehaviorSubject('');
  protected readonly retry$ = new Subject<void>();

  // #region search-pipeline
  protected readonly search = toSignal(
    merge(
      this.term$.pipe(debounceTime(300), distinctUntilChanged()),
      this.retry$.pipe(map(() => this.term$.value)),
    ).pipe(
      switchMap((term) =>
        term.trim()
          ? this.fetch(term.trim()).pipe(
              map((items): ProductListState => ({ status: 'ready', items })),
              startWith(LOADING),
              catchError(() => of(FAILED)),
            )
          : of(IDLE),
      ),
    ),
    { initialValue: IDLE },
  );
  // #endregion

  /** Instrumentação: registra início, resposta e cancelamento de cada requisição. */
  private fetch(term: string) {
    return this.api.search({ q: term }).pipe(tracked(this.log, term));
  }

  protected readonly metrics = computed<Metric[]>(() => {
    const { demo } = this.text();
    return [
      { label: demo.fired, value: this.log.fired() },
      { label: demo.canceled, value: this.log.canceled() },
      { label: demo.done, value: this.log.done() },
    ];
  });

  protected onInput(event: Event): void {
    this.term$.next((event.target as HTMLInputElement).value);
  }
}
