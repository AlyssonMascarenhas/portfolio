import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { MOCKS_READY } from './app/mocks-ready';

/**
 * Não há backend: o MSW é a API do site, inclusive em produção.
 * Quando existir uma API real, desligue esta flag (ou use fileReplacements por ambiente).
 */
const USE_API_MOCKS = true;

async function startApiMocks(): Promise<void> {
  if (!USE_API_MOCKS) return;
  const { worker } = await import('@portfolio/mocks'); // chunk separado
  await worker.start({
    onUnhandledRequest: 'bypass',
    quiet: true,
    serviceWorker: { url: `${document.baseURI}mockServiceWorker.js` },
  });
}

// O app abre em paralelo com o MSW (as requisições esperam por MOCKS_READY). Se o service worker
// não subir (navegador sem suporte, modo privado), as seções mostram o estado de erro com
// "tentar novamente" em vez de uma tela em branco.
const mocksReady = startApiMocks().catch((err) =>
  console.error('[MSW] mocks indisponíveis', err),
);

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    { provide: MOCKS_READY, useValue: mocksReady },
  ],
}).catch((err) => console.error(err));
