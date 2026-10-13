import { Component, computed, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { localized } from '@portfolio/i18n';
import { InstrumentationPanel, Metric, ScenarioPage } from '@portfolio/lab-kit';
import { QualityReportService } from '@portfolio/labs/quality/data-access';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { filterReport } from '../quality-report/quality-filter';
import { QualityReportView } from '../quality-report/quality-report';
import { QUALITY_CONTENT } from './quality.content';

@Component({
  selector: 'pf-quality-scenario',
  imports: [
    TranslatePipe,
    ButtonModule,
    MessageModule,
    ScenarioPage,
    InstrumentationPanel,
    QualityReportView,
  ],
  templateUrl: './quality.scenario.html',
  styleUrl: './quality.scenario.scss',
})
export class QualityScenario {
  protected readonly text = localized(QUALITY_CONTENT);
  protected readonly report = inject(QualityReportService).report;
  protected readonly query = signal('');

  protected readonly metrics = computed<Metric[]>(() => {
    if (!this.report.hasValue()) return [];
    const report = this.report.value();
    const { demo } = this.text();
    return [
      { label: demo.metricScenarios, value: report.totals.scenarios },
      {
        label: demo.metricShown,
        value: filterReport(report, this.query()).shown,
      },
      { label: demo.metricAreas, value: report.totals.areas },
    ];
  });
}
