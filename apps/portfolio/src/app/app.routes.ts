import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    title: 'title.home',
    data: { description: 'meta.home' },
    loadComponent: () =>
      import('@portfolio/shell/feature-home').then((m) => m.HomePage),
  },
  {
    path: 'experience',
    title: 'title.experience',
    data: { description: 'meta.experience' },
    loadComponent: () =>
      import('@portfolio/shell/feature-experience').then(
        (m) => m.ExperiencePage,
      ),
  },
  {
    path: 'labs',
    pathMatch: 'full',
    title: 'title.labs',
    data: { description: 'meta.labs' },
    loadComponent: () =>
      import('@portfolio/shell/feature-labs').then((m) => m.LabsPage),
  },
  {
    path: 'labs/signals-rxjs',
    data: { description: 'meta.signalsRxjs' },
    loadChildren: () =>
      import('@portfolio/labs/signals-rxjs').then((m) => m.signalsRxjsRoutes),
  },
  {
    path: 'labs/api-playground',
    data: { description: 'meta.apiPlayground' },
    loadChildren: () =>
      import('@portfolio/labs/api-playground').then(
        (m) => m.apiPlaygroundRoutes,
      ),
  },
  { path: '**', redirectTo: '' },
];
