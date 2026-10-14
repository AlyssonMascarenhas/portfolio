/**
 * Conventional Commits: `tipo(escopo): descrição`. O tipo é em inglês (padrão da ferramenta) e a
 * descrição em português (regra do projeto). Os escopos são as áreas do workspace; ver CLAUDE.md.
 */
export const SCOPES = [
  'app', // apps/portfolio
  'contracts', // libs/contracts
  'mocks', // libs/mocks
  'i18n', // libs/shared/i18n e os JSON de tradução
  'shell', // libs/shell/*
  'shared', // libs/shared/*
  'labs', // mudanças que valem para todos os labs
  'signals-rxjs', // libs/labs/signals-rxjs
  'api-playground', // libs/labs/api-playground
  'quality', // libs/labs/quality
  'forms', // libs/labs/forms
  'e2e', // e2e/
  'tools', // tools/scripts
  'ci', // .github, Lighthouse CI, hooks
  'deps', // dependências
  'deps-dev', // devDependencies (escopo que o Dependabot usa)
  'docs', // CLAUDE.md, README, CHANGELOG
];

export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', SCOPES],
    // A descrição é em português: começa em minúscula, mas nomes próprios (Angular, Lighthouse) são livres.
    'subject-case': [0],
    'header-max-length': [2, 'always', 100],
    // Corpos e rodapés (trailers, URLs) podem passar da largura padrão.
    'body-max-line-length': [0],
    'footer-max-line-length': [0],
  },
};
