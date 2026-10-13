import { ApplicationRef } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SnippetsService } from './snippets.service';

describe('SnippetsService', () => {
  let http: HttpTestingController;
  let service: SnippetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
    service = TestBed.inject(SnippetsService);
  });

  const settle = () => TestBed.inject(ApplicationRef).whenStable();

  it('carrega os trechos gerados no build', async () => {
    TestBed.tick();
    http.expectOne('snippets.json').flush({
      modal: { file: 'libs/labs/x.ts', code: 'const open = signal(false);' },
    });
    await settle();

    expect(service.all.hasValue()).toBe(true);
    expect(service.all.value()['modal'].code).toBe(
      'const open = signal(false);',
    );
  });

  it('expõe o erro quando o arquivo não existe', async () => {
    TestBed.tick();
    http
      .expectOne('snippets.json')
      .flush(null, { status: 404, statusText: 'Not Found' });
    await settle();

    expect(service.all.error()).toBeTruthy();
  });
});
