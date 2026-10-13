import { Lang, PortfolioContent } from '@portfolio/contracts';
import { enUs } from './en-us';
import { ptBr } from './pt-br';

export const contentByLang: Record<Lang, PortfolioContent> = {
  'pt-br': ptBr,
  'en-us': enUs,
};
