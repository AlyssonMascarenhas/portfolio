import { expect, test } from '@playwright/test';
import ROUTES from '../../tools/scripts/routes.json';

test.describe('rotas', () => {
  for (const route of ['', ...ROUTES]) {
    test(`/${route} responde 200 e mostra um título`, async ({ page }) => {
      const response = await page.goto(route);

      expect(response?.status()).toBe(200);
      await expect(
        page.getByRole('heading', { level: 1 }).first(),
      ).toBeVisible();
    });
  }

  test('o 404.html existe e abre o app (é o que o GitHub Pages serve para rotas desconhecidas)', async ({
    page,
  }) => {
    const response = await page.goto('404.html');

    expect(response?.status()).toBe(200);
    await expect(page.locator('pf-root')).toBeAttached();
  });
});

test('da home aos labs pelo botão principal', async ({ page }) => {
  await page.goto('');

  await page.getByRole('link', { name: 'Explorar os labs' }).click();

  await expect(page).toHaveURL(/\/portfolio\/labs$/);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Labs' }),
  ).toBeVisible();
});

test('busca com debounce: digitar mostra os produtos correspondentes', async ({
  page,
}) => {
  await page.goto('labs/signals-rxjs/search');

  await page.getByLabel('Buscar produtos').fill('wire');

  await expect(
    page.getByRole('listitem').filter({ hasText: 'Wireless Keyboard Slim' }),
  ).toBeVisible();
  await expect(
    page.getByRole('listitem').filter({ hasText: 'Wireless Earbuds' }),
  ).toBeVisible();
});

test('API Playground: o cenário 422 mostra os erros por campo', async ({
  page,
}) => {
  await page.goto('labs/api-playground');

  await page.getByText('422 Validação', { exact: true }).click();
  await page.getByRole('button', { name: 'Enviar pedido' }).click();

  const alert = page
    .getByRole('alert')
    .filter({ hasText: 'Corrija os campos abaixo' });
  await expect(alert).toBeVisible();
  await expect(alert).toContainText('Informe um e-mail válido.');
});

test('formulário: enviar vazio leva o foco ao primeiro campo inválido', async ({
  page,
}) => {
  await page.goto('labs/forms');

  await page.getByRole('button', { name: 'Finalizar pedido' }).click();

  await expect(page.locator('#co-name')).toBeFocused();
  await expect(page.locator('#co-name-error')).toHaveText(
    'Este campo é obrigatório.',
  );
});

test('formulário: um cupom digitado gera uma única consulta ao servidor', async ({
  page,
}) => {
  const lookups: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('api/lab/coupon')) lookups.push(request.url());
  });
  await page.goto('labs/forms');

  await page.locator('#co-coupon').pressSequentially('PROMO10', { delay: 40 });
  await expect.poll(() => lookups.length).toBe(1);
  await page.waitForTimeout(700); // margem para uma consulta extra aparecer, se houvesse

  expect(lookups).toHaveLength(1);
});

test('qualidade: lista os cenários dos testes e a busca filtra', async ({
  page,
}) => {
  await page.goto('labs/quality');

  const count = page.locator('pf-quality-report .count');
  await expect(count).toHaveText(/^\d+ de \d+ cenários$/);

  await page.getByLabel('Buscar cenário').fill('debounce');

  await expect(count).toHaveText(/^[1-9]\d* de \d+ cenários$/);
});

test('a aba Código aponta para o arquivo e as linhas no GitHub', async ({
  page,
}) => {
  await page.goto('labs/signals-rxjs/search');

  await page.getByRole('tab', { name: 'Código' }).click();

  await expect(
    page.getByRole('link', { name: /Ver no GitHub/ }).first(),
  ).toHaveAttribute(
    'href',
    /github\.com\/AlyssonMascarenhas\/portfolio\/blob\/main\/.+#L\d+-L\d+$/,
  );
});

test('troca de idioma: o título da página muda para inglês', async ({
  page,
}) => {
  await page.goto('');
  await expect(page).toHaveTitle(/^Início · /);

  await page.locator('pf-language-switcher').getByText('EN').first().click();

  await expect(page).toHaveTitle(/^Home · /);
});

test('tema escuro: o botão alterna a classe app-dark e a escolha é lembrada', async ({
  page,
}) => {
  await page.goto('');
  await expect(page.locator('html')).not.toHaveClass(/app-dark/);

  await page.getByRole('button', { name: 'Mudar para o tema escuro' }).click();
  await expect(page.locator('html')).toHaveClass(/app-dark/);

  await page.reload();
  await expect(page.locator('html')).toHaveClass(/app-dark/);
});
