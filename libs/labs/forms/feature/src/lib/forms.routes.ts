import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { SNIPPET_SOURCE } from '@portfolio/lab-kit';
import { CheckoutApi } from '@portfolio/labs/forms/data-access';
import { SnippetsService } from '@portfolio/snippets';
import { CheckoutScenario } from './checkout/checkout.scenario';

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
      { path: '', title: 'title.forms', component: CheckoutScenario },
      { path: '**', redirectTo: '' },
    ],
  },
];
