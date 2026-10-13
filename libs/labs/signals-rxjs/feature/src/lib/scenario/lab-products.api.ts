import { HttpClient, HttpResourceRequest } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { LabProduct, LabProductCategory } from '@portfolio/contracts';
import { Observable } from 'rxjs';

export interface ProductQuery {
  q?: string;
  category?: LabProductCategory;
}

/** Estado de uma lista vinda da API, nos três estados que o template precisa tratar. */
export interface ProductListState {
  status: 'idle' | 'loading' | 'ready' | 'error';
  items: readonly LabProduct[];
}

export const IDLE: ProductListState = { status: 'idle', items: [] };
export const LOADING: ProductListState = { status: 'loading', items: [] };
export const FAILED: ProductListState = { status: 'error', items: [] };

/** Catálogo dos labs (MSW no navegador). Expõe a mesma consulta como Observable e como request de resource. */
@Service()
export class LabProductsApi {
  private readonly http = inject(HttpClient);

  search(query: ProductQuery): Observable<LabProduct[]> {
    return this.http.get<LabProduct[]>('api/lab/products', {
      params: { ...query },
    });
  }

  request(query: ProductQuery): HttpResourceRequest {
    return { url: 'api/lab/products', params: { ...query } };
  }
}
