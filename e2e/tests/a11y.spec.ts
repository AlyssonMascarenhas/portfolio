import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import ROUTES from '../../tools/scripts/routes.json';

const WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const THEMES = ['light', 'dark'] as const;
const TABS = ['Código', 'Arquitetura'];

/** Violações que o axe encontra na parte visível da página, em formato legível no relatório. */
async function violations(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(WCAG)
    .analyze();
  return violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    nodes: v.nodes.map((n) => n.target.join(' ')),
  }));
}

for (const theme of THEMES) {
  test.describe(`acessibilidade (axe) no tema ${theme}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript(
        (value) => localStorage.setItem('portfolio.theme', value),
        theme,
      );
    });

    for (const route of ['', ...ROUTES]) {
      test(`/${route}`, async ({ page }) => {
        await page.goto(route);
        await expect(
          page.getByRole('heading', { level: 1 }).first(),
        ).toBeVisible();
        await page.waitForLoadState('networkidle');

        expect(await violations(page)).toEqual([]);
      });
    }

    for (const route of ROUTES.filter(
      (r) => r.startsWith('labs/') && r !== 'labs/signals-rxjs',
    )) {
      for (const tab of TABS) {
        test(`/${route}, aba ${tab}`, async ({ page }) => {
          await page.goto(route);
          await page.waitForLoadState('networkidle');
          await page.getByRole('tab', { name: tab }).click();

          expect(await violations(page)).toEqual([]);
        });
      }
    }
  });
}
