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

      <ul class="card-grid">
        <li class="card">
          <h2>{{ 'labs.signalsRxjs.title' | translate }}</h2>
          <p>{{ 'labs.signalsRxjs.summary' | translate }}</p>
          <a routerLink="/labs/signals-rxjs">{{
            'home.labs.cta' | translate
          }}</a>
        </li>
        <li class="card">
          <h2>{{ 'labs.apiPlayground.title' | translate }}</h2>
          <p>{{ 'labs.apiPlayground.summary' | translate }}</p>
          <a routerLink="/labs/api-playground">{{
            'home.labs.cta' | translate
          }}</a>
        </li>
      </ul>
    </section>
  `,
})
export class LabsPage {}
