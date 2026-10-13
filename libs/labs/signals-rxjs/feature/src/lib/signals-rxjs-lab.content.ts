import { DEPENDENT_HTTP_CONTENT } from './scenarios/dependent-http/dependent-http.content';
import { DERIVED_STATE_CONTENT } from './scenarios/derived-state/derived-state.content';
import { LOCAL_STATE_CONTENT } from './scenarios/local-state/local-state.content';
import { SEARCH_CONTENT } from './scenarios/search/search.content';
import { SHARED_STATE_CONTENT } from './scenarios/shared-state/shared-state.content';
import { TICKER_CONTENT } from './scenarios/ticker/ticker.content';
import { Lang } from '@portfolio/contracts';
import { LocalizedScenario } from '@portfolio/lab-kit';

export interface LabScenarioEntry {
  /** Segmento de rota do cenário, relativo à rota do lab. */
  path: string;
  content: LocalizedScenario<unknown>;
}

export const LAB_SCENARIOS: readonly LabScenarioEntry[] = [
  { path: 'local-state', content: LOCAL_STATE_CONTENT },
  { path: 'derived-state', content: DERIVED_STATE_CONTENT },
  { path: 'search', content: SEARCH_CONTENT },
  { path: 'dependent-http', content: DEPENDENT_HTTP_CONTENT },
  { path: 'ticker', content: TICKER_CONTENT },
  { path: 'shared-state', content: SHARED_STATE_CONTENT },
];

export interface LabIntro {
  title: string;
  lead: string;
  rules: readonly string[];
  rulesTitle: string;
  scenariosTitle: string;
}

export const LAB_INTRO: Record<Lang, LabIntro> = {
  'pt-br': {
    title: 'Signals vs RxJS',
    lead: 'Signals modelam estado: um valor que existe agora. RxJS modela eventos: coisas que acontecem ao longo do tempo. A interoperabilidade acontece na fronteira, com toSignal e toObservable. Cada cenário abaixo é um problema concreto, com demo funcionando, o código real e o raciocínio por trás da escolha.',
    rulesTitle: 'Regra prática',
    rules: [
      'Valor que existe agora e é lido pelo template: signal() e computed().',
      'Evento, tempo, cancelamento, composição de fluxos: RxJS.',
      'Dado que depende de um signal e vem do servidor: httpResource, ou RxJS se o pipeline precisar de operadores.',
      'Estado compartilhado: service com signals primeiro; NgRx quando a escala justificar.',
    ],
    scenariosTitle: 'Cenários',
  },
  'en-us': {
    title: 'Signals vs RxJS',
    lead: 'Signals model state: a value that exists right now. RxJS models events: things that happen over time. Interoperability happens at the boundary, with toSignal and toObservable. Each scenario below is a concrete problem, with a working demo, the real code and the reasoning behind the choice.',
    rulesTitle: 'Rule of thumb',
    rules: [
      'A value that exists now and is read by the template: signal() and computed().',
      'Events, time, cancellation, composing streams: RxJS.',
      'Data that depends on a signal and comes from the server: httpResource, or RxJS if the pipeline needs operators.',
      'Shared state: a service with signals first; NgRx when scale justifies it.',
    ],
    scenariosTitle: 'Scenarios',
  },
};
