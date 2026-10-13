import { Service, computed, signal } from '@angular/core';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

// #region shared-store
/** Estado compartilhado entre páginas: um service que expõe signals somente leitura. */
@Service({ autoProvided: false })
export class CartStore {
  private readonly _items = signal<readonly CartItem[]>([]);
  readonly items = this._items.asReadonly();

  /** Quantidade total de unidades: o contador do header. */
  readonly count = computed(() =>
    this._items().reduce((sum, item) => sum + item.quantity, 0),
  );
  readonly total = computed(() =>
    this._items().reduce((sum, item) => sum + item.price * item.quantity, 0),
  );

  add(product: Omit<CartItem, 'quantity'>): void {
    this._items.update((items) =>
      items.some((item) => item.id === product.id)
        ? items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        : [...items, { ...product, quantity: 1 }],
    );
  }

  remove(id: number): void {
    this._items.update((items) => items.filter((item) => item.id !== id));
  }
}
// #endregion
