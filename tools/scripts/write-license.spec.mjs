import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseEnvValue, renderModule, resolveKey } from './write-license.mjs';

const NAME = 'PRIME_NG_LICENSE_KEY';

test('lê o valor, com ou sem aspas, ignorando comentários e linhas vazias', () => {
  assert.equal(parseEnvValue(`# chave\n\n${NAME}=abc123\nOUTRA=x`, NAME), 'abc123');
  assert.equal(parseEnvValue(`${NAME}="abc 123"`, NAME), 'abc 123');
  assert.equal(parseEnvValue(`${NAME}='abc'`, NAME), 'abc');
  assert.equal(parseEnvValue(`export ${NAME} = abc`, NAME), 'abc');
});

test('aceita fim de linha CRLF e devolve vazio quando não há a chave', () => {
  assert.equal(parseEnvValue(`${NAME}=abc\r\nOUTRA=x\r\n`, NAME), 'abc');
  assert.equal(parseEnvValue('OUTRA=x', NAME), '');
  assert.equal(parseEnvValue('', NAME), '');
});

test('a variável de ambiente vence o arquivo', () => {
  assert.equal(resolveKey({ [NAME]: 'do-ambiente' }, `${NAME}=do-arquivo`), 'do-ambiente');
  assert.equal(resolveKey({}, `${NAME}=do-arquivo`), 'do-arquivo');
  assert.equal(resolveKey({ [NAME]: '  ' }, `${NAME}=do-arquivo`), 'do-arquivo');
  assert.equal(resolveKey({}, undefined), '');
});

test('o módulo gerado escapa o valor e exporta uma string', () => {
  const out = renderModule('a"b\\c');
  assert.match(out, /export const PRIMENG_LICENSE: string = "a\\"b\\\\c";/);
  assert.match(renderModule(''), /PRIMENG_LICENSE: string = "";/);
});
