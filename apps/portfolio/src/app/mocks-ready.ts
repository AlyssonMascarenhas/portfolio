import { HttpInterceptorFn } from '@angular/common/http';
import { InjectionToken, inject } from '@angular/core';
import { from, switchMap } from 'rxjs';

/**
 * Resolve quando a "API" (MSW) está de pé. O app abre sem esperar por ela, para pintar o
 * primeiro frame mais cedo, e as requisições esperam este promise antes de sair.
 * Sem mocks (ou nos testes), resolve na hora.
 */
export const MOCKS_READY = new InjectionToken<Promise<void>>('MOCKS_READY', {
  factory: () => Promise.resolve(),
});

/** Só as chamadas à "API" esperam o MSW; arquivos estáticos (i18n, snippets.json) saem direto. */
export const mocksReadyInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('api/')) return next(req);
  const ready = inject(MOCKS_READY);
  return from(ready).pipe(switchMap(() => next(req)));
};
