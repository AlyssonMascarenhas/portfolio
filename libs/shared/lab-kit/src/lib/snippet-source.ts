import { InjectionToken } from '@angular/core';

export interface SnippetSource {
  error(): unknown;
  hasValue(): boolean;
  value(): Record<string, { file: string; code: string }> | undefined;
  reload(): unknown;
}

/**
 * De onde a aba Code lê os trechos de código. Cada lab o liga ao SnippetsService nos providers
 * de suas rotas, para este kit continuar sendo só apresentação (sem acesso a dados).
 */
export const SNIPPET_SOURCE = new InjectionToken<SnippetSource>(
  'SNIPPET_SOURCE',
);
