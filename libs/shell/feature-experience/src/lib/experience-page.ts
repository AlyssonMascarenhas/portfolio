import { Component, computed, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { YearMonth, toBcp47 } from '@portfolio/contracts';
import { LanguageService } from '@portfolio/i18n';
import { PortfolioContentService } from '@portfolio/shell/data-access';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';

/** 'yyyy-mm' -> 'jan. de 2025' / 'Jan 2025'. Meio-dia evita erro de fuso horário. */
function formatYearMonth(
  formatter: Intl.DateTimeFormat,
  value: YearMonth,
): string {
  return formatter.format(new Date(`${value}-01T12:00:00`));
}

@Component({
  selector: 'pf-experience-page',
  imports: [TranslatePipe, ButtonModule, CardModule, MessageModule, TagModule],
  template: `
    <section class="page" aria-labelledby="experience-title">
      <h1 id="experience-title">{{ 'experience.title' | translate }}</h1>

      @if (experience.error()) {
        <div class="state">
          <p-message severity="error">{{
            'experience.loadError' | translate
          }}</p-message>
          <button
            pButton
            type="button"
            class="retry"
            (click)="experience.reload()"
          >
            {{ 'common.retry' | translate }}
          </button>
        </div>
      } @else if (experience.isLoading()) {
        <p class="state" aria-busy="true">{{ 'common.loading' | translate }}</p>
      } @else {
        <ol class="timeline">
          @for (entry of entries(); track entry.id) {
            <li>
              <p-card>
                <ng-template #title
                  ><h2>{{ entry.company }}</h2></ng-template
                >
                <ng-template #subtitle>
                  <span class="period">
                    {{ entry.startLabel }} –
                    {{ entry.endLabel ?? ('experience.present' | translate) }}
                  </span>
                </ng-template>

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

                <ul class="stack">
                  @for (tech of entry.stack; track tech) {
                    <li>
                      <p-tag
                        [value]="tech"
                        severity="secondary"
                        [rounded]="true"
                      />
                    </li>
                  }
                </ul>
              </p-card>
            </li>
          }
        </ol>
      }
    </section>
  `,
  styles: `
    .timeline {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: var(--space);
    }
    h2 {
      margin: 0;
    }
    .roles {
      padding: 0;
      margin: 0 0 0.75rem;
      list-style: none;
      font-weight: 600;
    }
    .highlights {
      padding-left: 1.25rem;
    }
    .highlights li {
      margin-bottom: 0.4rem;
    }
    .retry {
      margin-top: 0.75rem;
    }
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
