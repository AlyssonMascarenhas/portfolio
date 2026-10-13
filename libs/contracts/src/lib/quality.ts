/** Cobertura em porcentagem (0 a 100). Medida de contexto: não diz se os cenários certos estão testados. */
export interface QualityCoverage {
  statements: number;
  branches: number;
  functions: number;
  lines: number;
}

/** Um cenário garantido por teste: o nome do `it`, escrito como frase de comportamento. */
export interface QualityScenario {
  name: string;
  /** Os `describe` que contêm o teste, do mais externo ao mais interno. */
  suite: string[];
  /** Linhas de uma tabela (`it.each`): 1 para um teste comum. */
  cases: number;
  skipped: boolean;
}

export interface QualitySpecFile {
  path: string;
  scenarios: QualityScenario[];
}

/** Uma área do projeto (lib ou app): os specs dela e, se houver relatório, a cobertura. */
export interface QualityArea {
  /** Caminho da raiz (ex.: libs/labs/signals-rxjs/feature). */
  project: string;
  specs: QualitySpecFile[];
  /** Total de casos, contando as linhas de `it.each`. */
  scenarioCount: number;
  coverage?: QualityCoverage;
}

/** Gerado por tools/scripts/build-quality-report.mjs a partir dos specs reais e do relatório de cobertura. */
export interface QualityReport {
  generatedAt: string;
  totals: { areas: number; specs: number; scenarios: number };
  /** Falso quando o relatório foi gerado sem rodar os testes com cobertura. */
  hasCoverage: boolean;
  areas: QualityArea[];
}
