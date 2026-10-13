import { DOCUMENT } from '@angular/common';
import { Service, effect, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  DEFAULT_LANG,
  Lang,
  SUPPORTED_LANGS,
  isLang,
  toBcp47,
} from '@portfolio/contracts';

const STORAGE_KEY = 'portfolio.lang';

/**
 * Fonte única de verdade do idioma. O ngx-translate, o <html lang>,
 * os headers da API e a formatação de datas derivam deste signal.
 */
@Service()
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly document = inject(DOCUMENT);

  private readonly _current = signal<Lang>(this.resolveInitialLang());
  readonly current = this._current.asReadonly();
  readonly supported = SUPPORTED_LANGS;

  constructor() {
    // Sincroniza o signal com APIs não reativas (ngx-translate, DOM, storage).
    effect(() => {
      const lang = this._current();
      this.translate.use(lang);
      this.document.documentElement.lang = toBcp47(lang);
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch {
        // storage indisponível (modo privado etc.): o idioma só não é lembrado
      }
    });
  }

  use(lang: Lang): void {
    this._current.set(lang);
  }

  private resolveInitialLang(): Lang {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      stored = null;
    }
    if (isLang(stored)) return stored;

    const browser =
      this.document.defaultView?.navigator.language.toLowerCase() ?? '';
    return browser.startsWith('en') ? 'en-us' : DEFAULT_LANG;
  }
}
