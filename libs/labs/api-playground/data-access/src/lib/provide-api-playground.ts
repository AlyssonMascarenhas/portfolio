import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { AttemptTrace } from './attempt-trace';
import {
  errorMappingInterceptor,
  retryInterceptor,
  timeoutInterceptor,
  traceInterceptor,
} from './interceptors';
import { PlaygroundApi } from './playground-api';

// #region api-interceptor-chain
/**
 * Providers do API Playground, para as rotas do lab. O HttpClient daqui é só do lab:
 * os interceptors não afetam o resto do site.
 *
 * Ordem (de fora para dentro): o mapper vê o erro final, o retry vê o erro bruto de cada
 * tentativa, e o timeout vale por tentativa.
 */
export function provideApiPlayground(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideHttpClient(
      withFetch(),
      withInterceptors([
        errorMappingInterceptor,
        retryInterceptor,
        traceInterceptor,
        timeoutInterceptor,
      ]),
    ),
    AttemptTrace,
    PlaygroundApi,
  ]);
}
// #endregion
