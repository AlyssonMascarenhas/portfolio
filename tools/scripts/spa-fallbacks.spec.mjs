import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { ROUTES, writeFallbacks } from './spa-fallbacks.mjs';

/** Segmentos `path: '...'` de um arquivo de rotas, sem o curinga e sem o caminho vazio. */
const pathsIn = (file) =>
  [...readFileSync(file, 'utf8').matchAll(/path:\s*'([^']+)'/g)]
    .map((m) => m[1])
    .filter((p) => p !== '**');

test('a lista de rotas acompanha as rotas do app e dos labs', () => {
  const appPaths = pathsIn('apps/portfolio/src/app/app.routes.ts');
  const signals = pathsIn('libs/labs/signals-rxjs/feature/src/lib/signals-rxjs.routes.ts');

  const expected = [
    ...appPaths,
    ...signals.map((child) => `labs/signals-rxjs/${child}`),
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
