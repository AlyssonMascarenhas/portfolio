import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LabCheckoutRequest } from '@portfolio/contracts';
import { CheckoutApi, CheckoutRejected } from './checkout.api';

const REQUEST: LabCheckoutRequest = {
  name: 'Ana',
  email: 'ana@example.com',
  quantity: 1,
  coupon: '',
};

describe('CheckoutApi', () => {
  let api: CheckoutApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(CheckoutApi);
    http = TestBed.inject(HttpTestingController);
  });

  it('envia o pedido e devolve o resultado', () => {
    let result: unknown;
    api.create(REQUEST).subscribe((value) => (result = value));

    const req = http.expectOne('api/lab/checkout');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(REQUEST);
    req.flush({ id: 'ord_1' });

    expect(result).toEqual({ id: 'ord_1' });
  });

  it('transforma o 422 em CheckoutRejected com os erros por campo', () => {
    let error: unknown;
    api.create(REQUEST).subscribe({ error: (e: unknown) => (error = e) });

    http
      .expectOne('api/lab/checkout')
      .flush(
        { errors: [{ field: 'email', code: 'email_taken' }] },
        { status: 422, statusText: 'Unprocessable' },
      );

    expect(error).toBeInstanceOf(CheckoutRejected);
    expect((error as CheckoutRejected).errors).toEqual([
      { field: 'email', code: 'email_taken' },
    ]);
  });

  it('um 422 sem corpo vira CheckoutRejected sem erros, em vez de quebrar', () => {
    let error: unknown;
    api.create(REQUEST).subscribe({ error: (e: unknown) => (error = e) });

    http
      .expectOne('api/lab/checkout')
      .flush(null, { status: 422, statusText: 'Unprocessable' });

    expect((error as CheckoutRejected).errors).toEqual([]);
  });

  it('outras falhas passam sem mapeamento (o formulário trata como indisponibilidade)', () => {
    let error: unknown;
    api.create(REQUEST).subscribe({ error: (e: unknown) => (error = e) });

    http
      .expectOne('api/lab/checkout')
      .flush(null, { status: 500, statusText: 'Server Error' });

    expect(error).not.toBeInstanceOf(CheckoutRejected);
  });
});
