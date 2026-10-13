import { LabOrder, toLang } from '@portfolio/contracts';
import { HttpResponse, delay, http } from 'msw';
import { contentByLang } from './data';
import { labProducts } from './data/lab-products';

/** Latência artificial para que os estados de loading sejam reais, não teóricos. */
const LATENCY_MS = 150;
const LAB_LATENCY_MS = 700;
/** Maior que o timeout do cliente do API Playground (3 s), para a requisição estourar de verdade. */
const TIMEOUT_SCENARIO_MS = 15_000;
const FLAKY_FAILURES = 2;

/** Tentativas por Idempotency-Key, para o cenário "flaky" ter memória entre retries. */
const flakyAttempts = new Map<string, number>();

const createdOrder = (): LabOrder => ({
  id: `ord_${Math.floor(1000 + Math.random() * 9000)}`,
  status: 'created',
});

const contentFor = (request: Request) =>
  contentByLang[toLang(request.headers.get('accept-language'))];

// '*/api/...' casa com qualquer origem e base href (ex.: deploy em subpasta).
export const handlers = [
  http.get('*/api/profile', async ({ request }) => {
    await delay(LATENCY_MS);
    return HttpResponse.json(contentFor(request).profile);
  }),

  http.get('*/api/experience', async ({ request }) => {
    await delay(LATENCY_MS);
    return HttpResponse.json(contentFor(request).experience);
  }),

  http.get('*/api/skills', async ({ request }) => {
    await delay(LATENCY_MS);
    return HttpResponse.json(contentFor(request).skills);
  }),

  // Catálogo dos labs. A latência é maior de propósito: precisa ser maior que o intervalo
  // entre teclas para que requisições em voo (e canceladas) sejam visíveis.
  // A busca "erro" devolve 500 para exercitar o estado de falha.
  // API Playground: o cenário vem em ?scenario=. "flaky" falha duas vezes por Idempotency-Key
  // (503) e depois responde 201, para exercitar retry com backoff.
  http.post('*/api/lab/orders', async ({ request }) => {
    const scenario = new URL(request.url).searchParams.get('scenario');
    const key = request.headers.get('idempotency-key') ?? crypto.randomUUID();

    if (scenario === 'timeout') {
      await delay(TIMEOUT_SCENARIO_MS);
      return HttpResponse.json(createdOrder(), { status: 201 });
    }
    await delay(LAB_LATENCY_MS);

    switch (scenario) {
      case 'offline':
        return HttpResponse.error();
      case 'bad-request':
        return HttpResponse.json({ code: 'bad_request' }, { status: 400 });
      case 'unauthorized':
        return HttpResponse.json({ code: 'token_expired' }, { status: 401 });
      case 'forbidden':
        return HttpResponse.json({ code: 'forbidden' }, { status: 403 });
      case 'not-found':
        return HttpResponse.json(
          { code: 'customer_not_found' },
          { status: 404 },
        );
      case 'conflict':
        return HttpResponse.json({ code: 'duplicate_order' }, { status: 409 });
      case 'validation':
        return HttpResponse.json(
          {
            code: 'validation_failed',
            errors: [
              { field: 'email', code: 'invalid_email' },
              { field: 'quantity', code: 'min_1' },
            ],
          },
          { status: 422 },
        );
      case 'server':
        return HttpResponse.json(
          { code: 'internal_error', correlationId: 'req-7f3a91' },
          { status: 500 },
        );
      case 'flaky': {
        const attempts = (flakyAttempts.get(key) ?? 0) + 1;
        flakyAttempts.set(key, attempts);
        return attempts <= FLAKY_FAILURES
          ? HttpResponse.json({ code: 'unavailable' }, { status: 503 })
          : HttpResponse.json(createdOrder(), { status: 201 });
      }
      default:
        return HttpResponse.json(createdOrder(), { status: 201 });
    }
  }),

  http.get('*/api/lab/products', async ({ request }) => {
    const params = new URL(request.url).searchParams;
    const query = params.get('q')?.trim().toLowerCase() ?? '';
    const category = params.get('category');

    await delay(LAB_LATENCY_MS);
    if (query === 'erro') return new HttpResponse(null, { status: 500 });

    return HttpResponse.json(
      labProducts.filter(
        (p) =>
          (!category || p.category === category) &&
          p.name.toLowerCase().includes(query),
      ),
    );
  }),
];
