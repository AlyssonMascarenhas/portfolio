import { LocalizedScenario } from '@portfolio/lab-kit';

export interface DerivedStateDemoText {
  price: string;
  quantity: string;
  discount: string;
  note: string;
  subtotal: string;
  discountAmount: string;
  total: string;
  hint: string;
  recalcSubtotal: string;
  recalcDiscount: string;
  recalcTotal: string;
}

export const DERIVED_STATE_CONTENT: LocalizedScenario<DerivedStateDemoText> = {
  'pt-br': {
    title: 'Estado derivado',
    summary:
      'Subtotal, desconto e total de um carrinho calculados a partir de outros valores.',
    problem:
      'O total do carrinho depende de preço, quantidade e desconto. Ele nunca deve ficar fora de sincronia com eles.',
    question: {
      prompt: 'Como você calcularia o total?',
      suggestedId: 'computed',
      options: [
        {
          id: 'computed',
          label: 'computed() sobre signals',
          answer:
            'O total é uma função dos valores de entrada, sem estado próprio para sincronizar. É preguiçoso e memoizado: só recalcula se algo de que depende mudou.',
        },
        {
          id: 'combine-latest',
          label: 'combineLatest + map',
          answer:
            'Funciona e é a resposta clássica. O custo: cada entrada vira um subject, há subscription (ou async pipe) para ler, e o cálculo roda a cada emissão, mesmo quando o valor não mudou.',
        },
        {
          id: 'method',
          label: 'Método chamado no template',
          answer:
            'Parece simples, mas recalcula em toda detecção de mudanças e não tem memoização. Em listas grandes vira problema de performance.',
        },
      ],
    },
    demo: {
      price: 'Preço unitário',
      quantity: 'Quantidade',
      discount: 'Desconto (%)',
      note: 'Observação (não entra no cálculo)',
      subtotal: 'Subtotal',
      discountAmount: 'Desconto',
      total: 'Total',
      hint: 'Edite a observação e veja que nenhum contador sobe. Mude o desconto e veja que o subtotal não recalcula.',
      recalcSubtotal: 'Recálculos do subtotal',
      recalcDiscount: 'Recálculos do desconto',
      recalcTotal: 'Recálculos do total',
    },
    snippets: [
      { id: 'derived-state', label: 'O que roda na demo: computed()' },
      {
        id: 'derived-state-rxjs',
        label: 'Para comparar: combineLatest + map',
      },
    ],
    why: [
      'Estado derivado é uma função de outros estados. Com computed() a dependência é rastreada automaticamente: o Angular sabe que total depende de subtotal e desconto, e que a observação não tem nada a ver com isso.',
      'O painel mostra a evidência: o computed é preguiçoso (só roda quando alguém lê) e memoizado (só recalcula se uma dependência mudou). Mudar o desconto não refaz o subtotal.',
    ],
    alternatives: [
      {
        name: 'combineLatest + map',
        text: 'Equivalente em resultado, mas imperativo na montagem: você lista as dependências à mão, gerencia a subscription e perde a memoização entre emissões iguais.',
      },
      {
        name: 'Método no template',
        text: 'Sem cache, roda a cada ciclo de detecção. O projeto evita isso: derive um view model com computed().',
      },
    ],
    differently: [
      'Se as entradas já forem streams (ex.: valores chegando por WebSocket), manter o cálculo em RxJS e converter com toSignal na borda é mais natural.',
      'Se o cálculo for caro e depender de dados remotos, ele deixa de ser só derivado: entra HTTP, e a ferramenta passa a ser resource ou RxJS.',
    ],
  },
  'en-us': {
    title: 'Derived state',
    summary:
      'Subtotal, discount and total of a cart computed from other values.',
    problem:
      'The cart total depends on price, quantity and discount. It must never get out of sync with them.',
    question: {
      prompt: 'How would you compute the total?',
      suggestedId: 'computed',
      options: [
        {
          id: 'computed',
          label: 'computed() over signals',
          answer:
            'The total is a function of the inputs, with no state of its own to keep in sync. It is lazy and memoized: it only recomputes if something it depends on changed.',
        },
        {
          id: 'combine-latest',
          label: 'combineLatest + map',
          answer:
            'It works and is the classic answer. The cost: each input becomes a subject, reading needs a subscription (or async pipe), and the calculation runs on every emission, even when the value did not change.',
        },
        {
          id: 'method',
          label: 'A method called in the template',
          answer:
            'It looks simple, but it recomputes on every change detection pass and has no memoization. On large lists it becomes a performance problem.',
        },
      ],
    },
    demo: {
      price: 'Unit price',
      quantity: 'Quantity',
      discount: 'Discount (%)',
      note: 'Note (not part of the calculation)',
      subtotal: 'Subtotal',
      discountAmount: 'Discount',
      total: 'Total',
      hint: 'Edit the note and watch no counter move. Change the discount and see that the subtotal does not recompute.',
      recalcSubtotal: 'Subtotal recalculations',
      recalcDiscount: 'Discount recalculations',
      recalcTotal: 'Total recalculations',
    },
    snippets: [
      { id: 'derived-state', label: 'What runs in the demo: computed()' },
      {
        id: 'derived-state-rxjs',
        label: 'For comparison: combineLatest + map',
      },
    ],
    why: [
      'Derived state is a function of other state. With computed() the dependencies are tracked automatically: Angular knows total depends on subtotal and discount, and that the note has nothing to do with it.',
      'The panel is the evidence: computed is lazy (it only runs when someone reads it) and memoized (it only recomputes when a dependency changed). Changing the discount does not redo the subtotal.',
    ],
    alternatives: [
      {
        name: 'combineLatest + map',
        text: 'Same result, but imperative to assemble: you list the dependencies by hand, manage the subscription and lose memoization across equal emissions.',
      },
      {
        name: 'Method in the template',
        text: 'No cache, it runs on every change detection cycle. This project avoids that: derive a view model with computed().',
      },
    ],
    differently: [
      'If the inputs are already streams (e.g. values arriving over a WebSocket), keeping the calculation in RxJS and converting with toSignal at the edge is more natural.',
      'If the calculation is expensive and depends on remote data, it is no longer just derived: HTTP enters the picture, and the tool becomes resource or RxJS.',
    ],
  },
};
