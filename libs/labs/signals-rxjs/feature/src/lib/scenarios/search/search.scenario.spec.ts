import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LabProduct } from '@portfolio/contracts';
import { provideScenarioTesting } from '../../testing';
import { SearchScenario } from './search.scenario';

const KEYBOARD: LabProduct = {
  id: 1,
  name: 'Wireless Keyboard',
  category: 'keyboards',
};

describe('SearchScenario', () => {
  let el: HTMLElement;
  let http: HttpTestingController;

  const type = (value: string) => {
    const input = el.querySelector<HTMLInputElement>('input[type=search]');
    if (!input) throw new Error('campo de busca não encontrado');
    input.value = value;
    input.dispatchEvent(new Event('input'));
  };
  const advance = (ms: number) => {
    vi.advanceTimersByTime(ms);
    TestBed.tick();
  };
  const metrics = () =>
    [...el.querySelectorAll('pf-instrumentation-panel dd')].map((d) =>
      Number(d.textContent),
    );
  const searchRequests = () => http.match((r) => r.url === 'api/lab/products');

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({ providers: provideScenarioTesting() });
    http = TestBed.inject(HttpTestingController);
    el = TestBed.createComponent(SearchScenario).nativeElement;
    TestBed.tick();
    advance(300); // o valor inicial ('') passa pelo debounce
  });

  afterEach(() => vi.useRealTimers());

  it('não dispara requisição a cada tecla: só depois do debounce', () => {
    type('w');
    advance(100);
    type('wi');
    advance(100);
    type('wir');
    advance(299);
    expect(searchRequests()).toHaveLength(0);

    advance(1);
    const requests = searchRequests();
    expect(requests).toHaveLength(1);
    expect(requests[0].request.params.get('q')).toBe('wir');
  });

  // #region quality-test-cancel
  it('cancela a requisição anterior quando um termo novo chega (switchMap)', () => {
    type('wi');
    advance(300);
    const [first] = searchRequests();

    type('wire');
    advance(300);
    const [second] = searchRequests();

    expect(first.cancelled).toBe(true);
    second.flush([KEYBOARD]);
    TestBed.tick();

    expect(el.textContent).toContain('Wireless Keyboard');
    expect(metrics()).toEqual([2, 1, 1]); // disparadas, canceladas, concluídas
    expect(el.querySelector('s')?.textContent).toBe('wi');
  });
  // #endregion

  it('não refaz a busca quando o termo não muda (distinctUntilChanged)', () => {
    type('wire');
    advance(300);
    searchRequests()[0].flush([KEYBOARD]);

    type('wire');
    advance(300);

    expect(searchRequests()).toHaveLength(0);
  });

  it('mostra o erro com alerta e tenta de novo', () => {
    type('erro');
    advance(300);
    searchRequests()[0].flush(null, {
      status: 500,
      statusText: 'Server Error',
    });
    TestBed.tick();

    expect(el.querySelector('[role=alert]')).not.toBeNull();

    el.querySelector<HTMLButtonElement>('pf-product-list button')?.click();
    TestBed.tick();
    const [retry] = searchRequests();
    expect(retry.request.params.get('q')).toBe('erro');
    retry.flush([]);
    TestBed.tick();

    expect(el.querySelector('[role=alert]')).toBeNull();
  });
});
