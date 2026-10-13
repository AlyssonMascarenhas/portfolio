import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { LabOrder, LabOrderScenario } from '@portfolio/contracts';
import { Observable, defer } from 'rxjs';
import { AttemptTrace } from './attempt-trace';

export interface CreateOrderOptions {
  /** Com a chave, o interceptor pode repetir o POST sem risco de duplicar o pedido. */
  idempotencyKey: boolean;
}

/** Cliente da API de pedidos. Não é provido na raiz: usa o HttpClient (com interceptors) da rota do lab. */
@Service({ autoProvided: false })
export class PlaygroundApi {
  private readonly http = inject(HttpClient);
  private readonly trace = inject(AttemptTrace);

  createOrder(
    scenario: LabOrderScenario,
    { idempotencyKey }: CreateOrderOptions,
  ): Observable<LabOrder> {
    return defer(() => {
      this.trace.reset();
      return this.http.post<LabOrder>(
        'api/lab/orders',
        { sku: 'KB-75', quantity: 1 },
        {
          params: { scenario },
          headers: idempotencyKey
            ? { 'Idempotency-Key': crypto.randomUUID() }
            : {},
        },
      );
    });
  }
}
