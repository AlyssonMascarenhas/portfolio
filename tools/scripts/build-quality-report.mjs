// Gera apps/portfolio/public/quality-report.json: os cenários que os testes garantem (os nomes de
// describe/it dos specs reais) por área do projeto e, se houver, a cobertura de cada área.
//
// O que importa é o cenário, não a linha: os nomes dos testes são frases de comportamento, e é isso
// que o lab "Qualidade e testes" mostra. A cobertura entra só como contexto, quando existem
// relatórios `coverage-summary.json` (gerados por `nx run-many -t test --coverage`).
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';

const OUTPUT_FILE = 'apps/portfolio/public/quality-report.json';
const COVERAGE_DIR = 'coverage';
const SOURCE_DIRS = ['apps', 'libs', 'tools', 'e2e'];
const SPEC = /\.spec\.(ts|mjs)$/;
const posix = (p) => p.split(sep).join('/');

const SUITE_FNS = new Set(['describe']);
const TEST_FNS = new Set(['it', 'test']);

function stringOf(node) {
  if (
    node &&
    (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
  )
    return node.text;
  return undefined;
}

/** Nome do identificador-base de `it`, `it.skip`, `it.each(t)`: { base, modifier, table }. */
function describeCallee(expr) {
  // it.each(table)(name, fn): o callee é uma chamada de it.each
  if (
    ts.isCallExpression(expr) &&
    ts.isPropertyAccessExpression(expr.expression)
  ) {
    const access = expr.expression;
    if (ts.isIdentifier(access.expression) && access.name.text === 'each') {
      const table = expr.arguments[0];
      return {
        base: access.expression.text,
        modifier: 'each',
        cases:
          table && ts.isArrayLiteralExpression(table)
            ? table.elements.length
            : 1,
      };
    }
  }
  if (ts.isPropertyAccessExpression(expr) && ts.isIdentifier(expr.expression)) {
    return { base: expr.expression.text, modifier: expr.name.text, cases: 1 };
  }
  if (ts.isIdentifier(expr))
    return { base: expr.text, modifier: undefined, cases: 1 };
  return undefined;
}

/**
 * Extrai { name, suite, cases, skipped } de cada teste de um spec (TypeScript ou JavaScript).
 * Só entram testes com nome literal: os gerados em um laço, com nome interpolado, ficam de fora.
 */
export function extractScenarios(source, fileName = 'spec.ts') {
  const kind = fileName.endsWith('.mjs') ? ts.ScriptKind.JS : ts.ScriptKind.TS;
  const sf = ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.Latest,
    true,
    kind,
  );
  const scenarios = [];

  const visit = (node, suite) => {
    if (ts.isCallExpression(node)) {
      const callee = describeCallee(node.expression);
      const name = stringOf(node.arguments[0]);
      if (callee && name !== undefined) {
        // describe(...) e test.describe(...) (Playwright) agrupam; os dois abrem uma suíte.
        if (SUITE_FNS.has(callee.base) || callee.modifier === 'describe') {
          node.arguments
            .slice(1)
            .forEach((arg) => visit(arg, [...suite, name]));
          return;
        }
        if (TEST_FNS.has(callee.base)) {
          scenarios.push({
            name,
            suite,
            cases: callee.cases,
            skipped: callee.modifier === 'skip' || callee.modifier === 'todo',
          });
          return;
        }
      }
    }
    ts.forEachChild(node, (child) => visit(child, suite));
  };
  visit(sf, []);
  return scenarios;
}

/** Raiz da área de um arquivo: o diretório mais próximo com project.json (ou tools/scripts e e2e). */
export function projectRootOf(
  file,
  hasProjectJson = (dir) => existsSync(join(dir, 'project.json')),
) {
  let dir = dirname(file);
  while (dir && dir !== '.' && dir !== dirname(dir)) {
    if (hasProjectJson(dir)) return posix(dir);
    dir = dirname(dir);
  }
  if (file.startsWith('tools/')) return 'tools/scripts';
  if (file.startsWith('e2e/')) return 'e2e';
  return posix(dirname(file));
}

const pct = (metric) => Math.round((metric?.pct ?? 0) * 10) / 10;

/** Lê um coverage-summary.json (formato do istanbul/v8) e devolve as 4 porcentagens. */
export function parseCoverageSummary(json) {
  const total = json?.total;
  if (!total) return undefined;
  return {
    statements: pct(total.statements),
    branches: pct(total.branches),
    functions: pct(total.functions),
    lines: pct(total.lines),
  };
}

/** Procura os coverage-summary.json e devolve { <pasta relativa a coverage/>: cobertura }. */
export function readCoverageSummaries(dir = COVERAGE_DIR) {
  if (!existsSync(dir)) return {};
  const found = {};
  for (const entry of readdirSync(dir, {
    recursive: true,
    withFileTypes: true,
  })) {
    if (!entry.isFile() || entry.name !== 'coverage-summary.json') continue;
    const full = join(entry.parentPath, entry.name);
    const coverage = parseCoverageSummary(
      JSON.parse(readFileSync(full, 'utf8')),
    );
    if (coverage) found[posix(relative(dir, dirname(full)))] = coverage;
  }
  return found;
}

/** Casa a pasta de cobertura (libs/shared/ui, ou só "portfolio") com a raiz da área. */
function coverageFor(project, summaries) {
  const key = Object.keys(summaries).find(
    (k) => project === k || project.endsWith(`/${k}`),
  );
  return key ? summaries[key] : undefined;
}

export function buildReport(specs, summaries = {}, now = new Date()) {
  const areas = new Map();
  for (const { path, project, scenarios } of specs) {
    if (!areas.has(project)) areas.set(project, []);
    areas.get(project).push({ path, scenarios });
  }

  const list = [...areas.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([project, files]) => {
      files.sort((a, b) => a.path.localeCompare(b.path));
      const coverage = coverageFor(project, summaries);
      return {
        project,
        specs: files,
        scenarioCount: files.reduce(
          (sum, f) => sum + f.scenarios.reduce((n, s) => n + s.cases, 0),
          0,
        ),
        ...(coverage && { coverage }),
      };
    });

  return {
    generatedAt: now.toISOString(),
    totals: {
      areas: list.length,
      specs: list.reduce((n, a) => n + a.specs.length, 0),
      scenarios: list.reduce((n, a) => n + a.scenarioCount, 0),
    },
    hasCoverage: list.some((a) => a.coverage),
    areas: list,
  };
}

function listSpecs() {
  const out = [];
  for (const root of SOURCE_DIRS) {
    if (!existsSync(root)) continue;
    for (const e of readdirSync(root, {
      recursive: true,
      withFileTypes: true,
    })) {
      const full = posix(join(e.parentPath, e.name));
      if (e.isFile() && SPEC.test(e.name) && !full.includes('/node_modules/'))
        out.push(full);
    }
  }
  return out;
}

function main() {
  const specs = listSpecs().map((path) => ({
    path,
    project: projectRootOf(path),
    scenarios: extractScenarios(readFileSync(path, 'utf8'), path),
  }));
  const report = buildReport(specs, readCoverageSummaries());

  mkdirSync(dirname(OUTPUT_FILE), { recursive: true });
  writeFileSync(OUTPUT_FILE, `${JSON.stringify(report, null, 2)}\n`);
  const { totals, hasCoverage } = report;
  console.log(
    `✔ ${totals.scenarios} cenários em ${totals.specs} specs e ${totals.areas} áreas` +
      (hasCoverage ? ', com cobertura' : ' (sem relatório de cobertura)'),
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  main();
