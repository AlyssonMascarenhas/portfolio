import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { YearMonth, toBcp47 } from '@portfolio/contracts';
import { LanguageService } from '@portfolio/i18n';
import { PortfolioContentService } from '@portfolio/shell/data-access';

/** 'yyyy-mm' -> 'jan. de 2025' / 'Jan 2025'. Meio-dia evita erro de fuso horário. */
function formatYearMonth(
  formatter: Intl.DateTimeFormat,
  value: YearMonth,
): string {
  return formatter.format(new Date(`${value}-01T12:00:00`));
}

@Component({
  selector: 'pf-experience-page',
  imports: [TranslatePipe, RouterLink],
  template: `
    <section class="page" aria-labelledby="experience-title">
      <h1 id="experience-title">{{ 'experience.title' | translate }}</h1>

      @if (experience.error()) {
        <div role="alert" class="state">
          <p>{{ 'experience.loadError' | translate }}</p>
          <button type="button" (click)="experience.reload()">
            {{ 'common.retry' | translate }}
          </button>
        </div>
      } @else if (experience.isLoading()) {
        <p class="state" aria-busy="true">{{ 'common.loading' | translate }}</p>
      } @else {
        <ol class="timeline">
          @for (entry of entries(); track entry.id) {
            <li class="timeline-entry">
              <h2>{{ entry.company }}</h2>
              <p class="period">
                {{ entry.startLabel }} –
                {{ entry.endLabel ?? ('experience.present' | translate) }}
              </p>

              <ul class="roles">
                @for (role of entry.roles; track role.title) {
                  <li>{{ role.title }}</li>
                }
              </ul>

              <p>{{ entry.context }}</p>

              <ul class="highlights">
                @for (highlight of entry.highlights; track $index) {
                  <li>{{ highlight }}</li>
                }
              </ul>

              <ul class="tags">
                @for (tech of entry.stack; track tech) {
                  <li>{{ tech }}</li>
                }
              </ul>

              @if (entry.relatedLab; as lab) {
                <a [routerLink]="lab.route">{{ lab.label }}</a>
              }
            </li>
          }
        </ol>
      }
    </section>
  `,
})
export class ExperiencePage {
  private readonly language = inject(LanguageService);
  protected readonly experience = inject(PortfolioContentService).experience;

  /** View model: datas formatadas no idioma atual, sem chamar métodos no template. */
  protected readonly entries = computed(() => {
    if (!this.experience.hasValue()) return [];

    const formatter = new Intl.DateTimeFormat(
      toBcp47(this.language.current()),
      {
        month: 'short',
        year: 'numeric',
      },
    );

    return this.experience.value().map((entry) => ({
      ...entry,
      startLabel: formatYearMonth(formatter, entry.period.start),
      endLabel: entry.period.end
        ? formatYearMonth(formatter, entry.period.end)
        : null,
    }));
  });
}
