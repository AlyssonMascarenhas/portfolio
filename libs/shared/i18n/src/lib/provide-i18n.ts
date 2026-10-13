import {
  EnvironmentProviders,
  Provider,
  inject,
  provideAppInitializer,
} from '@angular/core';
import { TranslateService, provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { DEFAULT_LANG } from '@portfolio/contracts';
import { firstValueFrom } from 'rxjs';
import { LanguageService } from './language.service';

/** Textos de interface em public/i18n/<lang>.json, carregados antes do primeiro render. */
export function provideI18n(): (Provider | EnvironmentProviders)[] {
  return [
    provideTranslateService({
      // useHttpBackend: os arquivos de tradução não passam pelos interceptors da aplicação
      loader: provideTranslateHttpLoader({
        prefix: 'i18n/',
        suffix: '.json',
        useHttpBackend: true,
      }),
      fallbackLang: DEFAULT_LANG,
    }),
    provideAppInitializer(() => {
      const language = inject(LanguageService);
      return firstValueFrom(inject(TranslateService).use(language.current()));
    }),
  ];
}
