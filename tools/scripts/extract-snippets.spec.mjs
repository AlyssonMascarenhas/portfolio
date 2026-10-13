import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildSnippets, extractRegions } from './extract-snippets.mjs';

test('extrai a região e remove a indentação comum', () => {
  const src = [
    'class A {',
    '  // #region modal',
    '  readonly open = signal(false);',
    '    nested();',
    '  // #endregion',
    '}',
  ].join('\n');
  assert.deepEqual(extractRegions(src), [
    {
      id: 'modal',
      code: 'readonly open = signal(false);\n  nested();',
      startLine: 3,
      endLine: 4,
    },
  ]);
});

test('extrai várias regiões e aceita CRLF', () => {
  const src =
    '// #region a\r\n1\r\n// #endregion\r\n// #region b\r\n2\r\n// #endregion\r\n';
  assert.deepEqual(
    extractRegions(src).map((r) => [r.id, r.code]),
    [
      ['a', '1'],
      ['b', '2'],
    ],
  );
});

test('erra em região sem fim, fim solto e aninhamento', () => {
  assert.throws(() => extractRegions('// #region a\nx'), /sem #endregion/);
  assert.throws(() => extractRegions('// #endregion'), /sem #region/);
  assert.throws(
    () => extractRegions('// #region a\n// #region b'),
    /aninhamento/,
  );
});

test('erra em ids duplicados entre arquivos', () => {
  const files = {
    'x.ts': '// #region a\n1\n// #endregion',
    'y.ts': '// #region a\n2\n// #endregion',
  };
  assert.throws(
    () => buildSnippets(Object.keys(files), (f) => files[f]),
    /duplicado/,
  );
});

test('indexa por id com o arquivo de origem', () => {
  const files = {
    'x.ts': '// #region b\n1\n// #endregion\n// #region a\n2\n// #endregion',
  };
  assert.deepEqual(
    buildSnippets(['x.ts'], (f) => files[f]),
    {
      a: { file: 'x.ts', code: '2', startLine: 5, endLine: 5 },
      b: { file: 'x.ts', code: '1', startLine: 2, endLine: 2 },
    },
  );
});

test('as linhas ignoram os marcadores e as linhas em branco nas pontas', () => {
  const src = [
    'a',
    '// #region x',
    '',
    'um',
    '',
    'dois',
    '',
    '// #endregion',
  ].join('\n');
  const [region] = extractRegions(src);

  assert.equal(region.startLine, 4); // 'um'
  assert.equal(region.endLine, 6); // 'dois'
});
