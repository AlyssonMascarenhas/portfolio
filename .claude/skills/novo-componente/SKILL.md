---
name: novo-componente
description: Cria componentes Angular seguindo as convenções do portfólio (Angular 22, signals, i18n, acessibilidade). Use ao criar ou refatorar componentes, páginas ou seções.
---

# Componente no padrão do projeto

## Onde colocar

- Página ligada a uma rota → lib `type:feature`, exportada no `index.ts` e carregada com `loadComponent` em `apps/portfolio/src/app/app.routes.ts`.
- Componente visual reutilizável sem acesso a dados → lib `type:ui` (crie com a skill `nova-lib` se ainda não existir).
- Nunca importe uma feature dentro de outra.

## Regras

- Não declare `standalone: true` nem `changeDetection: OnPush` (já são padrão no Angular 22).
- `input()`, `output()`, `model()`; `computed()` para derivados; `inject()` para dependências.
- Host bindings no objeto `host` do decorator.
- Template inline quando pequeno; controle de fluxo nativo (`@if`, `@for`, `@let`).
- Nenhum texto literal no template: use `{{ 'secao.chave' | translate }}` e siga a skill `traducao-i18n`.
- Sem métodos chamados no template: monte um view model com `computed()`.
- Dados assíncronos: trate os três estados (`isLoading()`, `error()`, `hasValue()`), com `role="alert"` e botão de tentar novamente no erro.
- Acessibilidade: hierarquia de títulos coerente, `aria-labelledby` nas seções, foco visível, WCAG AA.
- Estilos: use os tokens de `apps/portfolio/src/styles.scss` (`--color-*`, `--space`, `--measure`).

## Teste

Crie `<nome>.spec.ts` ao lado do componente, com `provideTranslateService()` e, se usar dados, `provideHttpClientTesting()`. Teste o comportamento visível, não detalhes internos.

## Validação

    npx nx affected -t lint test build
    npm run i18n:check
