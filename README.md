# Portfolio — Alysson Mascarenhas

Portfólio interativo de engenharia front-end com Angular. Em vez de listar tecnologias, demonstra decisões de arquitetura.

## Requisitos

- Node.js `^22.22.3`, `^24.15.0` ou `>=26` (o Angular 22 exige; veja `.nvmrc`)
- npm 10+

## Primeiros passos

```bash
npm install
npm start          # http://localhost:4200
```

Outros comandos: `npm run build`, `npm test`, `npm run lint`, `npm run i18n:check`.

## Qualidade

Lighthouse (build de produção servido com compressão, perfil mobile): performance 95–97, acessibilidade 100, boas práticas 100, SEO 100. Sem compressão (um servidor estático simples) a performance cai para ~77, porque o MSW (~290 kB) entra no caminho crítico; em hospedagem real, gzip/brotli resolve.

O MSW sobe em paralelo ao Angular: o app pinta o primeiro frame sem esperar, e as chamadas à "API" esperam o service worker (`apps/portfolio/src/app/mocks-ready.ts`). Se o service worker não subir (navegador sem suporte, modo privado), as seções mostram o estado de erro com "tentar novamente".

## Licença do PrimeNG

O PrimeNG 22 exige uma chave de licença (a Community é gratuita para uso individual e não comercial). Sem ela, o site mostra o aviso "Invalid PrimeUI License".

- **Local:** copie `.env.example` para `.env.local` (ignorado pelo git) e preencha `PRIME_NG_LICENSE_KEY`.
- **CI:** o workflow lê o secret `PRIME_NG_LICENSE_KEY` do repositório.
- **Como entra no app:** `tools/scripts/write-license.mjs` gera `apps/portfolio/src/app/primeng-license.generated.ts` (ignorado) antes de build, serve, lint e test. `npm run license:write` roda à mão.
- **Atenção:** a verificação é offline e roda no navegador, então a chave vai dentro do bundle publicado e fica visível a quem inspecionar o site. O secret só a mantém fora do repositório.

## Deploy

O site é estático (sem backend). O build fica em `dist/apps/portfolio/browser`. Em hospedagem com subpasta (ex.: GitHub Pages de um repositório), faça o build com `--base-href=/nome-do-repo/` e copie `index.html` para `404.html` para o fallback das rotas. O workflow `.github/workflows/deploy.yml` faz isso e publica no GitHub Pages.

## O que há aqui

- **Shell:** home (quem sou, stack, contato, currículo) e experiência, funcionando sem passar pelos labs.
- **Lab Signals vs RxJS** (`/labs/signals-rxjs`): seis cenários (estado local, derivado, busca com debounce, HTTP dependente de estado, fluxo contínuo, estado compartilhado), cada um com demo, código real e arquitetura.
- **Lab API Playground** (`/labs/api-playground`): onze respostas possíveis de uma API, com interceptors, retry com backoff, timeout, mapeamento para `DomainError` e UX por tipo de erro.

Cada cenário tem demo, código e arquitetura, e termina em "Quando eu escolheria diferente".

## Decisões principais

- **Nx com um único app e libs por camada.** As fronteiras (`app → feature → data-access → contracts`) e os escopos (`scope:lab-*`) são verificados pelo lint. Cada lab tem escopo isolado, então virar microfrontend é extrair uma lib, não refatorar. Isso é preparação, não microfrontend em runtime: o custo seria alto e não pagaria nada agora.
- **O código exibido é o código que roda.** Trechos marcados com `// #region <id>` ... `// #endregion` são extraídos por `tools/scripts/extract-snippets.mjs` antes de build e serve. A aba Code não fica desatualizada em relação à demo.
- **Instrumentação em vez de explicação.** As demos mostram o que normalmente é invisível: recálculos de `computed`, requisições canceladas pelo `switchMap`, assinaturas ativas, tentativas e backoff.
- **Sem "pontuação" de arquitetura e sem respostas "erradas".** As perguntas dos cenários explicam custo e contexto de cada opção, porque a maioria das decisões é "depende, e aqui está do que depende".
- **Angular 22 moderno:** standalone, zoneless, OnPush por padrão, signals, `httpResource` e `@Service`.
- **API mockada com MSW.** O site não tem backend: o service worker do MSW intercepta as chamadas, então `HttpClient` e o tratamento de estados rodam de verdade. Trocar por uma API real não muda as features.
- **Duas camadas de idioma.** Textos de interface com ngx-translate (`public/i18n/pt-br.json` e `en-us.json`); conteúdo vindo da API no idioma do header `Accept-Language`.
- **Desenvolvimento assistido por IA.** `CLAUDE.md`, skills do projeto em `.claude/skills/` e servidores MCP do Angular CLI e do Nx em `.mcp.json`.

## Estrutura

```
apps/portfolio                  shell: rotas, header, bootstrap do MSW
libs/contracts                  tipos compartilhados
libs/mocks                      handlers MSW e conteúdo pt-br/en-us
libs/shared/i18n                idioma, seletor e provideI18n()
libs/shell/data-access          PortfolioContentService
libs/shell/feature-home         página inicial
libs/shell/feature-experience   experiência profissional
libs/shared/ui                  LabLayout e CodeViewer
libs/shared/snippets            SnippetsService (trechos gerados por tools/scripts/extract-snippets.mjs)
libs/shared/lab-kit             ScenarioPage, instrumentação e utilitários dos labs
libs/shell/feature-labs         índice dos labs
libs/labs/signals-rxjs/feature  lab Signals vs RxJS (escopo isolado)
libs/labs/api-playground/*      lab API Playground: DomainError, interceptors, retry com backoff (escopo isolado)
```
