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
  templateUrl: './experience-page.html',
  styleUrl: './experience-page.scss',
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
