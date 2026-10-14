import { Lang } from '@portfolio/contracts';
import { LocalizedScenario } from '@portfolio/lab-kit';
import { CHECKOUT_CONTENT } from '../checkout/checkout.content';
import { MONEY_CONTENT } from '../money/money.content';

export interface LabScenarioEntry {
  /** Segmento de rota do cenário, relativo à rota do lab. */
  path: string;
  content: LocalizedScenario<unknown>;
}

export const FORMS_SCENARIOS: readonly LabScenarioEntry[] = [
  { path: 'checkout', content: CHECKOUT_CONTENT },
  { path: 'money', content: MONEY_CONTENT },
];

export interface FormsLabIntro {
  title: string;
  lead: string;
  scenariosTitle: string;
}

export const FORMS_INTRO: Record<Lang, FormsLabIntro> = {
  'pt-br': {
    title: 'Formulários com Signal Forms',
    lead: 'Signal Forms (estável no Angular 22) trata o formulário como dados e regras: um signal com o model e um schema de validação. Cada cenário abaixo é um problema concreto de formulário, com demo funcionando, o código real e o raciocínio por trás da escolha.',
    scenariosTitle: 'Cenários',
  },
  'en-us': {
    title: 'Forms with Signal Forms',
    lead: 'Signal Forms (stable in Angular 22) treats a form as data and rules: a signal holding the model and a validation schema. Each scenario below is a concrete form problem, with a working demo, the real code and the reasoning behind the choice.',
    scenariosTitle: 'Scenarios',
  },
};
