---
name: nova-lib
description: Cria uma nova biblioteca no workspace Nx do portfólio com tags, prefixo e alias corretos. Use quando o usuário pedir "criar lib", "nova biblioteca", "novo lab" ou uma nova feature que precise de projeto Nx próprio.
---

# Criar uma lib no workspace

## 1. Decida tipo e escopo

| Tipo | Quando | Pode depender de |
|---|---|---|
| `type:feature` | páginas/rotas | data-access, ui, util, contracts |
| `type:data-access` | serviços, estado, HTTP | data-access, util, contracts |
| `type:ui` | componentes de apresentação sem acesso a dados | ui, util, contracts |
| `type:util` | funções puras | util, contracts |

Escopos: `scope:shell`, `scope:shared` ou `scope:lab-<nome>` (um por lab). Se o escopo for novo, adicione a regra em `eslint.config.mjs`: um lab depende só de si mesmo e de `scope:shared`.

## 2. Gere

Lib Angular:

    npx nx g @nx/angular:library libs/<pasta>/<nome> --name=<projeto> --importPath=@portfolio/<pasta>/<nome> --tags=type:<tipo>,scope:<escopo> --unitTestRunner=vitest-analog --no-interactive

Lib TypeScript pura (contracts/util):

    npx nx g @nx/js:library libs/<pasta>/<nome> --name=<projeto> --importPath=@portfolio/<pasta>/<nome> --bundler=none --unitTestRunner=none --tags=type:<tipo>,scope:<escopo> --no-interactive

## 3. Ajuste o que o gerador não faz

- Em `project.json`: `"prefix": "pf"`.
- No `eslint.config.mjs` da lib: prefixo dos seletores `pf`.
- No `vite.config.mts`: `passWithNoTests: true` dentro de `test`.
- Apague o componente de exemplo gerado e atualize `src/index.ts`.

## 4. Valide

    npx nx run-many -t lint test build

`npx nx graph` deve mostrar a lib só com as dependências esperadas.
