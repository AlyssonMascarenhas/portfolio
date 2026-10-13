import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MOCKS_READY, mocksReadyInterceptor } from './mocks-ready';

describe('mocksReadyInterceptor', () => {
  let release: () => void;
  let http: HttpClient;
  let backend: HttpTestingController;

  beforeEach(() => {
    const ready = new Promise<void>((resolve) => (release = resolve));
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([mocksReadyInterceptor])),
        provideHttpClientTesting(),
        { provide: MOCKS_READY, useValue: ready },
      ],
    });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
  });

  it('segura as chamadas à API até o MSW estar pronto', async () => {
    http.get('api/profile').subscribe();
    await Promise.resolve();
    backend.expectNone('api/profile');

    release();
    await new Promise((resolve) => setTimeout(resolve));

    backend.expectOne('api/profile').flush({});
  });

  it('não segura arquivos estáticos (i18n, snippets)', () => {
    http.get('i18n/pt-br.json').subscribe();

    backend.expectOne('i18n/pt-br.json').flush({});
  });
});
