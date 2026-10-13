import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

/** Índice dos labs. Só lista e linka: o conteúdo de cada lab vive na rota dele, carregada sob demanda. */
@Component({
  selector: 'pf-labs-page',
  imports: [TranslatePipe, RouterLink, ButtonModule, CardModule],
  template: `
    <section class="page" aria-labelledby="labs-title">
      <h1 id="labs-title">{{ 'labs.title' | translate }}</h1>
      <p>{{ 'labs.lead' | translate }}</p>

      <ul class="card-grid">
        <li>
          <p-card>
            <ng-template #title
              ><h2>{{ 'labs.signalsRxjs.title' | translate }}</h2></ng-template
            >
            <p class="summary">{{ 'labs.signalsRxjs.summary' | translate }}</p>
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
              ><h2>
                {{ 'labs.apiPlayground.title' | translate }}
              </h2></ng-template
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
  `,
  styles: `
    h2 {
      margin: 0;
      font-size: 1.15rem;
    }
    .summary {
      margin: 0;
      color: var(--color-muted);
    }
  `,
})
export class LabsPage {}
