import { Lang } from '@portfolio/contracts';

export interface ScenarioOption {
  id: string;
  label: string;
  /** Custo e contexto desta opção; nunca "certo" ou "errado". */
  answer: string;
}

export interface ScenarioQuestion {
  prompt: string;
  options: readonly ScenarioOption[];
  /** Opção que eu escolheria neste cenário. */
  suggestedId: string;
}

export interface ScenarioSnippet {
  id: string;
  label: string;
}

export interface ScenarioAlternative {
  name: string;
  text: string;
}

/**
 * Textos de um cenário. Ficam junto do cenário (e não nos JSON de tradução) para o lab
 * continuar autocontido; o Record<Lang, ...> garante pt-br e en-us em tempo de compilação.
 */
export interface ScenarioText<Demo> {
  title: string;
  /** Uma frase para o índice do lab. */
  summary: string;
  problem: string;
  question?: ScenarioQuestion;
  demo: Demo;
  snippets: readonly ScenarioSnippet[];
  why: readonly string[];
  alternatives: readonly ScenarioAlternative[];
  /** "Quando eu escolheria diferente". */
  differently: readonly string[];
}

export type LocalizedScenario<Demo> = Record<Lang, ScenarioText<Demo>>;
