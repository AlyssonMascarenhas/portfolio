import { Component, computed, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { LogEntry, LogState } from './request-log';

export interface Metric {
  label: string;
  value: string | number;
}

type TagSeverity = 'success' | 'info' | 'danger' | 'secondary';

const SEVERITY: Record<Exclude<LogState, 'info'>, TagSeverity> = {
  pending: 'info',
  done: 'success',
  failed: 'danger',
  canceled: 'secondary',
};

/**
 * Painel que torna visível o comportamento invisível: contadores e, opcionalmente,
 * um log de eventos (linhas canceladas aparecem riscadas).
 */
@Component({
  selector: 'pf-instrumentation-panel',
  imports: [TranslatePipe, CardModule, TagModule],
  template: `
    <p-card class="panel">
      <ng-template #title
        ><h2 id="instrumentation-title">
          {{ 'lab.instrumentation.title' | translate }}
        </h2></ng-template
      >

      <dl aria-labelledby="instrumentation-title">
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
              <li>
                @if (row.state === 'canceled') {
                  <s>{{ row.text }}</s>
                } @else {
                  {{ row.text }}
                }
                @if (row.severity; as severity) {
                  <p-tag
                    [value]="row.stateKey | translate"
                    [severity]="severity"
                    [rounded]="true"
                  />
                }
              </li>
            }
          </ol>
        } @else {
          <p class="empty">{{ 'lab.instrumentation.empty' | translate }}</p>
        }
      }
    </p-card>
  `,
  styles: `
    :host {
      display: block;
      margin-top: var(--space);
    }
    h2 {
      margin: 0;
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
    .log li {
      margin: 0.25rem 0;
    }
    .empty {
      color: var(--color-muted);
      margin: 0.75rem 0 0;
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
      severity: entry.state === 'info' ? undefined : SEVERITY[entry.state],
    })),
  );
}
