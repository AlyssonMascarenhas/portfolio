# Portfolio — Alysson Mascarenhas

Portfólio interativo de engenharia front-end. Em vez de listar tecnologias, o site demonstra decisões de arquitetura com Angular (labs interativos). O conteúdo das seções vem de uma "API" mockada com MSW, em pt-br e en-us.

## Comandos

- `npm start` — dev server (http://localhost:4200)
- `npm run build` — build de produção
- `npm test` — testes (Vitest) de todos os projetos
- `npm run lint` — ESLint, incluindo as fronteiras entre libs
- `npm run i18n:check` — confere se pt-br.json e en-us.json têm as mesmas chaves
- `npm run snippets:extract` — gera `apps/portfolio/public/snippets.json` a partir das regiões `// #region <id>` … `// #endregion` em `libs/labs` (roda sozinho antes de build/serve; o arquivo é ignorado pelo git)
- `npx nx affected -t lint test build` — só o que mudou
- `npx nx graph` — grafo de dependências

Sempre rode `npm run lint`, `npm test` e `npm run i18n:check` antes de considerar uma tarefa concluída.

## Stack

Angular 22 (standalone, zoneless, OnPush por padrão), Nx 23, TypeScript strict, Vitest, ngx-translate 18, MSW 2.

## Arquitetura

```
apps/portfolio              app shell: rotas, header, bootstrap do MSW
libs/contracts              tipos compartilhados (Profile, ExperienceEntry, Lang...)   type:contracts
libs/mocks                  MSW: handlers + conteúdo pt-br/en-us                         type:mock
libs/shared/i18n            LanguageService, LanguageSwitcher, provideI18n()            type:data-access
libs/shell/data-access      PortfolioContentService (httpResource)                       type:data-access
libs/shell/feature-home     página inicial (hero, sobre, competências, contato)          type:feature
libs/shell/feature-experience  página de experiência                                     type:feature
libs/shared/ui              LabLayout (abas Demo/Code/Architecture) e CodeViewer       type:ui
libs/shared/snippets        SnippetsService: trechos de código extraídos dos labs      type:data-access
libs/shared/lab-kit         ScenarioPage, painel de instrumentação, Counters, RequestLog  type:ui
libs/shell/feature-labs     índice dos labs (/labs)                                      type:feature
libs/labs/signals-rxjs/feature  lab Signals vs RxJS                                    type:feature scope:lab-signals
libs/labs/api-playground/data-access  DomainError, mapper, interceptors, PlaygroundApi  type:data-access scope:lab-api
libs/labs/api-playground/feature      lab API Playground                               type:feature scope:lab-api
```

Camadas permitidas (forçadas pelo lint em `eslint.config.mjs`):
`app → feature → data-access → contracts`. Features não importam outras features. Só o app (`scope:app`) conhece `@portfolio/mocks` e monta shell e labs. Cada lab tem escopo próprio (`scope:lab-*`), enxerga só a si mesmo e `scope:shared`, e não importa outros labs, para poder virar microfrontend depois sem refatoração. Textos longos de um cenário (problema, arquitetura) ficam junto dele, em `Record<Lang, ...>` (use `localized()` de `@portfolio/i18n`), e não nos JSON de tradução. A aba Code lê trechos via o token `SNIPPET_SOURCE` (`@portfolio/lab-kit`), que cada lab liga ao `SnippetsService` nos providers das suas rotas. Serviços e interceptors que só valem num lab usam `@Service({ autoProvided: false })` e são providos nas rotas do lab, nunca na raiz.

Prefixo de seletores: `pf-`.

## Duas camadas de texto (importante)

- **Textos de interface** (botões, títulos, mensagens de erro): `apps/portfolio/public/i18n/pt-br.json` e `en-us.json`, via `TranslatePipe`. Toda chave nova vai nos DOIS arquivos.
- **Conteúdo** (perfil, experiência, competências): vem da API, já no idioma pedido pelo header `Accept-Language`. Fica em `libs/mocks/src/data/pt-br.ts` e `en-us.ts`, tipado por `PortfolioContent`. Nunca coloque conteúdo nos JSON de tradução.

## Idioma

`LanguageService` é a fonte única de verdade (signal `current`). ngx-translate, `<html lang>`, headers da API e formatação de datas (`Intl`) derivam dele. Datas trafegam como `'yyyy-mm'` e são formatadas na UI.

## Convenções do projeto

- Serviços novos: `@Service()` (Angular 22) em vez de `@Injectable({ providedIn: 'root' })`.
- Dados HTTP: `httpResource` com o idioma lido dentro da função de request. Use RxJS quando o problema for um fluxo de eventos (debounce, websocket, polling).
- Estados de loading/erro são sempre tratados no template, com `role="alert"` no erro e botão de tentar novamente.
- Não chame métodos no template: derive um view model com `computed()`.
- Testes com `HttpTestingController`; use `TestBed.tick()` para efeitos e resources.
- Commits e textos de interface em português; nomes de código em inglês.

## Skills do projeto

Em `.claude/skills/`: `nova-lib`, `novo-componente`, `novo-endpoint`, `traducao-i18n`, `novo-cenario-lab`. Use-as nas tarefas correspondentes.

## MCP

`.mcp.json` registra o MCP do Angular CLI (documentação, exemplos e boas práticas atuais do Angular) e o MCP do Nx (grafo do workspace, generators). Consulte-os antes de supor APIs do Angular ou do Nx.

---

<!-- Seção gerada por `ng g @schematics/angular:ai-config --tool=claude-code` -->

# Angular best practices

You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Do NOT set `changeDetection: ChangeDetectionStrategy.OnPush` explicitly. `OnPush` is the default in Angular v22+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `model()` for two-way bound properties with `[(prop)]` syntax instead of pairing `input()` with `output()`
- Use `computed()` for derived state
- Use `linkedSignal()` for state derived from multiple reactive sources that must stay synchronized
- Cada componente fica na sua pasta, com template e estilos em arquivos próprios: `nome/nome.ts`, `nome.html`, `nome.scss` e `nome.spec.ts` (`templateUrl` e `styleUrl` relativos). Só o template de teste (host de spec) e componentes de uma linha podem ser inline.
- Prefer Signal Forms (`@angular/forms/signals`) for new forms. They are stable in Angular v22+ and provide signal-based state, type-safe field access, and schema-based validation
- When not using Signal Forms, prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- Do NOT import `CommonModule`, import only the directives and pipes the template uses, such as `AsyncPipe` or `DatePipe`
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Prefer the `@Service` decorator over `@Injectable({providedIn: 'root'})` for new singleton services (Angular v22+)
- Use the `inject()` function instead of constructor injection
