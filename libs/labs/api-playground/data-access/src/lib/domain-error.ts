import { HttpErrorResponse } from '@angular/common/http';
import { LabApiError } from '@portfolio/contracts';
import { TimeoutError } from 'rxjs';

export type ErrorKind =
  | 'bad-request'
  | 'unauthorized'
  | 'forbidden'
  | 'not-found'
  | 'conflict'
  | 'validation'
  | 'server'
  | 'timeout'
  | 'offline'
  | 'unknown';

export interface FieldError {
  field: string;
  code: string;
}

export interface DomainErrorDetails {
  status?: number;
  /** Código de negócio vindo da API (ex.: duplicate_order). A UI o traduz. */
  code?: string;
  correlationId?: string;
  fieldErrors?: readonly FieldError[];
}

/** Falha de domínio: o que o resto da aplicação enxerga, sem saber que existiu HTTP. */
export class DomainError extends Error {
  /** Erros em que tentar de novo pode funcionar (o usuário vê o botão). */
  private static readonly RETRYABLE: ReadonlySet<ErrorKind> = new Set([
    'server',
    'timeout',
    'offline',
    'unknown',
  ]);

  constructor(
    readonly kind: ErrorKind,
    readonly details: DomainErrorDetails = {},
    cause?: unknown,
  ) {
    super(`${kind}${details.status ? ` (${details.status})` : ''}`, { cause });
    this.name = 'DomainError';
  }

  get retryable(): boolean {
    return DomainError.RETRYABLE.has(this.kind);
  }
}

function kindFor(status: number): ErrorKind {
  if (status === 0) return 'offline';
  if (status === 400) return 'bad-request';
  if (status === 401) return 'unauthorized';
  if (status === 403) return 'forbidden';
  if (status === 404) return 'not-found';
  if (status === 409) return 'conflict';
  if (status === 422) return 'validation';
  return status >= 500 ? 'server' : 'unknown';
}

// #region api-error-mapper
/** Traduz qualquer falha de transporte para um DomainError. Roda uma vez, no interceptor. */
export function mapHttpError(error: unknown): DomainError {
  if (error instanceof DomainError) return error;
  if (error instanceof TimeoutError) {
    return new DomainError('timeout', {}, error);
  }
  if (!(error instanceof HttpErrorResponse)) {
    return new DomainError('unknown', {}, error);
  }

  const body: Partial<LabApiError> =
    typeof error.error === 'object' && error.error !== null ? error.error : {};
  return new DomainError(
    kindFor(error.status),
    {
      status: error.status,
      code: body.code,
      correlationId: body.correlationId,
      fieldErrors: body.errors,
    },
    error,
  );
}
// #endregion
