import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { SNIPPET_SOURCE } from '@portfolio/lab-kit';
import { CheckoutApi } from '@portfolio/labs/forms/data-access';
import { SnippetsService } from '@portfolio/snippets';
import { FormsLabPage } from './forms-lab/forms-lab.page';

/** Rotas do lab, relativas ao ponto onde o app o monta (ex.: /labs/forms). */
export const formsRoutes: Routes = [
  {
    path: '',
    providers: [
      CheckoutApi,
      {
        provide: SNIPPET_SOURCE,
        useFactory: () => inject(SnippetsService).all,
      },
    ],
    children: [
      { path: '', title: 'title.forms', component: FormsLabPage },
      {
        path: 'checkout',
        title: 'title.formsCheckout',
        loadComponent: () =>
          import('./checkout/checkout.scenario').then(
            (m) => m.CheckoutScenario,
          ),
      },
      {
        path: 'money',
        title: 'title.formsMoney',
        loadComponent: () =>
          import('./money/money.scenario').then((m) => m.MoneyScenario),
      },
      { path: '**', redirectTo: '' },
    ],
  },
];
