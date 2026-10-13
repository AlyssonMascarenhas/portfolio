import { LocalizedScenario } from '@portfolio/lab-kit';

export interface SearchDemoText {
  label: string;
  hint: string;
  idle: string;
  fired: string;
  canceled: string;
  done: string;
}

export const SEARCH_CONTENT: LocalizedScenario<SearchDemoText> = {
  'pt-br': {
    title: 'Busca com debounce',
    summary: 'Autocomplete que não dispara uma requisição a cada tecla.',
    problem:
      'Uma busca de produtos que, sem cuidado, dispara uma requisição a cada tecla e pode mostrar a resposta de uma busca antiga por cima da nova.',
    question: {
      prompt: 'Qual ferramenta resolve melhor a busca?',
      suggestedId: 'rxjs',
      options: [
        {
          id: 'rxjs',
          label: 'RxJS: debounceTime + distinctUntilChanged + switchMap',
          answer:
            'Debounce, descarte de repetidos e cancelamento da requisição anterior são operadores prontos e testáveis. Eventos ao longo do tempo é exatamente o território do RxJS.',
        },
        {
          id: 'signals',
          label: 'Só signals e effect()',
          answer:
            'Possível, mas você reimplementa debounce com setTimeout, cuida do cancelamento à mão e escreve estado dentro de effect. Dá para fazer; é mais código para chegar ao mesmo lugar.',
        },
        {
          id: 'resource',
          label: 'httpResource com o termo como signal',
          answer:
            'Cancela a requisição anterior sozinho, o que é ótimo. Mas ele dispara a cada mudança do termo: falta o debounce. Dá para combinar com um signal já "debounced", e aí o debounce volta a ser RxJS.',
        },
      ],
    },
    demo: {
      label: 'Buscar produtos',
      hint: 'Tente "wire" ou "mon". Digite "erro" para simular falha do servidor. Digite devagar e depressa e compare o log.',
      idle: 'Digite para buscar.',
      fired: 'Requisições disparadas',
      canceled: 'Canceladas pelo switchMap',
      done: 'Concluídas',
    },
    snippets: [{ id: 'search-pipeline', label: 'O pipeline da busca' }],
    why: [
      'Uma busca é um fluxo de eventos: teclas ao longo do tempo. Debounce, distinct e cancelamento são operações sobre o tempo, e é isso que o RxJS faz melhor.',
      'O switchMap é a peça-chave: ao chegar um termo novo, ele cancela a requisição anterior (o HttpClient aborta a chamada). No log, as linhas riscadas são respostas que nunca chegaram a ser usadas. Sem isso, uma resposta lenta de "wi" poderia chegar depois da resposta de "wireless" e sobrescrevê-la.',
      'O estado resultante (carregando, pronto, erro) sai do pipeline e vira um signal com toSignal, só na borda, para o template.',
    ],
    alternatives: [
      {
        name: 'mergeMap',
        text: 'Mantém todas as requisições vivas e emite na ordem em que respondem. Numa busca, isso permite que uma resposta antiga sobrescreva a nova. Serve quando todas as respostas importam e a ordem não (ex.: registrar eventos).',
      },
      {
        name: 'concatMap',
        text: 'Enfileira: a segunda só começa depois da primeira. Correto quando a ordem importa e nada pode ser descartado (ex.: salvar rascunhos em sequência), mas deixa a busca lenta.',
      },
      {
        name: 'exhaustMap',
        text: 'Ignora o novo enquanto o anterior roda. Bom para um botão "salvar" contra clique duplo; ruim numa busca, onde o último termo é o que vale.',
      },
    ],
    differently: [
      'Se o termo viesse de um parâmetro de rota ou de um input() e eu não precisasse de debounce, usaria httpResource: menos código e o cancelamento já vem pronto.',
      'Se a busca fosse paginada e acumulasse resultados, ou tivesse retry com backoff, continuaria em RxJS, mas provavelmente extrairia o pipeline para um service.',
    ],
  },
  'en-us': {
    title: 'Debounced search',
    summary: 'An autocomplete that does not fire a request on every keystroke.',
    problem:
      'A product search that, left alone, fires a request on every keystroke and may show the response of an old search over the new one.',
    question: {
      prompt: 'Which tool fits the search best?',
      suggestedId: 'rxjs',
      options: [
        {
          id: 'rxjs',
          label: 'RxJS: debounceTime + distinctUntilChanged + switchMap',
          answer:
            'Debounce, dropping repeats and cancelling the previous request are ready-made, testable operators. Events over time is exactly RxJS territory.',
        },
        {
          id: 'signals',
          label: 'Signals and effect() only',
          answer:
            'Possible, but you reimplement debounce with setTimeout, handle cancellation by hand and write state inside an effect. It can be done; it is more code to end up in the same place.',
        },
        {
          id: 'resource',
          label: 'httpResource with the term as a signal',
          answer:
            'It cancels the previous request on its own, which is great. But it fires on every change of the term: there is no debounce. You can combine it with an already-debounced signal, and then the debounce is RxJS again.',
        },
      ],
    },
    demo: {
      label: 'Search products',
      hint: 'Try "wire" or "mon". Type "erro" to simulate a server failure. Type slowly and quickly and compare the log.',
      idle: 'Type to search.',
      fired: 'Requests fired',
      canceled: 'Canceled by switchMap',
      done: 'Completed',
    },
    snippets: [{ id: 'search-pipeline', label: 'The search pipeline' }],
    why: [
      'A search is a stream of events: keystrokes over time. Debounce, distinct and cancellation are operations over time, which is what RxJS does best.',
      'switchMap is the key piece: when a new term arrives, it cancels the previous request (HttpClient aborts the call). In the log, the struck-through lines are responses that were never used. Without it, a slow response for "wi" could arrive after the one for "wireless" and overwrite it.',
      'The resulting state (loading, ready, error) leaves the pipeline and becomes a signal through toSignal, only at the edge, for the template.',
    ],
    alternatives: [
      {
        name: 'mergeMap',
        text: 'Keeps every request alive and emits in the order they respond. In a search, that lets an old response overwrite the new one. Fits when every response matters and order does not (e.g. logging events).',
      },
      {
        name: 'concatMap',
        text: 'Queues: the second starts only after the first. Right when order matters and nothing may be dropped (e.g. saving drafts in sequence), but it makes the search slow.',
      },
      {
        name: 'exhaustMap',
        text: 'Ignores new input while the previous one runs. Good for a "save" button against double clicks; bad in a search, where the latest term is the one that counts.',
      },
    ],
    differently: [
      'If the term came from a route param or an input() and I did not need debounce, I would use httpResource: less code, and cancellation comes built in.',
      'If the search were paginated and accumulated results, or had retry with backoff, I would stay in RxJS but probably extract the pipeline into a service.',
    ],
  },
};
