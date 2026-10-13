import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

/** Índice dos labs. Só lista e linka: o conteúdo de cada lab vive na rota dele, carregada sob demanda. */
@Component({
  selector: 'pf-labs-page',
  imports: [TranslatePipe, RouterLink],
  template: `
    <section class="page" aria-labelledby="labs-title">
      <h1 id="labs-title">{{ 'labs.title' | translate }}</h1>
      <p>{{ 'labs.lead' | translate }}</p>

      <ul class="labs">
        <li>
          <h2>
            <a routerLink="/labs/signals-rxjs">{{
              'labs.signalsRxjs.title' | translate
            }}</a>
          </h2>
          <p>{{ 'labs.signalsRxjs.summary' | translate }}</p>
        </li>
        <li>
          <h2>
            <a routerLink="/labs/api-playground">{{
              'labs.apiPlayground.title' | translate
            }}</a>
          </h2>
          <p>{{ 'labs.apiPlayground.summary' | translate }}</p>
        </li>
      </ul>
    </section>
  `,
  styles: `
    .labs {
      list-style: none;
      padding: 0;
    }
    .labs li {
      margin: var(--space) 0;
    }
    h2 {
      font-size: 1.15rem;
      margin: 0;
    }
    p {
      margin: 0.25rem 0 0;
    }
  `,
})
export class LabsPage {}
