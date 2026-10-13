import { Component, computed, signal } from '@angular/core';
import { LOCAL_STATE_CONTENT } from './local-state.content';
import { localized } from '@portfolio/i18n';
import { InstrumentationPanel, Metric, ScenarioPage } from '@portfolio/lab-kit';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'pf-local-state-scenario',
  imports: [ScenarioPage, InstrumentationPanel, ButtonModule],
  templateUrl: './local-state.scenario.html',
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
