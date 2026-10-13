import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { SNIPPET_SOURCE } from '@portfolio/lab-kit';
import { provideApiPlayground } from '@portfolio/labs/api-playground/data-access';
import { SnippetsService } from '@portfolio/snippets';
import { ApiPlaygroundScenario } from './api-playground/api-playground.scenario';

/** Rotas do lab, relativas ao ponto onde o app o monta (ex.: /labs/api-playground). */
export const apiPlaygroundRoutes: Routes = [
  {
    path: '',
    providers: [
      // O HttpClient com os interceptors, o trace e o cliente da API valem só dentro deste lab.
      provideApiPlayground(),
      {
        provide: SNIPPET_SOURCE,
        useFactory: () => inject(SnippetsService).all,
      },
    ],
    children: [
      { path: '', component: ApiPlaygroundScenario },
      { path: '**', redirectTo: '' },
    ],
  },
];
