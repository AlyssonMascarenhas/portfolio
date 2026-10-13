import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { SNIPPET_SOURCE } from '@portfolio/lab-kit';
import { SnippetsService } from '@portfolio/snippets';
import { QualityScenario } from './quality/quality.scenario';

/** Rotas do lab, relativas ao ponto onde o app o monta (ex.: /labs/quality). */
export const qualityRoutes: Routes = [
  {
    path: '',
    providers: [
      {
        provide: SNIPPET_SOURCE,
        useFactory: () => inject(SnippetsService).all,
      },
    ],
    children: [
      { path: '', title: 'title.quality', component: QualityScenario },
      { path: '**', redirectTo: '' },
    ],
  },
];
