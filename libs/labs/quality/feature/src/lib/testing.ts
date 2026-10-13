import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { SNIPPET_SOURCE, SnippetSource } from '@portfolio/lab-kit';

/** Fonte de trechos vazia: a aba Code não é o foco dos testes deste lab. */
const noSnippets: SnippetSource = {
  error: () => undefined,
  hasValue: () => true,
  value: () => ({}),
  reload: () => true,
};

/** Providers comuns dos testes do lab. O idioma é fixado em pt-br para os textos serem previsíveis. */
export function provideQualityTesting() {
  localStorage.setItem('portfolio.lang', 'pt-br');
  return [
    provideHttpClient(),
    provideHttpClientTesting(),
    provideRouter([]),
    provideTranslateService(),
    { provide: SNIPPET_SOURCE, useValue: noSnippets },
  ];
}
