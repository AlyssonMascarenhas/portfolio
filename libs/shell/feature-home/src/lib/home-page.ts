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
  template: `
    @if (profile.error()) {
      <div class="state page">
        <p-message severity="error">{{
          'home.loadError' | translate
        }}</p-message>
        <button pButton type="button" class="retry" (click)="profile.reload()">
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
        <nav
          class="actions"
          [attr.aria-label]="'hero.actionsLabel' | translate"
        >
          <a pButton routerLink="/labs">{{ 'hero.cta.labs' | translate }}</a>
          <a
            pButton
            routerLink="/experience"
            severity="secondary"
            [outlined]="true"
            >{{ 'hero.cta.experience' | translate }}</a
          >
          @if (p.links.resume; as resume) {
            <a
              pButton
              [href]="resume"
              download
              severity="secondary"
              [outlined]="true"
              >{{ 'hero.cta.resume' | translate }}</a
            >
          }
        </nav>
      </section>

      <section class="page" aria-labelledby="about-title">
        <h2 id="about-title">{{ 'about.title' | translate }}</h2>
        @for (paragraph of p.about; track $index) {
          <p>{{ paragraph }}</p>
        }
      </section>

      <section class="page" aria-labelledby="labs-title">
        <h2 id="labs-title">{{ 'home.labs.title' | translate }}</h2>
        <p>{{ 'labs.lead' | translate }}</p>
        <ul class="card-grid">
          <li>
            <p-card>
              <ng-template #title
                ><h3>
                  {{ 'labs.signalsRxjs.title' | translate }}
                </h3></ng-template
              >
              <p class="summary">
                {{ 'labs.signalsRxjs.summary' | translate }}
              </p>
              <ng-template #footer>
                <a pButton routerLink="/labs/signals-rxjs" [text]="true">{{
                  'home.labs.cta' | translate
                }}</a>
              </ng-template>
            </p-card>
          </li>
          <li>
            <p-card>
              <ng-template #title
                ><h3>
                  {{ 'labs.apiPlayground.title' | translate }}
                </h3></ng-template
              >
              <p class="summary">
                {{ 'labs.apiPlayground.summary' | translate }}
              </p>
              <ng-template #footer>
                <a pButton routerLink="/labs/api-playground" [text]="true">{{
                  'home.labs.cta' | translate
                }}</a>
              </ng-template>
            </p-card>
          </li>
        </ul>
      </section>

      <section class="page" aria-labelledby="skills-title">
        <h2 id="skills-title">{{ 'skills.title' | translate }}</h2>
        @if (skills.hasValue()) {
          @for (group of skills.value(); track group.id) {
            <h3>{{ group.title }}</h3>
            <ul class="stack">
              @for (item of group.items; track item) {
                <li>
                  <p-tag [value]="item" severity="secondary" [rounded]="true" />
                </li>
              }
            </ul>
          }
        } @else if (skills.error()) {
          <p-message severity="error">{{
            'skills.loadError' | translate
          }}</p-message>
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
        <ul class="stack">
          <li>
            <a
              pButton
              [href]="'mailto:' + p.links.email"
              severity="secondary"
              [outlined]="true"
              >{{ 'contact.email' | translate }}</a
            >
          </li>
          <li>
            <a
              pButton
              [href]="p.links.linkedin"
              target="_blank"
              rel="noopener"
              severity="secondary"
              [outlined]="true"
              >{{ 'contact.linkedin' | translate }}</a
            >
          </li>
          @if (p.links.github; as github) {
            <li>
              <a
                pButton
                [href]="github"
                target="_blank"
                rel="noopener"
                severity="secondary"
                [outlined]="true"
                >{{ 'contact.github' | translate }}</a
              >
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
  styles: `
    .headline {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--color-accent);
      margin-bottom: 0.5rem;
    }
    .tagline {
      font-size: 1.25rem;
      line-height: 1.5;
      max-width: 55ch;
    }
    .summary {
      color: var(--color-muted);
      margin: 0;
    }
    h3 {
      margin: 0;
    }
    .retry {
      margin-top: 0.75rem;
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
