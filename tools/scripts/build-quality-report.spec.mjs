import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  buildReport,
  extractScenarios,
  parseCoverageSummary,
  projectRootOf,
} from './build-quality-report.mjs';

test('extrai os testes com a cadeia de describe e ignora o que não é teste', () => {
  const src = `
    const helper = (it) => it;
    describe('Busca', () => {
      it('espera o debounce', () => {});
      describe('com erro', () => {
        test("mostra o alerta", () => {});
      });
    });
    it(\`fora de describe\`, () => {});
  `;

  assert.deepEqual(
    extractScenarios(src).map((s) => [s.suite.join(' > '), s.name]),
    [
      ['Busca', 'espera o debounce'],
      ['Busca > com erro', 'mostra o alerta'],
      ['', 'fora de describe'],
    ],
  );
});

test('entende test.describe e test do Playwright, e ignora hooks e nomes interpolados', () => {
  const src = `
    test.describe('rotas', () => {
      test.beforeEach(async () => {});
      test('abre a home', async () => {});
      for (const r of rotas) test(\`/\${r}\`, async () => {});
    });
    test('fluxo solto', async () => {});
  `;

  assert.deepEqual(
    extractScenarios(src).map((s) => [s.suite.join(' > '), s.name]),
    [
      ['rotas', 'abre a home'],
      ['', 'fluxo solto'],
    ],
  );
});

test('it.each conta uma linha por caso da tabela', () => {
  const src = `
    it.each([[400, 'a'], [401, 'b'], [403, 'c']])('status %i', () => {});
    it.each<[number, string]>([[1, 'x'], [2, 'y']])('com tipo %i', () => {});
  `;

  assert.deepEqual(
    extractScenarios(src).map((s) => [s.name, s.cases]),
    [
      ['status %i', 3],
      ['com tipo %i', 2],
    ],
  );
});

test('it.skip e it.todo aparecem como pulados', () => {
  const [skipped, todo, normal] = extractScenarios(
    "it.skip('a', () => {}); it.todo('b'); it('c', () => {});",
  );

  assert.equal(skipped.skipped, true);
  assert.equal(todo.skipped, true);
  assert.equal(normal.skipped, false);
});

test('lê specs em JavaScript (.mjs) e ignora nomes que não são literais', () => {
  const src =
    "import { test } from 'node:test'; test('um', () => {}); test(nome, () => {});";

  assert.deepEqual(
    extractScenarios(src, 'x.spec.mjs').map((s) => s.name),
    ['um'],
  );
});

test('a raiz da área é o diretório mais próximo com project.json', () => {
  const has = (dir) => dir === 'libs/shared/ui';

  assert.equal(
    projectRootOf('libs/shared/ui/src/lib/a/a.spec.ts', has),
    'libs/shared/ui',
  );
  assert.equal(
    projectRootOf('tools/scripts/x.spec.mjs', () => false),
    'tools/scripts',
  );
});

test('lê as quatro porcentagens do coverage-summary', () => {
  const json = {
    total: {
      statements: { pct: 91.234 },
      branches: { pct: 80 },
      functions: { pct: 100 },
      lines: { pct: 90.05 },
    },
  };

  assert.deepEqual(parseCoverageSummary(json), {
    statements: 91.2,
    branches: 80,
    functions: 100,
    lines: 90.1,
  });
  assert.equal(parseCoverageSummary({}), undefined);
});

const SPECS = [
  {
    path: 'libs/a/src/x.spec.ts',
    project: 'libs/a',
    scenarios: [{ name: 'um', suite: [], cases: 1, skipped: false }],
  },
  {
    path: 'libs/a/src/y.spec.ts',
    project: 'libs/a',
    scenarios: [{ name: 'tabela', suite: [], cases: 3, skipped: false }],
  },
  {
    path: 'apps/portfolio/z.spec.ts',
    project: 'apps/portfolio',
    scenarios: [{ name: 'app', suite: [], cases: 1, skipped: false }],
  },
];

test('o relatório agrupa por área, soma os casos e funciona sem cobertura', () => {
  const report = buildReport(SPECS, {}, new Date('2026-01-01T00:00:00Z'));

  assert.equal(report.hasCoverage, false);
  assert.deepEqual(report.totals, { areas: 2, specs: 3, scenarios: 5 });
  assert.deepEqual(
    report.areas.map((a) => [a.project, a.scenarioCount]),
    [
      ['apps/portfolio', 1],
      ['libs/a', 4],
    ],
  );
  assert.equal(report.areas[0].coverage, undefined);
});

test('a cobertura casa pelo caminho completo ou pelo sufixo (ex.: "portfolio")', () => {
  const summaries = {
    'libs/a': { statements: 90, branches: 80, functions: 70, lines: 60 },
    portfolio: { statements: 50, branches: 40, functions: 30, lines: 20 },
  };
  const report = buildReport(SPECS, summaries);

  assert.equal(report.hasCoverage, true);
  assert.equal(
    report.areas.find((a) => a.project === 'libs/a').coverage.statements,
    90,
  );
  assert.equal(
    report.areas.find((a) => a.project === 'apps/portfolio').coverage.lines,
    20,
  );
});
