import { LocalizedScenario } from '@portfolio/lab-kit';

export interface SharedStateDemoText {
  headerLabel: string;
  cartCount: string;
  catalogTab: string;
  checkoutTab: string;
  pages: string;
  add: string;
  remove: string;
  empty: string;
  total: string;
  hint: string;
  eventAdded: string;
  eventRemoved: string;
  units: string;
  lines: string;
  products: readonly { id: number; name: string; price: number }[];
}

const PRODUCTS = [
  { id: 1, name: 'Mechanical Keyboard 75%', price: 450 },
  { id: 2, name: 'Wireless Ergonomic Mouse', price: 180 },
  { id: 3, name: 'USB-C Hub 7 ports', price: 220 },
] as const;

export const SHARED_STATE_CONTENT: LocalizedScenario<SharedStateDemoText> = {
  'pt-br': {
    title: 'Estado compartilhado entre páginas',
    summary:
      'O contador do carrinho no header e a lista na página de checkout.',
    problem:
      'O header mostra quantos itens há no carrinho, e a página de checkout mostra e edita os mesmos itens. Os dois precisam concordar sempre.',
    question: {
      prompt: 'Onde esse estado deve morar?',
      suggestedId: 'service',
      options: [
        {
          id: 'service',
          label: 'Um service com signals',
          answer:
            'O estado fica em um único lugar, o header e o checkout leem os mesmos signals e as mutações passam por métodos nomeados. Sem biblioteca, sem boilerplate, fácil de testar.',
        },
        {
          id: 'ngrx',
          label: 'NgRx Store ou SignalStore',
          answer:
            'Também resolve, e é a escolha certa quando o problema cresce (veja a aba Architecture). Para um carrinho com poucos produtores e consumidores, é mais estrutura do que o problema pede.',
        },
        {
          id: 'inputs',
          label: 'Inputs e outputs passando pelo pai',
          answer:
            'Funciona enquanto os dois componentes são vizinhos. Quando header e checkout vivem em ramos distantes da árvore ou em rotas diferentes, você passa estado por componentes que nem o usam.',
        },
      ],
    },
    demo: {
      headerLabel: 'Cabeçalho do site',
      cartCount: 'Itens no carrinho',
      catalogTab: 'Catálogo',
      checkoutTab: 'Checkout',
      pages: 'Páginas do exemplo',
      add: 'Adicionar',
      remove: 'Remover',
      empty: 'O carrinho está vazio.',
      total: 'Total',
      hint: 'Adicione itens no catálogo e troque para o checkout: o header e a página leem o mesmo estado.',
      eventAdded: 'Adicionado',
      eventRemoved: 'Removido',
      units: 'Unidades',
      lines: 'Linhas',
      products: PRODUCTS,
    },
    snippets: [{ id: 'shared-store', label: 'O store do carrinho' }],
    why: [
      'O estado compartilhado precisa de uma única fonte de verdade que sobreviva à troca de páginas. Um service com um signal privado e signals públicos somente leitura dá isso: só o service muda o estado, e quem lê usa count e total, derivados com computed().',
      'Como o service é um singleton do escopo em que é provido, o header e o checkout compartilham a mesma instância. As mutações têm nome (add, remove), o que torna o fluxo legível e testável.',
    ],
    alternatives: [
      {
        name: 'NgRx Store / SignalStore',
        text: 'Traz convenções rígidas, devtools e efeitos encadeados. Vale quando esses benefícios pagam o custo.',
      },
      {
        name: 'Inputs e outputs',
        text: 'Ótimo para comunicação pai-filho. Ruim para estado que atravessa a árvore.',
      },
    ],
    differently: [
      'Eu migraria para NgRx Store ou SignalStore quando: houver muitos produtores e consumidores do mesmo estado; efeitos colaterais encadeados (sincronizar com a API, invalidar cache, reagir a outras ações); necessidade de devtools e time-travel para depurar; ou um time grande precisando de convenções rígidas para não divergir.',
      'Se o carrinho precisasse persistir no servidor e sincronizar entre abas, eu o trataria como estado remoto: resource ou RxJS para a sincronização, com o service continuando como fachada.',
    ],
  },
  'en-us': {
    title: 'State shared across pages',
    summary:
      'The cart counter in the header and the list on the checkout page.',
    problem:
      'The header shows how many items are in the cart, and the checkout page shows and edits the same items. The two must always agree.',
    question: {
      prompt: 'Where should this state live?',
      suggestedId: 'service',
      options: [
        {
          id: 'service',
          label: 'A service with signals',
          answer:
            'The state sits in one place, the header and checkout read the same signals, and mutations go through named methods. No library, no boilerplate, easy to test.',
        },
        {
          id: 'ngrx',
          label: 'NgRx Store or SignalStore',
          answer:
            'It also solves it, and it is the right pick when the problem grows (see the Architecture tab). For a cart with few producers and consumers, it is more structure than the problem asks for.',
        },
        {
          id: 'inputs',
          label: 'Inputs and outputs through the parent',
          answer:
            'It works while the two components are neighbors. When header and checkout live in distant branches of the tree or on different routes, you pass state through components that do not even use it.',
        },
      ],
    },
    demo: {
      headerLabel: 'Site header',
      cartCount: 'Items in the cart',
      catalogTab: 'Catalog',
      checkoutTab: 'Checkout',
      pages: 'Example pages',
      add: 'Add',
      remove: 'Remove',
      empty: 'The cart is empty.',
      total: 'Total',
      hint: 'Add items in the catalog and switch to checkout: the header and the page read the same state.',
      eventAdded: 'Added',
      eventRemoved: 'Removed',
      units: 'Units',
      lines: 'Lines',
      products: PRODUCTS,
    },
    snippets: [{ id: 'shared-store', label: 'The cart store' }],
    why: [
      'Shared state needs a single source of truth that survives page changes. A service with a private signal and public read-only signals gives that: only the service changes the state, and readers use count and total, derived with computed().',
      'Because the service is a singleton of the scope where it is provided, the header and checkout share the same instance. Mutations have names (add, remove), which keeps the flow readable and testable.',
    ],
    alternatives: [
      {
        name: 'NgRx Store / SignalStore',
        text: 'Brings strict conventions, devtools and chained effects. Worth it when those benefits pay for the cost.',
      },
      {
        name: 'Inputs and outputs',
        text: 'Great for parent-child communication. Poor for state that crosses the tree.',
      },
    ],
    differently: [
      'I would move to NgRx Store or SignalStore when: many producers and consumers share the same state; side effects chain together (syncing with the API, invalidating cache, reacting to other actions); I need devtools and time-travel to debug; or a large team needs strict conventions to avoid drifting apart.',
      'If the cart had to persist on the server and sync across tabs, I would treat it as remote state: a resource or RxJS for the sync, with the service staying as the facade.',
    ],
  },
};
