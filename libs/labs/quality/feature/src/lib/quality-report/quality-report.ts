import {
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  model,
} from '@angular/core';
import { QualityReport, toBcp47 } from '@portfolio/contracts';
import { LanguageService } from '@portfolio/i18n';
import { AccordionModule } from 'primeng/accordion';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { QualityDemoText } from '../quality/quality.content';
import { fill, filterReport } from './quality-filter';

/**
 * Os cenários garantidos pelos testes, agrupados por área, com busca, e a cobertura só como
 * contexto. Apresentação pura: recebe o relatório e os textos, e devolve a busca por `query`.
 */
@Component({
  selector: 'pf-quality-report',
  imports: [AccordionModule, InputTextModule, TagModule],
  templateUrl: './quality-report.html',
  styleUrl: './quality-report.scss',
})
export class QualityReportView {
  readonly report = input.required<QualityReport>();
  readonly labels = input.required<QualityDemoText>();
  readonly query = model('');

  private readonly language = inject(LanguageService);

  private readonly filtered = computed(() =>
    filterReport(this.report(), this.query()),
  );

  protected readonly countLabel = computed(() =>
    fill(this.labels().count, {
      shown: this.filtered().shown,
      total: this.report().totals.scenarios,
    }),
  );

  /** Áreas com os textos que dependem do idioma já montados (nada de métodos no template). */
  protected readonly areas = computed(() => {
    const labels = this.labels();
    return this.filtered().areas.map((area) => ({
      ...area,
      countLabel: fill(
        area.scenarioCount === 1 ? labels.areaCountOne : labels.areaCount,
        { n: area.scenarioCount },
      ),
      specs: area.specs.map((spec) => ({
        ...spec,
        scenarios: spec.scenarios.map((scenario) => ({
          ...scenario,
          casesLabel:
            scenario.cases > 1
              ? fill(labels.cases, { n: scenario.cases })
              : undefined,
        })),
      })),
    }));
  });

  /** Com busca, tudo abre para mostrar os resultados; sem busca, tudo fecha. A pessoa pode ajustar. */
  protected readonly open = linkedSignal<string[]>(() =>
    this.query().trim() ? this.areas().map((area) => area.project) : [],
  );

  protected readonly generatedAt = computed(() =>
    new Intl.DateTimeFormat(toBcp47(this.language.current()), {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(this.report().generatedAt)),
  );

  protected readonly coverageRows = computed(() =>
    this.report().areas.flatMap((area) =>
      area.coverage ? [{ project: area.project, ...area.coverage }] : [],
    ),
  );

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected onToggle(value: unknown): void {
    if (Array.isArray(value)) this.open.set(value.map(String));
    else this.open.set(value == null ? [] : [String(value)]);
  }
}
