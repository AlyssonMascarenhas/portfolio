import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ProductListState } from '../lab-products.api';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

/** Lista de produtos com os estados de loading, erro (com tentar de novo) e vazio. */
@Component({
  selector: 'pf-product-list',
  imports: [TranslatePipe, ButtonModule, MessageModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  readonly state = input.required<ProductListState>();
  readonly retry = output<void>();
}
