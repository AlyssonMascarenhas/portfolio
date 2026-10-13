import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ProductListState } from './lab-products.api';

/** Lista de produtos com os estados de loading, erro (com tentar de novo) e vazio. */
@Component({
  selector: 'pf-product-list',
  imports: [TranslatePipe],
  template: `
    @switch (state().status) {
      @case ('error') {
        <div role="alert">
          <p>{{ 'lab.products.loadError' | translate }}</p>
          <button type="button" (click)="retry.emit()">
            {{ 'common.retry' | translate }}
          </button>
        </div>
      }
      @case ('loading') {
        <p aria-busy="true">{{ 'common.loading' | translate }}</p>
      }
      @case ('ready') {
        @if (state().items.length) {
          <ul>
            @for (item of state().items; track item.id) {
              <li>{{ item.name }}</li>
            }
          </ul>
        } @else {
          <p>{{ 'lab.products.empty' | translate }}</p>
        }
      }
    }
  `,
  styles: `
    ul {
      margin: 0;
      padding-left: 1.25rem;
    }
  `,
})
export class ProductList {
  readonly state = input.required<ProductListState>();
  readonly retry = output<void>();
}
