import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('@portfolio/shell/feature-home').then((m) => m.HomePage),
  },
  {
    path: 'experience',
    loadComponent: () =>
      import('@portfolio/shell/feature-experience').then(
        (m) => m.ExperiencePage,
      ),
  },
  {
    path: 'labs',
    pathMatch: 'full',
    loadComponent: () =>
      import('@portfolio/shell/feature-labs').then((m) => m.LabsPage),
  },
  {
    path: 'labs/signals-rxjs',
    loadChildren: () =>
      import('@portfolio/labs/signals-rxjs').then((m) => m.signalsRxjsRoutes),
  },
  {
    path: 'labs/api-playground',
    loadChildren: () =>
      import('@portfolio/labs/api-playground').then(
        (m) => m.apiPlaygroundRoutes,
      ),
  },
  { path: '**', redirectTo: '' },
];
