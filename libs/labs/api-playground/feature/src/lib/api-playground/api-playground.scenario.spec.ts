import { HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { SNIPPET_SOURCE, SnippetSource } from '@portfolio/lab-kit';
import { provideApiPlayground } from '@portfolio/labs/api-playground/data-access';
import { ApiPlaygroundScenario } from './api-playground.scenario';

/** A aba Code não é o foco aqui, e uma fonte falsa evita que o GET de snippets.json passe pelos interceptors do teste. */
const noSnippets: SnippetSource = {
  error: () => undefined,
  hasValue: () => true,
  value: () => ({}),
  reload: () => true,
};

describe('ApiPlaygroundScenario', () => {
  let el: HTMLElement;
  let http: HttpTestingController;

  const orders = () => http.match((r) => r.url === 'api/lab/orders');
  const tick = () => {
    TestBed.tick();
  };
  const choose = (label: string) => {
    const target = [...el.querySelectorAll('label')].find((l) =>
      l.textContent?.includes(label),
    );
    el.querySelector<HTMLInputElement>('#' + target?.htmlFor)?.click();
    tick();
  };
  const click = (label: string) => {
    [...el.querySelectorAll('button')]
      .find((b) => b.textContent?.includes(label))
      ?.click();
    tick();
  };
  const metrics = () =>
    [...el.querySelectorAll('pf-instrumentation-panel dd')].map(
      (d) => d.textContent,
    );
  const logLines = () =>
    [...el.querySelectorAll('pf-instrumentation-panel .log li')].map((li) =>
      li.textContent?.replace(/\s+/g, ' ').trim(),
    );

  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.setItem('portfolio.lang', 'pt-br');
    TestBed.configureTestingModule({
      providers: [
        provideApiPlayground(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideTranslateService(),
        { provide: SNIPPET_SOURCE, useValue: noSnippets },
      ],
    });
    http = TestBed.inject(HttpTestingController);
    el = TestBed.createComponent(ApiPlaygroundScenario).nativeElement;
    tick();
  });

  afterEach(() => vi.useRealTimers());

  it('sucesso: mostra a confirmação e o caminho da chamada', () => {
    click('Enviar pedido');
    expect(el.textContent).toContain('Enviando…');

    orders()[0].flush({ id: 'ord_1234', status: 'created' });
    tick();

    expect(el.querySelector('[role=status].result')?.textContent).toContain(
      'Pedido ord_1234 criado.',
    );
    expect(el.querySelector('[role=alert]')).toBeNull();
    expect(el.querySelector('.pipeline')?.textContent).toContain(
      'POST /api/lab/orders?scenario=ok',
    );
    expect(metrics()).toEqual(['1', 'sucesso']);
  });

  it('422: mostra os erros por campo traduzidos e não oferece "tentar de novo"', () => {
    choose('422 Validação');
    click('Enviar pedido');
    orders()[0].flush(
      {
        code: 'validation_failed',
        errors: [
          { field: 'email', code: 'invalid_email' },
          { field: 'quantity', code: 'min_1' },
        ],
      },
      { status: 422, statusText: 'Unprocessable' },
    );
    tick();

    const alert = el.querySelector('[role=alert]');
    expect(alert?.textContent).toContain('Corrija os campos abaixo');
    expect(alert?.textContent).toContain('E-mail: Informe um e-mail válido.');
    expect(alert?.textContent).toContain(
      'Quantidade: A quantidade mínima é 1.',
    );
    expect(alert?.querySelector('button')).toBeNull();
    expect(el.querySelector('.pipeline')?.textContent).toContain(
      '422 → validation',
    );
  });

  it('500: mostra o código de suporte e permite tentar de novo', () => {
    choose('500 Erro do servidor');
    click('Enviar pedido');
    orders()[0].flush(
      { code: 'internal_error', correlationId: 'req-7f3a91' },
      { status: 500, statusText: 'Server Error' },
    );
    tick();

    expect(el.querySelector('[role=alert]')?.textContent).toContain(
      'req-7f3a91',
    );
    expect(metrics()).toEqual(['1', 'server']); // 500 não é repetido

    click('Tentar de novo');
    expect(orders()).toHaveLength(1);
  });

  it('instável com a chave: repete com backoff e termina em sucesso', () => {
    choose('Instável');
    click('Enviar pedido');

    orders()[0].flush(null, { status: 503, statusText: 'Unavailable' });
    vi.advanceTimersByTime(300);
    orders()[0].flush(null, { status: 503, statusText: 'Unavailable' });
    vi.advanceTimersByTime(600);
    orders()[0].flush(
      { id: 'ord_9', status: 'created' },
      { status: 201, statusText: 'Created' },
    );
    tick();

    expect(el.querySelector('[role=status].result')?.textContent).toContain(
      'ord_9',
    );
    expect(metrics()).toEqual(['3', 'sucesso']);
    expect(logLines()).toEqual([
      expect.stringContaining('#1 POST api/lab/orders → 503'),
      expect.stringContaining('backoff 300 ms'),
      expect.stringContaining('#2 POST api/lab/orders → 503'),
      expect.stringContaining('backoff 600 ms'),
      expect.stringContaining('#3 POST api/lab/orders → 201'),
    ]);
  });

  it('instável sem a chave: não repete o POST e falha na primeira tentativa', () => {
    choose('Instável');
    el.querySelector<HTMLInputElement>('input[type=checkbox]')?.click();
    tick();
    click('Enviar pedido');

    const [req] = orders();
    expect(req.request.headers.has('Idempotency-Key')).toBe(false);
    req.flush(null, { status: 503, statusText: 'Unavailable' });
    tick();

    expect(orders()).toHaveLength(0);
    expect(metrics()).toEqual(['1', 'server']);
    expect(el.querySelector('[role=alert]')).not.toBeNull();
  });

  it('timeout: cada tentativa estoura em 3 s e, com a chave, é repetida', () => {
    choose('Timeout');
    click('Enviar pedido');

    vi.advanceTimersByTime(3000); // 1ª tentativa estoura
    vi.advanceTimersByTime(300); // backoff
    vi.advanceTimersByTime(3000); // 2ª estoura
    vi.advanceTimersByTime(600); // backoff
    vi.advanceTimersByTime(3000); // 3ª estoura
    tick();

    expect(metrics()).toEqual(['3', 'timeout']);
    expect(el.querySelector('[role=alert]')?.textContent).toContain(
      'A resposta demorou demais',
    );
  });
});
