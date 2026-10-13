import { Component, computed, signal } from '@angular/core';
import { LOCAL_STATE_CONTENT } from './local-state.content';
import { localized } from '@portfolio/i18n';
import { InstrumentationPanel, Metric, ScenarioPage } from '@portfolio/lab-kit';

@Component({
  selector: 'pf-local-state-scenario',
  imports: [ScenarioPage, InstrumentationPanel],
  template: `
    <pf-scenario-page [text]="text()">
      <button
        type="button"
        aria-controls="details-panel"
        [attr.aria-expanded]="isOpen()"
        (click)="toggle()"
      >
        {{ text().demo.toggle }}
      </button>
      @if (isOpen()) {
        <p id="details-panel">{{ text().demo.panel }}</p>
      }

      <pf-instrumentation-panel [metrics]="metrics()" />
    </pf-scenario-page>
  `,
})
export class LocalStateScenario {
  protected readonly text = localized(LOCAL_STATE_CONTENT);

  // #region local-state
  protected readonly isOpen = signal(false);

  protected toggle(): void {
    this.isOpen.update((open) => !open);
  }
  // #endregion

  protected readonly metrics = computed<Metric[]>(() => [
    { label: this.text().demo.currentValue, value: String(this.isOpen()) },
  ]);
}
