import { TestBed } from '@angular/core/testing';
import { firstValueFrom, take, toArray } from 'rxjs';
import { provideScenarioTesting } from '../../testing';
import { nextPrice, priceStream } from './price-stream';
import { TickerScenario } from './ticker.scenario';

describe('price-stream', () => {
  it('nextPrice anda no máximo 1% para cada lado e nunca zera', () => {
    expect(nextPrice(100, () => 1)).toBeCloseTo(101);
    expect(nextPrice(100, () => 0)).toBeCloseTo(99);
    expect(nextPrice(0.001, () => 0)).toBe(0.01);
  });

  it('emite o preço inicial e um valor novo por período', async () => {
    vi.useFakeTimers();
    const values = firstValueFrom(
      priceStream(1000, 50).pipe(take(3), toArray()),
    );
    await vi.advanceTimersByTimeAsync(2000);

    const [first, ...rest] = await values;
    expect(first).toBe(50);
    expect(rest).toHaveLength(2);
    vi.useRealTimers();
  });
});

describe('TickerScenario', () => {
  let el: HTMLElement;

  const metrics = () =>
    [...el.querySelectorAll('pf-instrumentation-panel dd')].map((d) =>
      Number(d.textContent),
    );
  const tick = () => {
    TestBed.tick();
    TestBed.tick(); // os contadores são publicados depois do render
  };

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({ providers: provideScenarioTesting() });
    el = TestBed.createComponent(TickerScenario).nativeElement;
    tick();
  });

  afterEach(() => vi.useRealTimers());

  it('assina o feed ao montar e mostra o preço', () => {
    expect(el.querySelector('pf-ticker-price output')?.textContent).toMatch(
      /100/,
    );
    expect(metrics()[0]).toBe(1);

    vi.advanceTimersByTime(3000);
    tick();

    expect(metrics()).toEqual([1, 4]); // preço inicial + 3 ticks
  });

  it('encerra a assinatura quando o componente é destruído e a retoma ao recriar', () => {
    const toggle = [...el.querySelectorAll('button')].find((b) =>
      b.textContent?.includes('Destruir'),
    );
    toggle?.click();
    tick();

    expect(el.querySelector('pf-ticker-price')).toBeNull();
    expect(metrics()[0]).toBe(0);

    const emitted = metrics()[1];
    vi.advanceTimersByTime(5000);
    tick();
    expect(metrics()[1]).toBe(emitted); // nada mais é emitido

    [...el.querySelectorAll('button')]
      .find((b) => b.textContent?.includes('Criar'))
      ?.click();
    tick();
    expect(metrics()[0]).toBe(1);
  });
});
