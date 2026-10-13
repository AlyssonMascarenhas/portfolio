import { Service } from '@angular/core';
import { Observable, defer, finalize, tap } from 'rxjs';
import { priceStream } from './price-stream';
import { Counters } from '@portfolio/lab-kit';

export const TICKER_PERIOD_MS = 1000;

/**
 * O feed de preços do cenário, com instrumentação: quantas assinaturas estão abertas e
 * quantos valores foram emitidos. Não é provido na raiz: cada demo cria o seu.
 */
@Service({ autoProvided: false })
export class TickerFeed {
  readonly counters = new Counters();

  readonly stream$: Observable<number> = defer(() => {
    this.counters.increment('subscriptions');
    return priceStream(TICKER_PERIOD_MS).pipe(
      tap(() => this.counters.increment('emissions')),
      finalize(() => this.counters.increment('subscriptions', -1)),
    );
  });
}
