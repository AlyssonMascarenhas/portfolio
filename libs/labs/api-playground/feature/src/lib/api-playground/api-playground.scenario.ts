import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  LAB_ORDER_SCENARIOS,
  LabOrder,
  LabOrderScenario,
} from '@portfolio/contracts';
import { localized } from '@portfolio/i18n';
import { InstrumentationPanel, Metric, ScenarioPage } from '@portfolio/lab-kit';
import {
  AttemptTrace,
  DomainError,
  PlaygroundApi,
  mapHttpError,
} from '@portfolio/labs/api-playground/data-access';
import { Subject, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { API_PLAYGROUND_CONTENT } from './api-playground.content';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { FieldsetModule } from 'primeng/fieldset';
import { MessageModule } from 'primeng/message';
import { FormsModule } from '@angular/forms';

type PlaygroundState =
  | { status: 'idle' }
  | { status: 'sending' }
  | { status: 'success'; order: LabOrder }
  | { status: 'error'; error: DomainError };

const IDLE: PlaygroundState = { status: 'idle' };

@Component({
  selector: 'pf-api-playground-scenario',
  imports: [
    ScenarioPage,
    InstrumentationPanel,
    ButtonModule,
    RadioButtonModule,
    CheckboxModule,
    FieldsetModule,
    FormsModule,
    MessageModule,
  ],
  templateUrl: './api-playground.scenario.html',
  styleUrl: './api-playground.scenario.scss',
})
export class ApiPlaygroundScenario {
  protected readonly text = localized(API_PLAYGROUND_CONTENT);
  private readonly api = inject(PlaygroundApi);
  protected readonly trace = inject(AttemptTrace);

  protected readonly scenario = signal<LabOrderScenario>('ok');
  protected readonly idempotencyKey = signal(true);
  protected readonly send$ = new Subject<void>();

  // #region api-send-pipeline
  // A tela só enxerga sucesso ou DomainError: nenhum status HTTP chega até aqui.
  protected readonly state = toSignal(
    this.send$.pipe(
      map(() => ({
        scenario: this.scenario(),
        idempotencyKey: this.idempotencyKey(),
      })),
      switchMap(({ scenario, idempotencyKey }) =>
        this.api.createOrder(scenario, { idempotencyKey }).pipe(
          map((order): PlaygroundState => ({ status: 'success', order })),
          catchError((error: unknown) =>
            of<PlaygroundState>({
              status: 'error',
              error: mapHttpError(error),
            }),
          ),
          startWith<PlaygroundState>({ status: 'sending' }),
        ),
      ),
    ),
    { initialValue: IDLE },
  );
  // #endregion

  protected readonly scenarioOptions = computed(() =>
    LAB_ORDER_SCENARIOS.map((id) => ({
      id,
      label: this.text().demo.scenarios[id],
    })),
  );

  /** Resultado pronto para o template: texto por tipo de erro e mensagens por campo. */
  protected readonly outcome = computed(() => {
    const state = this.state();
    const { demo } = this.text();
    if (state.status === 'success') {
      return {
        kind: 'success' as const,
        message: demo.successMessage.replace('{id}', state.order.id),
      };
    }
    if (state.status !== 'error') return undefined;

    const { error } = state;
    return {
      kind: 'error' as const,
      ...demo.kinds[error.kind],
      retryable: error.retryable,
      correlationId: error.details.correlationId,
      fieldErrors: (error.details.fieldErrors ?? []).map((field) => ({
        name: demo.fields[field.field] ?? field.field,
        message: demo.fieldCodes[field.code] ?? demo.fieldUnknown,
      })),
    };
  });

  protected readonly steps = computed(() => {
    const { demo } = this.text();
    const state = this.state();
    const done = state.status === 'success' || state.status === 'error';
    const attempts = this.trace.attempts();
    const failure = state.status === 'error' ? state.error : undefined;

    return [
      {
        label: demo.stepRequest,
        detail: `POST /api/lab/orders?scenario=${this.scenario()}`,
      },
      {
        label: demo.stepInterceptors,
        detail: attempts ? demo.attempts.replace('{n}', String(attempts)) : '—',
      },
      {
        label: demo.stepMapper,
        detail: !done
          ? '—'
          : failure
            ? `${failure.details.status ?? 'timeout'} → ${failure.kind}`
            : demo.noMapping,
      },
      {
        label: demo.stepDomainError,
        detail: failure ? failure.kind : '—',
      },
      {
        label: demo.stepUi,
        detail: !done
          ? '—'
          : failure
            ? demo.kinds[failure.kind].title
            : demo.uiSuccess,
      },
    ];
  });

  protected readonly metrics = computed<Metric[]>(() => {
    const { demo } = this.text();
    const state = this.state();
    return [
      { label: demo.metricAttempts, value: this.trace.attempts() },
      {
        label: demo.metricResult,
        value:
          state.status === 'success'
            ? demo.resultSuccess
            : state.status === 'error'
              ? state.error.kind
              : '—',
      },
    ];
  });
}
