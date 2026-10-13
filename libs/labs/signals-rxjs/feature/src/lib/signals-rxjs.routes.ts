import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { SNIPPET_SOURCE } from '@portfolio/lab-kit';
import { SnippetsService } from '@portfolio/snippets';
import { SignalsRxjsLabPage } from './signals-rxjs-lab/signals-rxjs-lab.page';

/** Rotas do lab, relativas ao ponto onde o app o monta (ex.: /labs/signals-rxjs). */
const scenarioRoutes: Routes = [
  { path: '', title: 'title.signalsRxjs', component: SignalsRxjsLabPage },
  {
    path: 'local-state',
    title: 'title.localState',
    loadComponent: () =>
      import('./scenarios/local-state/local-state.scenario').then(
        (m) => m.LocalStateScenario,
      ),
  },
  {
    path: 'derived-state',
    title: 'title.derivedState',
    loadComponent: () =>
      import('./scenarios/derived-state/derived-state.scenario').then(
        (m) => m.DerivedStateScenario,
      ),
  },
  {
    path: 'search',
    title: 'title.search',
    loadComponent: () =>
      import('./scenarios/search/search.scenario').then(
        (m) => m.SearchScenario,
      ),
  },
  {
    path: 'dependent-http',
    title: 'title.dependentHttp',
    loadComponent: () =>
      import('./scenarios/dependent-http/dependent-http.scenario').then(
        (m) => m.DependentHttpScenario,
      ),
  },
  {
    path: 'ticker',
    title: 'title.ticker',
    loadComponent: () =>
      import('./scenarios/ticker/ticker.scenario').then(
        (m) => m.TickerScenario,
      ),
  },
  {
    path: 'shared-state',
    title: 'title.sharedState',
    loadComponent: () =>
      import('./scenarios/shared-state/shared-state.scenario').then(
        (m) => m.SharedStateScenario,
      ),
  },
  { path: '**', redirectTo: '' },
];

/** A aba Code de todos os cenários lê os trechos do SnippetsService. */
export const signalsRxjsRoutes: Routes = [
  {
    path: '',
    providers: [
      {
        provide: SNIPPET_SOURCE,
        useFactory: () => inject(SnippetsService).all,
      },
    ],
    children: scenarioRoutes,
  },
];
