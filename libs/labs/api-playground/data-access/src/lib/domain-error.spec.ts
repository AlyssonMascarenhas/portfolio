import { HttpErrorResponse } from '@angular/common/http';
import { TimeoutError } from 'rxjs';
import { DomainError, ErrorKind, mapHttpError } from './domain-error';

const http = (status: number, error: unknown = null) =>
  new HttpErrorResponse({ status, error });

describe('mapHttpError', () => {
  it.each<[number, ErrorKind, boolean]>([
    [0, 'offline', true],
    [400, 'bad-request', false],
    [401, 'unauthorized', false],
    [403, 'forbidden', false],
    [404, 'not-found', false],
    [409, 'conflict', false],
    [422, 'validation', false],
    [500, 'server', true],
    [503, 'server', true],
    [418, 'unknown', true],
  ])('status %i vira "%s" (retryable: %s)', (status, kind, retryable) => {
    const error = mapHttpError(http(status));

    expect(error).toBeInstanceOf(DomainError);
    expect(error.kind).toBe(kind);
    expect(error.retryable).toBe(retryable);
    expect(error.details.status).toBe(status);
  });

  it('timeout vira "timeout" e é repetível', () => {
    const error = mapHttpError(new TimeoutError());

    expect(error.kind).toBe('timeout');
    expect(error.retryable).toBe(true);
  });

  it('carrega o código de negócio, o correlationId e os erros por campo do corpo', () => {
    const error = mapHttpError(
      http(422, {
        code: 'validation_failed',
        correlationId: 'req-1',
        errors: [{ field: 'email', code: 'invalid_email' }],
      }),
    );

    expect(error.details).toMatchObject({
      code: 'validation_failed',
      correlationId: 'req-1',
      fieldErrors: [{ field: 'email', code: 'invalid_email' }],
    });
  });

  it('não quebra com corpo que não é objeto (HTML de proxy, texto, null)', () => {
    expect(mapHttpError(http(502, '<html>Bad Gateway</html>')).kind).toBe(
      'server',
    );
    expect(mapHttpError(http(500, null)).details.code).toBeUndefined();
  });

  it('erro desconhecido vira "unknown" e preserva a causa', () => {
    const cause = new Error('boom');
    const error = mapHttpError(cause);

    expect(error.kind).toBe('unknown');
    expect(error.cause).toBe(cause);
  });

  it('não mapeia duas vezes: um DomainError passa como está', () => {
    const original = new DomainError('conflict');

    expect(mapHttpError(original)).toBe(original);
  });
});
