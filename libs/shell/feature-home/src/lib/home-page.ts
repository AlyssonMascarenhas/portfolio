import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { YearMonth } from '@portfolio/contracts';
import { PortfolioContentService } from '@portfolio/shell/data-access';

function yearsSince(start: YearMonth, now: Date): number {
  const [year, month] = start.split('-').map(Number);
  const months = (now.getFullYear() - year) * 12 + (now.getMonth() + 1 - month);
  return Math.floor(months / 12);
}

@Component({
  selector: 'pf-home-page',
  imports: [TranslatePipe, RouterLink],
  template: `
    @if (profile.error()) {
      <div role="alert" class="state page">
        <p>{{ 'home.loadError' | translate }}</p>
        <button type="button" (click)="profile.reload()">
          {{ 'common.retry' | translate }}
        </button>
      </div>
    } @else if (profile.hasValue()) {
      @let p = profile.value();

      <section class="hero page" aria-labelledby="hero-title">
        <h1 id="hero-title">{{ p.name }}</h1>
        <p class="headline">{{ p.headline }}</p>
        <p class="tagline">{{ p.tagline }}</p>
        <p class="meta">
          {{ 'hero.yearsOfExperience' | translate: { years: years() } }} ·
          {{ p.sectors }} · {{ p.location }}
        </p>
        <nav class="actions" aria-label="{{ 'hero.actionsLabel' | translate }}">
          <a routerLink="/experience">{{
            'hero.cta.experience' | translate
          }}</a>
          @if (p.links.resume; as resume) {
            <a [href]="resume" download>{{ 'hero.cta.resume' | translate }}</a>
          }
        </nav>
      </section>

      <section class="page" aria-labelledby="about-title">
        <h2 id="about-title">{{ 'about.title' | translate }}</h2>
        @for (paragraph of p.about; track $index) {
          <p>{{ paragraph }}</p>
        }
      </section>

      <section class="page" aria-labelledby="skills-title">
        <h2 id="skills-title">{{ 'skills.title' | translate }}</h2>
        @if (skills.hasValue()) {
          @for (group of skills.value(); track group.id) {
            <h3>{{ group.title }}</h3>
            <ul class="tags">
              @for (item of group.items; track item) {
                <li>{{ item }}</li>
              }
            </ul>
          }
        } @else if (skills.error()) {
          <p role="alert">{{ 'skills.loadError' | translate }}</p>
        }
      </section>

      <section class="page" aria-labelledby="education-title">
        <h2 id="education-title">{{ 'education.title' | translate }}</h2>
        @for (item of p.education; track item.institution) {
          <p>
            <strong>{{ item.degree }}</strong
            ><br />
            {{ item.institution }} ({{ item.period.start.slice(0, 4) }}–{{
              item.period.end?.slice(0, 4)
            }})
          </p>
        }
      </section>

      <section class="page" id="contact" aria-labelledby="contact-title">
        <h2 id="contact-title">{{ 'contact.title' | translate }}</h2>
        <ul class="contact">
          <li>
            <a [href]="'mailto:' + p.links.email">{{
              'contact.email' | translate
            }}</a>
          </li>
          <li>
            <a [href]="p.links.linkedin" target="_blank" rel="noopener">{{
              'contact.linkedin' | translate
            }}</a>
          </li>
          @if (p.links.github; as github) {
            <li>
              <a [href]="github" target="_blank" rel="noopener">{{
                'contact.github' | translate
              }}</a>
            </li>
          }
        </ul>
      </section>
    } @else {
      <p class="state page" aria-busy="true">
        {{ 'common.loading' | translate }}
      </p>
    }
  `,
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
