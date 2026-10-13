import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { provideI18n } from '@portfolio/i18n';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { mocksReadyInterceptor } from './mocks-ready';
import { PRIMENG_LICENSE } from './primeng-license.generated';
import { PortfolioPreset } from './theme';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      appRoutes,
      withComponentInputBinding(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
    ),
    provideHttpClient(withFetch(), withInterceptors([mocksReadyInterceptor])),
    provideI18n(),
    // O tema escuro é a classe app-dark no <html> (ver LayoutService e o script do index.html).
    providePrimeNG({
      license: PRIMENG_LICENSE,
      theme: {
        preset: PortfolioPreset,
        options: { darkModeSelector: '.app-dark' },
      },
    }),
  ],
};
