import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import {
  TimeoutError,
  catchError,
  defer,
  finalize,
  retry,
  tap,
  throwError,
  timeout,
  timer,
} from 'rxjs';
import { AttemptTrace } from './attempt-trace';
import { mapHttpError } from './domain-error';

export const REQUEST_TIMEOUT_MS = 3000;
export const MAX_RETRIES = 2;
export const BACKOFF_BASE_MS = 300;

/** Falhas que costumam passar sozinhas: rede, gateway ruim, indisponível, tempo esgotado. 500 não entra. */
const TRANSIENT_STATUS = new Set([0, 502, 503, 504]);

export function isTransient(error: unknown): boolean {
  return (
    error instanceof TimeoutError ||
    (error instanceof HttpErrorResponse && TRANSIENT_STATUS.has(error.status))
  );
}

/** Repetir um POST sem chave de idempotência pode duplicar o pedido: só GET ou POST com a chave. */
export function isSafeToRetry(req: HttpRequest<unknown>): boolean {
  return req.method === 'GET' || req.headers.has('Idempotency-Key');
}

// #region api-interceptors
/** Cada tentativa tem seu próprio limite de tempo. */
export const timeoutInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(timeout(REQUEST_TIMEOUT_MS));

/** Retry com backoff exponencial, só para falha transitória e só quando repetir é seguro. */
export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  const trace = inject(AttemptTrace);
  return next(req).pipe(
    retry({
      count: MAX_RETRIES,
      delay: (error, retryCount) => {
        if (!isTransient(error) || !isSafeToRetry(req)) {
          return throwError(() => error);
        }
        const wait = BACKOFF_BASE_MS * 2 ** (retryCount - 1);
        trace.note(`backoff ${wait} ms`);
        return timer(wait);
      },
    }),
  );
};

/** Primeiro da fila de ida e último na volta: converte a falha final em DomainError, uma única vez. */
export const errorMappingInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((error: unknown) => throwError(() => mapHttpError(error))),
  );
// #endregion

function outcomeLabel(error: unknown): string {
  if (!(error instanceof HttpErrorResponse)) return 'timeout';
  return error.status === 0 ? 'network error' : String(error.status);
}

/** Instrumentação: registra cada tentativa (inclusive as repetidas) e quanto ela levou. */
export const traceInterceptor: HttpInterceptorFn = (req, next) => {
  const trace = inject(AttemptTrace);
  return defer(() => {
    const id = trace.start(`${req.method} ${req.url}`);
    let settled = false;
    return next(req).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            settled = true;
            trace.finish(id, { ok: true, label: String(event.status) });
          }
        },
        error: (error: unknown) => {
          settled = true;
          trace.finish(id, { ok: false, label: outcomeLabel(error) });
        },
      }),
      finalize(() => {
        if (!settled) trace.finish(id, { ok: false, label: 'canceled' });
      }),
    );
  });
};
