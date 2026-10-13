import { InjectionToken } from '@angular/core';

/**
 * Base dos links "Ver no GitHub" (sem barra no fim): <repositório>/blob/<branch>.
 * O valor padrão aponta para o repositório do portfólio; um app pode sobrescrevê-lo nos providers.
 */
export const SOURCE_BASE_URL = new InjectionToken<string>('SOURCE_BASE_URL', {
  factory: () => 'https://github.com/AlyssonMascarenhas/portfolio/blob/main',
});
