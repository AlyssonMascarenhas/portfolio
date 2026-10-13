import { Component, computed, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LogEntry } from './request-log';

export interface Metric {
  label: string;
  value: string | number;
}

/**
 * Painel que torna visível o comportamento invisível: contadores e, opcionalmente,
 * um log de eventos (linhas canceladas aparecem riscadas).
 */
@Component({
  selector: 'pf-instrumentation-panel',
  imports: [TranslatePipe],
  template: `
    <section aria-labelledby="instrumentation-title">
      <h2 id="instrumentation-title">
        {{ 'lab.instrumentation.title' | translate }}
      </h2>

      <dl>
        @for (metric of metrics(); track metric.label) {
          <div>
            <dt>{{ metric.label }}</dt>
            <dd>{{ metric.value }}</dd>
          </div>
        }
      </dl>

      @if (log() !== undefined) {
        @if (rows().length) {
          <ol class="log">
            @for (row of rows(); track row.id) {
              <li [class]="row.state">
                @if (row.state === 'canceled') {
                  <s>{{ row.text }}</s>
                } @else {
                  {{ row.text }}
                }
                @if (row.state !== 'info') {
                  <span class="state">({{ row.stateKey | translate }})</span>
                }
              </li>
            }
          </ol>
        } @else {
          <p class="empty">{{ 'lab.instrumentation.empty' | translate }}</p>
        }
      }
    </section>
  `,
  styles: `
    section {
      border: 1px solid var(--color-border);
      border-radius: 0.5rem;
      padding: var(--space);
      margin-top: var(--space);
    }
    h2 {
      margin: 0 0 0.5rem;
      font-size: 1rem;
    }
    dl {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem 1.5rem;
      margin: 0;
    }
    dt {
      font-size: 0.8rem;
      color: var(--color-muted);
    }
    dd {
      margin: 0;
      font-variant-numeric: tabular-nums;
      font-weight: 600;
    }
    .log {
      margin: 0.75rem 0 0;
      padding-left: 1.25rem;
      font-size: 0.875rem;
    }
    .state,
    .empty {
      color: var(--color-muted);
    }
  `,
})
export class InstrumentationPanel {
  readonly metrics = input.required<readonly Metric[]>();
  /** Omitido, o painel mostra só os contadores. */
  readonly log = input<readonly LogEntry[]>();

  protected readonly rows = computed(() =>
    (this.log() ?? []).map((entry) => ({
      ...entry,
      stateKey: `lab.instrumentation.state.${entry.state}`,
    })),
  );
}
