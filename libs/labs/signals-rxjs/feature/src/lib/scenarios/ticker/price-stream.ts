import { Observable, interval, scan, startWith } from 'rxjs';

/** Próximo preço: um passo de caminhada aleatória de até ±1%. `random` é injetável para testes. */
export function nextPrice(
  price: number,
  random: () => number = Math.random,
): number {
  const step = (random() - 0.5) * 0.02;
  return Math.max(0.01, price * (1 + step));
}

// #region ticker-stream
/** Simula um feed de preços (como um WebSocket): um valor novo a cada `periodMs`. */
export function priceStream(periodMs: number, start = 100): Observable<number> {
  return interval(periodMs).pipe(
    scan((price) => nextPrice(price), start),
    startWith(start),
  );
}
// #endregion
