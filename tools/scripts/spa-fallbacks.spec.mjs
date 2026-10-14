import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { ROUTES, renderSitemap, writeFallbacks } from './spa-fallbacks.mjs';

/** Segmentos `path: '...'` de um arquivo de rotas, sem o curinga e sem o caminho vazio. */
const pathsIn = (file) =>
  [...readFileSync(file, 'utf8').matchAll(/path:\s*'([^']+)'/g)]
    .map((m) => m[1])
    .filter((p) => p !== '**');

test('a lista de rotas acompanha as rotas do app e dos labs', () => {
  const appPaths = pathsIn('apps/portfolio/src/app/app.routes.ts');
  const signals = pathsIn(
    'libs/labs/signals-rxjs/feature/src/lib/signals-rxjs.routes.ts',
  );

  const forms = pathsIn('libs/labs/forms/feature/src/lib/forms.routes.ts');

  const expected = [
    ...appPaths,
    ...signals.map((child) => `labs/signals-rxjs/${child}`),
    ...forms.map((child) => `labs/forms/${child}`),
  ].sort();

  assert.deepEqual([...ROUTES].sort(), expected);
});

test('copia o index.html para cada rota e para o 404.html', () => {
  const dir = mkdtempSync(join(tmpdir(), 'spa-'));
  writeFileSync(join(dir, 'index.html'), '<base href="/x/">app');

  const count = writeFallbacks(dir, ['a', 'a/b']);

  assert.equal(count, 2);
  for (const file of ['404.html', 'a/index.html', 'a/b/index.html']) {
    assert.equal(readFileSync(join(dir, file), 'utf8'), '<base href="/x/">app');
  }
  assert.equal(existsSync(join(dir, 'c/index.html')), false);
});

test('falha com mensagem clara quando não há index.html', () => {
  const dir = mkdtempSync(join(tmpdir(), 'spa-'));
  assert.throws(() => writeFallbacks(dir), /index\.html não encontrado/);
});

test('com a URL do site: grava o sitemap, o robots e troca o marcador do index.html', () => {
  const dir = mkdtempSync(join(tmpdir(), 'spa-'));
  writeFileSync(
    join(dir, 'index.html'),
    '<meta property="og:image" content="__SITE_URL__/og-image.png">',
  );
  writeFileSync(join(dir, 'robots.txt'), 'User-agent: *\nAllow: /\n');

  writeFallbacks(dir, ['a', 'a/b'], 'https://exemplo.github.io/portfolio/');

  const sitemap = readFileSync(join(dir, 'sitemap.xml'), 'utf8');
  assert.match(
    sitemap,
    /<loc>https:\/\/exemplo\.github\.io\/portfolio\/<\/loc>/,
  );
  assert.match(
    sitemap,
    /<loc>https:\/\/exemplo\.github\.io\/portfolio\/a\/b<\/loc>/,
  );
  assert.match(
    readFileSync(join(dir, 'robots.txt'), 'utf8'),
    /Sitemap: https:\/\/exemplo\.github\.io\/portfolio\/sitemap\.xml/,
  );

  const expected =
    '<meta property="og:image" content="https://exemplo.github.io/portfolio/og-image.png">';
  for (const file of [
    'index.html',
    '404.html',
    'a/index.html',
    'a/b/index.html',
  ]) {
    assert.equal(readFileSync(join(dir, file), 'utf8'), expected);
  }
});

test('sem a URL do site, não grava sitemap nem mexe no marcador', () => {
  const dir = mkdtempSync(join(tmpdir(), 'spa-'));
  writeFileSync(join(dir, 'index.html'), '__SITE_URL__');

  writeFallbacks(dir, ['a']);

  assert.equal(existsSync(join(dir, 'sitemap.xml')), false);
  assert.equal(readFileSync(join(dir, 'index.html'), 'utf8'), '__SITE_URL__');
});

test('o sitemap lista a home e cada rota exatamente uma vez', () => {
  const urls = [
    ...renderSitemap('https://x.dev').matchAll(/<loc>([^<]+)<\/loc>/g),
  ].map((m) => m[1]);

  assert.equal(urls.length, ROUTES.length + 1);
  assert.equal(new Set(urls).size, urls.length);
  assert.equal(urls[0], 'https://x.dev/');
});
