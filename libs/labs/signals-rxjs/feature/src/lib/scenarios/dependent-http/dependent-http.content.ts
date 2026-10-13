import { LabProductCategory } from '@portfolio/contracts';
import { LocalizedScenario } from '@portfolio/lab-kit';

export interface DependentHttpDemoText {
  category: string;
  categories: Record<LabProductCategory, string>;
  rxjsColumn: string;
  resourceColumn: string;
  firedRxjs: string;
  canceledRxjs: string;
  firedResource: string;
  hint: string;
}

export const DEPENDENT_HTTP_CONTENT: LocalizedScenario<DependentHttpDemoText> =
  {
    'pt-br': {
      title: 'HTTP que depende de um estado',
      summary:
        'Uma lista filtrada por uma categoria selecionada, de duas formas válidas.',
      problem:
        'A lista de produtos precisa ser recarregada sempre que a categoria selecionada muda, e a resposta de uma categoria antiga nunca pode aparecer na nova.',
      question: {
        prompt: 'Como você ligaria a categoria à requisição?',
        suggestedId: 'resource',
        options: [
          {
            id: 'resource',
            label: 'httpResource lendo o signal da categoria',
            answer:
              'Menos código, estados de loading e erro já prontos, e a requisição anterior é cancelada sozinha. Para "dados que dependem de um estado", é o ponto de partida.',
          },
          {
            id: 'rxjs',
            label: 'toObservable + switchMap + toSignal',
            answer:
              'Equivalente em comportamento e totalmente válido. É a escolha quando o pipeline precisa de mais operadores no meio (retry com backoff, debounce, combinação com outros streams).',
          },
          {
            id: 'effect',
            label: 'effect() que chama o HttpClient',
            answer:
              'Funciona, mas você escreve estado dentro do effect, cuida do cancelamento à mão e corre o risco de uma resposta antiga sobrescrever a nova. Evite quando existe uma API feita para isso.',
          },
        ],
      },
      demo: {
        category: 'Categoria',
        categories: {
          keyboards: 'Teclados',
          monitors: 'Monitores',
          audio: 'Áudio',
          accessories: 'Acessórios',
        },
        rxjsColumn: 'toObservable + switchMap + toSignal',
        resourceColumn: 'httpResource',
        firedRxjs: 'Requisições (RxJS)',
        canceledRxjs: 'Canceladas (RxJS)',
        firedResource: 'Requisições (resource)',
        hint: 'Troque de categoria várias vezes rapidamente: as duas abordagens terminam mostrando só a última.',
      },
      snippets: [
        { id: 'dependent-http-resource', label: 'Com httpResource' },
        {
          id: 'dependent-http-rxjs',
          label: 'Com toObservable + switchMap + toSignal',
        },
      ],
      why: [
        'Aqui a requisição é derivada de um estado (a categoria), não de um evento. Quando o dado "depende de um signal", o httpResource expressa isso diretamente: a função de request lê o signal, e qualquer mudança refaz a chamada e cancela a anterior.',
        'A abordagem com RxJS faz o mesmo em mais linhas: toObservable transforma o signal em stream, switchMap cancela a anterior, e toSignal devolve o resultado ao template. O que muda é onde cada etapa mora, não o comportamento.',
        'Sobre estabilidade: no Angular 22, httpResource está marcado como API pública (@publicApi 22.0) e documentado em angular.dev sem aviso de experimental. Ainda assim, confira o status na versão que você usa antes de adotar um recurso novo.',
      ],
      alternatives: [
        {
          name: 'rxResource',
          text: 'Mesma ideia do httpResource, mas com um Observable como loader. Útil quando você já tem um service que devolve Observable.',
        },
        {
          name: 'effect() + HttpClient',
          text: 'Funciona para casos triviais, mas é o caminho que mais gera condição de corrida e estado inconsistente.',
        },
      ],
      differently: [
        'Se a lista precisar de retry com backoff, debounce ou combinação com outros streams, escolho o pipeline RxJS: operadores são a ferramenta certa para composição temporal.',
        'Se o filtro for apenas uma query string da URL, o próprio router já é a fonte de verdade, e o resource pode ler dela.',
        'Para mutações (POST, PUT), não uso resource: HttpClient direto, porque a requisição é uma ação do usuário, não um dado derivado.',
      ],
    },
    'en-us': {
      title: 'HTTP that depends on state',
      summary:
        'A list filtered by a selected category, done in two valid ways.',
      problem:
        'The product list must reload whenever the selected category changes, and the response for an old category must never show up in the new one.',
      question: {
        prompt: 'How would you connect the category to the request?',
        suggestedId: 'resource',
        options: [
          {
            id: 'resource',
            label: 'httpResource reading the category signal',
            answer:
              'Less code, loading and error states built in, and the previous request is cancelled on its own. For "data that depends on state", it is the starting point.',
          },
          {
            id: 'rxjs',
            label: 'toObservable + switchMap + toSignal',
            answer:
              'Equivalent in behavior and fully valid. It is the pick when the pipeline needs more operators in the middle (retry with backoff, debounce, combining with other streams).',
          },
          {
            id: 'effect',
            label: 'An effect() that calls HttpClient',
            answer:
              'It works, but you write state inside the effect, handle cancellation by hand and risk an old response overwriting the new one. Avoid it when an API exists for the job.',
          },
        ],
      },
      demo: {
        category: 'Category',
        categories: {
          keyboards: 'Keyboards',
          monitors: 'Monitors',
          audio: 'Audio',
          accessories: 'Accessories',
        },
        rxjsColumn: 'toObservable + switchMap + toSignal',
        resourceColumn: 'httpResource',
        firedRxjs: 'Requests (RxJS)',
        canceledRxjs: 'Canceled (RxJS)',
        firedResource: 'Requests (resource)',
        hint: 'Switch categories several times quickly: both approaches end up showing only the last one.',
      },
      snippets: [
        { id: 'dependent-http-resource', label: 'With httpResource' },
        {
          id: 'dependent-http-rxjs',
          label: 'With toObservable + switchMap + toSignal',
        },
      ],
      why: [
        'Here the request is derived from state (the category), not from an event. When data "depends on a signal", httpResource expresses it directly: the request function reads the signal, and any change reissues the call and cancels the previous one.',
        'The RxJS approach does the same in more lines: toObservable turns the signal into a stream, switchMap cancels the previous call, and toSignal hands the result back to the template. What changes is where each step lives, not the behavior.',
        'On stability: in Angular 22, httpResource is marked as public API (@publicApi 22.0) and documented on angular.dev without an experimental warning. Still, check the status in the version you use before adopting a new feature.',
      ],
      alternatives: [
        {
          name: 'rxResource',
          text: 'Same idea as httpResource, but with an Observable as the loader. Useful when you already have a service returning an Observable.',
        },
        {
          name: 'effect() + HttpClient',
          text: 'Works for trivial cases, but it is the path that most often produces race conditions and inconsistent state.',
        },
      ],
      differently: [
        'If the list needs retry with backoff, debounce or combination with other streams, I pick the RxJS pipeline: operators are the right tool for temporal composition.',
        'If the filter is just a URL query string, the router is already the source of truth, and the resource can read from it.',
        'For mutations (POST, PUT) I do not use a resource: plain HttpClient, because the request is a user action, not derived data.',
      ],
    },
  };
