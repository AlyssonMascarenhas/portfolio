import { provideHttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { SNIPPET_SOURCE } from '@portfolio/lab-kit';
import { SnippetsService } from '@portfolio/snippets';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

/** Providers comuns dos testes de cenário. O idioma é fixado em pt-br para os textos serem previsíveis. */
export function provideScenarioTesting() {
  localStorage.setItem('portfolio.lang', 'pt-br');
  return [
    provideHttpClient(),
    provideHttpClientTesting(),
    provideRouter([]),
    provideTranslateService(),
    { provide: SNIPPET_SOURCE, useFactory: () => inject(SnippetsService).all },
  ];
}
