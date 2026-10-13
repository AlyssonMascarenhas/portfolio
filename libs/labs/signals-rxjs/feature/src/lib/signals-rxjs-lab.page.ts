import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LAB_INTRO, LAB_SCENARIOS } from './signals-rxjs-lab.content';
import { LanguageService } from '@portfolio/i18n';

/** Índice do lab: a ideia central, a regra prática e a lista de cenários. */
@Component({
  selector: 'pf-signals-rxjs-lab',
  imports: [RouterLink],
  template: `
    <article class="page">
      <h1>{{ intro().title }}</h1>
      <p>{{ intro().lead }}</p>

      <h2>{{ intro().rulesTitle }}</h2>
      <ul>
        @for (rule of intro().rules; track $index) {
          <li>{{ rule }}</li>
        }
      </ul>

      <h2>{{ intro().scenariosTitle }}</h2>
      <ol class="scenarios">
        @for (scenario of scenarios(); track scenario.path) {
          <li>
            <a [routerLink]="scenario.path">{{ scenario.title }}</a>
            <span>{{ scenario.summary }}</span>
          </li>
        }
      </ol>
    </article>
  `,
  styles: `
    .scenarios li {
      margin: 0.75rem 0;
    }
    .scenarios span {
      display: block;
      color: var(--color-muted);
      font-size: 0.9rem;
    }
  `,
})
export class SignalsRxjsLabPage {
  private readonly language = inject(LanguageService);

  protected readonly intro = computed(() => LAB_INTRO[this.language.current()]);
  protected readonly scenarios = computed(() =>
    LAB_SCENARIOS.map(({ path, content }) => ({
      path,
      ...content[this.language.current()],
    })),
  );
}
