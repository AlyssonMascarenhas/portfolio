import { LocalizedScenario } from '@portfolio/lab-kit';

export interface QualityDemoText {
  summaryScenarios: string;
  summarySpecs: string;
  summaryAreas: string;
  generatedAt: string;
  search: string;
  searchHint: string;
  /** Usa {shown} e {total}. */
  count: string;
  noResults: string;
  /** Usa {n}. */
  areaCount: string;
  /** Singular, para uma área com um cenário só. */
  areaCountOne: string;
  /** Usa {n}. */
  cases: string;
  skipped: string;
  coverageTitle: string;
  coverageNote: string;
  noCoverage: string;
  colArea: string;
  colStatements: string;
  colBranches: string;
  colFunctions: string;
  colLines: string;
  loadError: string;
  metricScenarios: string;
  metricShown: string;
  metricAreas: string;
}

export const QUALITY_CONTENT: LocalizedScenario<QualityDemoText> = {
  'pt-br': {
    title: 'Qualidade e testes',
    summary:
      'Os cenários que os testes do próprio site garantem, e o que a cobertura de linha não diz.',
    problem:
      'Uma cobertura de 90% não diz se o que importa está testado. Esta lista é lida dos testes reais do projeto: cada linha é um comportamento que quebra o build se deixar de valer.',
    question: {
      prompt:
        'O que você usaria como medida principal da qualidade dos testes?',
      suggestedId: 'scenarios',
      options: [
        {
          id: 'scenarios',
          label: 'Os cenários de comportamento garantidos',
          answer:
            'O nome de cada teste é uma frase sobre comportamento ("cancela a requisição anterior quando um termo novo chega"). Dá para ler, revisar com quem não programa e enxergar o que falta: o que acontece se o servidor responde 500? E se o idioma muda no meio?',
        },
        {
          id: 'coverage',
          label: 'A porcentagem de cobertura de linha',
          answer:
            'É barata de medir e boa para achar código que nenhum teste executa. Como meta, porém, vira número a perseguir: dá para chegar a 100% com testes sem nenhuma asserção. Serve de termômetro, não de objetivo.',
        },
        {
          id: 'mutation',
          label: 'Mutation testing (por exemplo, Stryker)',
          answer:
            'Altera o código de propósito e vê se algum teste percebe. É a medida mais honesta de "este teste detectaria um defeito?". O custo é tempo de execução, então compensa em módulos críticos, não no projeto inteiro.',
        },
      ],
    },
    demo: {
      summaryScenarios: 'Cenários',
      summarySpecs: 'Specs',
      summaryAreas: 'Áreas',
      generatedAt: 'Gerado em',
      search: 'Buscar cenário',
      searchHint: 'Tente "debounce", "erro" ou "idioma".',
      count: '{shown} de {total} cenários',
      noResults: 'Nenhum cenário encontrado para essa busca.',
      areaCount: '{n} cenários',
      areaCountOne: '{n} cenário',
      cases: '{n} casos',
      skipped: 'pulado',
      coverageTitle: 'Cobertura por área (só contexto)',
      coverageNote:
        'A cobertura mostra que a linha foi executada, não que o comportamento certo foi verificado: um teste sem asserção também "cobre". Use-a para achar código morto, não para medir confiança.',
      noCoverage:
        'Este build não tem relatório de cobertura. Gere com npm run quality:report.',
      colArea: 'Área',
      colStatements: 'Instruções',
      colBranches: 'Ramos',
      colFunctions: 'Funções',
      colLines: 'Linhas',
      loadError: 'Não foi possível carregar o relatório de testes.',
      metricScenarios: 'Cenários no total',
      metricShown: 'Cenários exibidos',
      metricAreas: 'Áreas com testes',
    },
    snippets: [
      {
        id: 'quality-test-cancel',
        label: 'Um cenário real: o switchMap cancela a requisição anterior',
      },
      {
        id: 'quality-test-table',
        label: 'Uma tabela de cenários: cada status HTTP vira um tipo de erro',
      },
    ],
    why: [
      'Um teste é uma especificação executável. Quando o nome descreve o comportamento, a lista de testes vira a documentação do que o sistema promete, e ela nunca fica desatualizada, porque quebra o build.',
      'Por isso esta página lê os nomes direto dos arquivos de teste (com o compilador do TypeScript) e agrupa por área. Os números de cobertura aparecem só como contexto, numa tabela discreta, com o aviso do que eles não medem.',
      'A pergunta que mais ajuda ao revisar testes não é "quantas linhas?", e sim "que falha real este teste pegaria?". Os testes de retry, por exemplo, existem para garantir que um POST sem chave de idempotência nunca seja repetido.',
    ],
    alternatives: [
      {
        name: 'Gate de cobertura mínima no CI',
        text: 'Útil para a cobertura não cair (impede regressão), desde que ninguém o trate como meta. Eu o usaria como piso, não como objetivo.',
      },
      {
        name: 'Testes de snapshot',
        text: 'Baratos de escrever e frágeis de manter: qualquer mudança visual quebra, e é fácil aceitar o novo snapshot sem olhar. Bons para saídas pequenas e estáveis.',
      },
      {
        name: 'Só testes ponta a ponta',
        text: 'Verificam o que o usuário vê, mas são lentos e instáveis para cobrir cada caso. Funcionam melhor como poucos fluxos críticos sobre uma base de testes unitários por cenário.',
      },
    ],
    differently: [
      'Em módulos com regra de negócio crítica (cálculo de preço, permissões), eu rodaria mutation testing: ali, "o teste detectaria um defeito?" vale o tempo extra.',
      'Em um time grande, eu adicionaria um gate de cobertura como piso (não cair) e revisaria os nomes dos testes em code review, como se fossem requisitos.',
      'Para interface muito visual, testes de regressão visual (capturas de tela comparadas) complementam os cenários, que não enxergam espaçamento nem cor.',
    ],
  },
  'en-us': {
    title: 'Quality and tests',
    summary:
      "The scenarios this site's own tests guarantee, and what line coverage does not tell you.",
    problem:
      "A 90% coverage figure does not say whether what matters is tested. This list is read from the project's real tests: each line is a behavior that breaks the build if it stops being true.",
    question: {
      prompt: 'What would you use as the main measure of test quality?',
      suggestedId: 'scenarios',
      options: [
        {
          id: 'scenarios',
          label: 'The behavior scenarios that are guaranteed',
          answer:
            'Each test name is a sentence about behavior ("cancels the previous request when a new term arrives"). You can read it, review it with non-programmers and see what is missing: what happens if the server answers 500? What if the language changes midway?',
        },
        {
          id: 'coverage',
          label: 'The line coverage percentage',
          answer:
            'It is cheap to measure and good at finding code no test runs. As a target, though, it becomes a number to chase: you can reach 100% with tests that have no assertions. It is a thermometer, not a goal.',
        },
        {
          id: 'mutation',
          label: 'Mutation testing (for example, Stryker)',
          answer:
            'It changes the code on purpose and checks whether any test notices. It is the most honest measure of "would this test catch a defect?". The cost is run time, so it pays off on critical modules, not on the whole project.',
        },
      ],
    },
    demo: {
      summaryScenarios: 'Scenarios',
      summarySpecs: 'Specs',
      summaryAreas: 'Areas',
      generatedAt: 'Generated on',
      search: 'Search scenarios',
      searchHint: 'Try "debounce", "error" or "language".',
      count: '{shown} of {total} scenarios',
      noResults: 'No scenarios match this search.',
      areaCount: '{n} scenarios',
      areaCountOne: '{n} scenario',
      cases: '{n} cases',
      skipped: 'skipped',
      coverageTitle: 'Coverage by area (context only)',
      coverageNote:
        'Coverage shows a line was executed, not that the right behavior was verified: a test with no assertion also "covers". Use it to find dead code, not to measure confidence.',
      noCoverage:
        'This build has no coverage report. Generate it with npm run quality:report.',
      colArea: 'Area',
      colStatements: 'Statements',
      colBranches: 'Branches',
      colFunctions: 'Functions',
      colLines: 'Lines',
      loadError: 'Could not load the test report.',
      metricScenarios: 'Scenarios in total',
      metricShown: 'Scenarios shown',
      metricAreas: 'Areas with tests',
    },
    snippets: [
      {
        id: 'quality-test-cancel',
        label: 'A real scenario: switchMap cancels the previous request',
      },
      {
        id: 'quality-test-table',
        label: 'A scenario table: each HTTP status becomes an error kind',
      },
    ],
    why: [
      'A test is an executable specification. When its name describes behavior, the list of tests becomes documentation of what the system promises, and it never goes stale, because it breaks the build.',
      'That is why this page reads the names straight from the test files (with the TypeScript compiler) and groups them by area. Coverage numbers appear only as context, in a discreet table, with a note about what they do not measure.',
      'The question that helps most when reviewing tests is not "how many lines?" but "what real failure would this test catch?". The retry tests, for example, exist to guarantee that a POST without an idempotency key is never repeated.',
    ],
    alternatives: [
      {
        name: 'A minimum coverage gate in CI',
        text: 'Useful so coverage does not drop (it prevents regressions), as long as nobody treats it as a goal. I would use it as a floor, not a target.',
      },
      {
        name: 'Snapshot tests',
        text: 'Cheap to write and fragile to maintain: any visual change breaks them, and it is easy to accept the new snapshot without looking. Good for small, stable outputs.',
      },
      {
        name: 'End-to-end tests only',
        text: 'They verify what the user sees, but are slow and flaky for covering every case. They work best as a few critical flows on top of unit tests per scenario.',
      },
    ],
    differently: [
      'On modules with critical business rules (price calculation, permissions), I would run mutation testing: there, "would the test catch a defect?" is worth the extra time.',
      'On a larger team, I would add a coverage gate as a floor (do not drop) and review test names in code review, as if they were requirements.',
      'For very visual interfaces, visual regression tests (compared screenshots) complement scenarios, which cannot see spacing or color.',
    ],
  },
};
