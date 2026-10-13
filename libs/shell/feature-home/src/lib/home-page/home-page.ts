import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { YearMonth } from '@portfolio/contracts';
import { PortfolioContentService } from '@portfolio/shell/data-access';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';

function yearsSince(start: YearMonth, now: Date): number {
  const [year, month] = start.split('-').map(Number);
  const months = (now.getFullYear() - year) * 12 + (now.getMonth() + 1 - month);
  return Math.floor(months / 12);
}

@Component({
  selector: 'pf-home-page',
  imports: [
    TranslatePipe,
    RouterLink,
    ButtonModule,
    CardModule,
    MessageModule,
    TagModule,
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  private readonly content = inject(PortfolioContentService);
  protected readonly profile = this.content.profile;
  protected readonly skills = this.content.skills;

  protected readonly years = computed(() =>
    this.profile.hasValue()
      ? yearsSince(this.profile.value().careerStart, new Date())
      : 0,
  );
}
