import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { toBcp47 } from '@portfolio/contracts';
import { LanguageService } from '@portfolio/i18n';
import { TickerFeed } from '../ticker-feed';

/** O componente que consome o feed. Ao ser destruído, a assinatura é encerrada. */
@Component({
  selector: 'pf-ticker-price',
  templateUrl: './ticker-price.html',
  styleUrl: './ticker-price.scss',
})
export class TickerPrice {
  private readonly feed = inject(TickerFeed);
  private readonly language = inject(LanguageService);

  // #region ticker-edge
  // O fluxo continua em RxJS; toSignal só entrega o último valor ao template.
  // A assinatura é encerrada automaticamente quando este componente é destruído.
  protected readonly price = toSignal(this.feed.stream$);
  // #endregion

  protected readonly formatted = computed(() => {
    const price = this.price();
    return price === undefined
      ? ''
      : new Intl.NumberFormat(toBcp47(this.language.current()), {
          style: 'currency',
          currency: 'USD',
        }).format(price);
  });
}
