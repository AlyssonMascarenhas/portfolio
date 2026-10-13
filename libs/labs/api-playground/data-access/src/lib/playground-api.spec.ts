import { HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { LabOrder } from '@portfolio/contracts';
import { AttemptTrace } from './attempt-trace';
import { DomainError } from './domain-error';
import {
  errorMappingInterceptor,
  retryInterceptor,
  timeoutInterceptor,
  traceInterceptor,
} from './interceptors';
import { PlaygroundApi } from './playground-api';

const ORDER: LabOrder = { id: 'ord_1', status: 'created' };

describe('PlaygroundApi com a cadeia de interceptors', () => {
  let api: PlaygroundApi;
  let http: HttpTestingController;
  let trace: AttemptTrace;

  const orders = () => http.match((r) => r.url === 'api/lab/orders');
  const unavailable = { status: 503, statusText: 'Service Unavailable' };

  /** Dispara a chamada e devolve o que chegou ao "subscriber" (valor ou DomainError). */
  function send(
    scenario: Parameters<PlaygroundApi['createOrder']>[0],
    idempotencyKey: boolean,
  ) {
    const result: { value?: LabOrder; error?: unknown } = {};
    api.createOrder(scenario, { idempotencyKey }).subscribe({
      next: (value) => (result.value = value),
      error: (error: unknown) => (result.error = error),
    });
    return result;
  }

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(
          withInterceptors([
            errorMappingInterceptor,
            retryInterceptor,
            traceInterceptor,
            timeoutInterceptor,
          ]),
        ),
        provideHttpClientTesting(),
        AttemptTrace,
        PlaygroundApi,
      ],
    });
    api = TestBed.inject(PlaygroundApi);
    http = TestBed.inject(HttpTestingController);
    trace = TestBed.inject(AttemptTrace);
  });

  afterEach(() => vi.useRealTimers());

  it('devolve o pedido criado e registra uma tentativa', () => {
    const result = send('ok', true);
    orders()[0].flush(ORDER);

    expect(result.value).toEqual(ORDER);
    expect(trace.attempts()).toBe(1);
  });

  it('manda o cenário na query e a chave de idempotência no header', () => {
    send('conflict', true);
    const [req] = orders();

    expect(req.request.params.get('scenario')).toBe('conflict');
    expect(req.request.headers.get('Idempotency-Key')).toBeTruthy();
    req.flush(ORDER);
  });

  it('não manda a chave quando o usuário desliga a opção', () => {
    send('ok', false);
    const [req] = orders();

    expect(req.request.headers.has('Idempotency-Key')).toBe(false);
    req.flush(ORDER);
  });

  it('com a chave, repete 503 com backoff (300 ms, 600 ms) e termina em sucesso', () => {
    const result = send('flaky', true);

    orders()[0].flush(null, unavailable);
    expect(orders()).toHaveLength(0); // ainda esperando o backoff
    vi.advanceTimersByTime(300);

    orders()[0].flush(null, unavailable);
    vi.advanceTimersByTime(599);
    expect(orders()).toHaveLength(0);
    vi.advanceTimersByTime(1);

    orders()[0].flush(ORDER);

    expect(result.value).toEqual(ORDER);
    expect(trace.attempts()).toBe(3);
    expect(
      trace
        .entries()
        .filter((e) => e.state === 'info')
        .map((e) => e.text),
    ).toEqual(['backoff 300 ms', 'backoff 600 ms']);
  });

  it('sem a chave, não repete um POST: o 503 vira DomainError já na primeira tentativa', () => {
    const result = send('flaky', false);
    orders()[0].flush(null, unavailable);

    expect(orders()).toHaveLength(0);
    expect(result.error).toBeInstanceOf(DomainError);
    expect((result.error as DomainError).kind).toBe('server');
    expect(trace.attempts()).toBe(1);
  });

  it('desiste depois de 2 repetições e entrega o erro mapeado', () => {
    const result = send('flaky', true);

    orders()[0].flush(null, unavailable);
    vi.advanceTimersByTime(300);
    orders()[0].flush(null, unavailable);
    vi.advanceTimersByTime(600);
    orders()[0].flush(null, unavailable);

    expect((result.error as DomainError).kind).toBe('server');
    expect(orders()).toHaveLength(0);
    expect(trace.attempts()).toBe(3);
  });

  it('não repete 500, nem erros do cliente (422)', () => {
    const server = send('server', true);
    orders()[0].flush(
      { code: 'internal_error', correlationId: 'req-7' },
      { status: 500, statusText: 'Error' },
    );

    expect((server.error as DomainError).details.correlationId).toBe('req-7');
    expect(trace.attempts()).toBe(1);

    const validation = send('validation', true);
    orders()[0].flush(
      {
        code: 'validation_failed',
        errors: [{ field: 'email', code: 'invalid_email' }],
      },
      { status: 422, statusText: 'Unprocessable' },
    );

    expect((validation.error as DomainError).kind).toBe('validation');
    expect(trace.attempts()).toBe(1); // o trace é zerado a cada chamada
  });

  it('estoura o tempo da tentativa em 3 s e vira "timeout"', () => {
    const result = send('timeout', false);
    const [req] = orders();

    vi.advanceTimersByTime(3000);

    expect(req.cancelled).toBe(true);
    expect((result.error as DomainError).kind).toBe('timeout');
  });

  it('erro de rede (status 0) vira "offline"', () => {
    const result = send('offline', false);
    orders()[0].error(new ProgressEvent('error'), { status: 0 });

    expect((result.error as DomainError).kind).toBe('offline');
  });
});
