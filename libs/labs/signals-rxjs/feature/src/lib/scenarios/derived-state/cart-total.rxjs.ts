import { BehaviorSubject, combineLatest, map } from 'rxjs';

// #region derived-state-rxjs
export class CartTotalRxjs {
  readonly price$ = new BehaviorSubject(120);
  readonly quantity$ = new BehaviorSubject(2);
  readonly discountPercent$ = new BehaviorSubject(10);

  readonly total$ = combineLatest([
    this.price$,
    this.quantity$,
    this.discountPercent$,
  ]).pipe(
    map(([price, quantity, discountPercent]) => {
      const subtotal = price * quantity;
      return subtotal - (subtotal * discountPercent) / 100;
    }),
  );
}
// #endregion
