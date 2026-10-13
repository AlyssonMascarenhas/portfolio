import { Component, computed, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { LogEntry, LogState } from '../request-log';

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
  templateUrl: './instrumentation-panel.html',
  styleUrl: './instrumentation-panel.scss',
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
