import { defineConfig, devices } from '@playwright/test';

const PORT = 4300;
const CI = !!process.env['CI'];
/** Localmente usa o Chrome instalado (sem baixar navegador); no CI, o Chromium do Playwright. */
const channel = CI ? undefined : 'chrome';

/**
 * Testes ponta a ponta contra o site montado como no GitHub Pages (npm run site:stage):
 * as rotas respondem 200 por cópias do index.html e o MSW roda no navegador de verdade.
 * Rode com `npm run e2e` (constrói, monta e testa) ou `npm run e2e:only` (só testa).
 */
export default defineConfig({
  testDir: './tests',
  // Folga para máquinas lentas: o site usa service worker e várias chamadas simuladas com latência.
  timeout: 45_000,
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  reporter: CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}/portfolio/`,
    locale: 'pt-BR',
    colorScheme: 'light',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], channel },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'], channel },
      // O mobile cobre os fluxos; a acessibilidade (axe) roda no desktop.
      testMatch: /flows\.spec\.ts/,
    },
  ],
  webServer: {
    command: `npx serve .site -l ${PORT}`,
    cwd: '..',
    url: `http://localhost:${PORT}/portfolio/`,
    reuseExistingServer: !CI,
    timeout: 60_000,
  },
});
