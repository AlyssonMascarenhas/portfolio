import assert from 'node:assert/strict';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { ROUTES } from './spa-fallbacks.mjs';
import { stageSite } from './stage-site.mjs';

function fakeBuild() {
  const dir = mkdtempSync(join(tmpdir(), 'build-'));
  writeFileSync(
    join(dir, 'index.html'),
    '<meta property="og:image" content="__SITE_URL__/og-image.png">',
  );
  writeFileSync(join(dir, 'robots.txt'), 'User-agent: *\n');
  mkdirSync(join(dir, 'i18n'));
  writeFileSync(join(dir, 'i18n', 'pt-br.json'), '{}');
  return dir;
}

test('monta o site em <saida>/portfolio com o build, os fallbacks de rota e o sitemap', () => {
  const build = fakeBuild();
  const out = mkdtempSync(join(tmpdir(), 'out-'));

  const site = stageSite(build, out);

  assert.equal(site, join(out, 'portfolio'));
  assert.equal(existsSync(join(site, 'i18n', 'pt-br.json')), true);
  assert.equal(existsSync(join(site, '404.html')), true);
  for (const route of ROUTES) {
    assert.equal(existsSync(join(site, route, 'index.html')), true, route);
  }
  assert.match(
    readFileSync(join(site, 'sitemap.xml'), 'utf8'),
    /localhost:4300\/portfolio\/labs/,
  );
});

test('não altera o build original (o deploy usa a URL pública, não a local)', () => {
  const build = fakeBuild();

  stageSite(build, mkdtempSync(join(tmpdir(), 'out-')));

  assert.match(readFileSync(join(build, 'index.html'), 'utf8'), /__SITE_URL__/);
  assert.equal(existsSync(join(build, 'sitemap.xml')), false);
});

test('recomeça do zero: apaga o que sobrou de uma montagem anterior', () => {
  const build = fakeBuild();
  const out = mkdtempSync(join(tmpdir(), 'out-'));
  mkdirSync(join(out, 'portfolio'));
  writeFileSync(join(out, 'portfolio', 'velho.txt'), 'sobra');

  stageSite(build, out);

  assert.equal(existsSync(join(out, 'portfolio', 'velho.txt')), false);
});

test('falha com mensagem clara quando não há build', () => {
  assert.throws(
    () =>
      stageSite(
        mkdtempSync(join(tmpdir(), 'vazio-')),
        mkdtempSync(join(tmpdir(), 'out-')),
      ),
    /build não encontrado/,
  );
});
