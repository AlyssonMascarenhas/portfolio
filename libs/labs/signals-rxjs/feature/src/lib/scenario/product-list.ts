import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ProductListState } from './lab-products.api';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

/** Lista de produtos com os estados de loading, erro (com tentar de novo) e vazio. */
@Component({
  selector: 'pf-product-list',
  imports: [TranslatePipe, ButtonModule, MessageModule],
  template: `
    @switch (state().status) {
      @case ('error') {
        <div>
          <p-message severity="error">{{
            'lab.products.loadError' | translate
          }}</p-message>
          <button pButton type="button" (click)="retry.emit()">
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
