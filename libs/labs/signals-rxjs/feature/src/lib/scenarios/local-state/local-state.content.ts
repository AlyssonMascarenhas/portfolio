import { LocalizedScenario } from '@portfolio/lab-kit';

export interface LocalStateDemoText {
  toggle: string;
  panel: string;
  currentValue: string;
}

export const LOCAL_STATE_CONTENT: LocalizedScenario<LocalStateDemoText> = {
  'pt-br': {
    title: 'Estado local de UI',
    summary:
      'Um painel que abre e fecha: o estado vive e morre com o componente.',
    problem:
      'Um painel de detalhes abre e fecha. Só o próprio componente se importa com esse estado.',
    question: {
      prompt: 'Onde você guardaria o "aberto/fechado"?',
      suggestedId: 'signal',
      options: [
        {
          id: 'signal',
          label: 'signal() no componente',
          answer:
            'Uma linha para declarar, um update() para alternar, e o template lê direto. Sem subscription, sem async pipe, sem cleanup.',
        },
        {
          id: 'behavior-subject',
          label: 'BehaviorSubject no componente',
          answer:
            'Funciona e é familiar para quem vem de versões antigas. Mas pede async pipe (ou subscription manual) para ler, e o valor atual só sai por .value. É cerimônia sem ganho para um booleano local.',
        },
        {
          id: 'ngrx',
          label: 'Store (NgRx)',
          answer:
            'Funciona, mas exige action, reducer e selector para um estado que nenhum outro componente observa. Você paga o custo de previsibilidade global sem receber o benefício.',
        },
      ],
    },
    demo: {
      toggle: 'Detalhes do pedido',
      panel: 'Este conteúdo só existe enquanto o estado for "aberto".',
      currentValue: 'Valor do signal isOpen()',
    },
    snippets: [
      { id: 'local-state', label: 'O que roda na demo: signal()' },
      {
        id: 'local-state-rxjs',
        label: 'Para comparar: o mesmo estado com BehaviorSubject',
      },
    ],
    why: [
      'O estado é local, síncrono e tem sempre um valor atual. É exatamente o que um signal modela. O template lê isOpen() e o Angular atualiza só o que depende dele.',
      'A regra prática: se o dado "existe agora" e só este componente o usa, comece com signal(). Suba o nível de ferramenta quando surgir uma necessidade real.',
    ],
    alternatives: [
      {
        name: 'BehaviorSubject',
        text: 'Serve, mas modela um fluxo de valores ao longo do tempo. Aqui não há fluxo, só um valor. Você acaba exportando um Observable e lendo o valor atual por .value.',
      },
      {
        name: 'NgRx Store',
        text: 'Ótimo para estado compartilhado e auditável. Para um booleano de UI, o boilerplate supera o problema.',
      },
    ],
    differently: [
      'Se o "aberto/fechado" precisar sobreviver a navegação ou ser controlado por outra tela (ex.: abrir o painel via deep link), ele deixa de ser local: promova para um service com signals ou para a URL.',
      'Se houver um fluxo de eventos em volta (fechar após timeout, fechar ao clicar fora com debounce), esse comportamento é RxJS; o booleano continua sendo signal.',
    ],
  },
  'en-us': {
    title: 'Local UI state',
    summary:
      'A panel that opens and closes: the state lives and dies with the component.',
    problem:
      'A details panel opens and closes. Only the component itself cares about this state.',
    question: {
      prompt: 'Where would you keep the "open/closed" flag?',
      suggestedId: 'signal',
      options: [
        {
          id: 'signal',
          label: 'signal() in the component',
          answer:
            'One line to declare, one update() to toggle, and the template reads it directly. No subscription, no async pipe, no cleanup.',
        },
        {
          id: 'behavior-subject',
          label: 'BehaviorSubject in the component',
          answer:
            'It works and feels familiar if you come from older versions. But reading it needs the async pipe (or a manual subscription), and the current value only comes out via .value. That is ceremony with no payoff for a local boolean.',
        },
        {
          id: 'ngrx',
          label: 'Store (NgRx)',
          answer:
            'It works, but needs an action, a reducer and a selector for state no other component observes. You pay the cost of global predictability without getting the benefit.',
        },
      ],
    },
    demo: {
      toggle: 'Order details',
      panel: 'This content only exists while the state is "open".',
      currentValue: 'Value of the isOpen() signal',
    },
    snippets: [
      { id: 'local-state', label: 'What runs in the demo: signal()' },
      {
        id: 'local-state-rxjs',
        label: 'For comparison: the same state with BehaviorSubject',
      },
    ],
    why: [
      'The state is local, synchronous, and always has a current value. That is exactly what a signal models. The template reads isOpen() and Angular updates only what depends on it.',
      'Rule of thumb: if the data "exists right now" and only this component uses it, start with signal(). Move up to a heavier tool when a real need shows up.',
    ],
    alternatives: [
      {
        name: 'BehaviorSubject',
        text: 'It works, but it models a stream of values over time. Here there is no stream, just one value. You end up exposing an Observable and reading the current value through .value.',
      },
      {
        name: 'NgRx Store',
        text: 'Great for shared, auditable state. For a UI boolean, the boilerplate outweighs the problem.',
      },
    ],
    differently: [
      'If "open/closed" must survive navigation or be driven from another screen (e.g. opening the panel via deep link), it stops being local: promote it to a service with signals, or to the URL.',
      'If there is an event flow around it (close after a timeout, close on outside click with debounce), that behavior is RxJS; the boolean itself stays a signal.',
    ],
  },
};
