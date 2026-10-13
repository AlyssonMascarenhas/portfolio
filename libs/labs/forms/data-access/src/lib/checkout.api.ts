import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import {
  LabCheckoutError,
  LabCheckoutRequest,
  LabCheckoutResult,
} from '@portfolio/contracts';
import { Observable, catchError, throwError } from 'rxjs';

/** O servidor recusou o pedido por campo (HTTP 422): a UI mostra cada erro no campo certo. */
export class CheckoutRejected extends Error {
  constructor(readonly errors: LabCheckoutError['errors']) {
    super('checkout rejeitado pelo servidor');
    this.name = 'CheckoutRejected';
  }
}

/** Envio do pedido do formulário do lab. Erros 422 viram CheckoutRejected; o resto passa como está. */
@Service()
export class CheckoutApi {
  private readonly http = inject(HttpClient);

  create(request: LabCheckoutRequest): Observable<LabCheckoutResult> {
    return this.http
      .post<LabCheckoutResult>('api/lab/checkout', request)
      .pipe(
        catchError((error: unknown) =>
          throwError(() =>
            error instanceof HttpErrorResponse && error.status === 422
              ? new CheckoutRejected(
                  (error.error as Partial<LabCheckoutError> | null)?.errors ??
                    [],
                )
              : error,
          ),
        ),
      );
  }
}
