import { Signal, computed, inject } from '@angular/core';
import { Lang } from '@portfolio/contracts';
import { LanguageService } from './language.service';

/** Seleciona o texto do idioma atual. Chamar em contexto de injeção. */
export function localized<T>(content: Record<Lang, T>): Signal<T> {
  const language = inject(LanguageService);
  return computed(() => content[language.current()]);
}
