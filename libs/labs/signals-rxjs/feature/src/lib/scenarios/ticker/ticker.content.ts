import { LocalizedScenario } from '@portfolio/lab-kit';

export interface TickerDemoText {
  price: string;
  destroy: string;
  recreate: string;
  destroyed: string;
  activeSubscriptions: string;
  emissions: string;
  hint: string;
}

export const TICKER_CONTENT: LocalizedScenario<TickerDemoText> = {
  'pt-br': {
    title: 'Fluxo contínuo',
    summary: 'Um ticker de preços simulado, como se viesse de um WebSocket.',
    problem:
      'Um preço que se atualiza a cada segundo, vindo de um fluxo sem fim. Ele precisa parar de consumir recursos quando o componente sai da tela.',
    question: {
      prompt: 'Como você modelaria o feed de preços?',
      suggestedId: 'rxjs',
      options: [
        {
          id: 'rxjs',
          label: 'Observable para o fluxo, toSignal só na borda',
          answer:
            'O fluxo continua em RxJS, que sabe de assinatura, cancelamento e composição. Na borda com o template, toSignal entrega o último valor e encerra a assinatura sozinho quando o componente é destruído.',
        },
        {
          id: 'signal',
          label: 'signal() atualizado por um callback',
          answer:
            'Dá para ligar o callback do socket a um signal.set(). Mas você perde assinatura, retry, buffer e composição, e passa a cuidar do cleanup à mão (desligar o listener no onDestroy).',
        },
        {
          id: 'subscribe',
          label: 'subscribe() manual e uma propriedade',
          answer:
            'É o padrão antigo: funciona até alguém esquecer o unsubscribe. A assinatura vaza, o componente destruído continua consumindo, e o bug aparece como lentidão semanas depois.',
        },
      ],
    },
    demo: {
      price: 'Preço',
      destroy: 'Destruir o componente',
      recreate: 'Criar o componente de novo',
      destroyed: 'O componente foi destruído e a assinatura encerrada.',
      activeSubscriptions: 'Assinaturas ativas',
      emissions: 'Valores emitidos',
      hint: 'Destrua o componente: as assinaturas ativas caem para 0 e as emissões param de crescer.',
    },
    snippets: [
      { id: 'ticker-stream', label: 'O fluxo (RxJS)' },
      { id: 'ticker-edge', label: 'A borda com o template (toSignal)' },
    ],
    why: [
      'Um feed contínuo é a definição de "coisas que acontecem ao longo do tempo". RxJS modela isso com precisão: o fluxo é frio, começa a emitir quando alguém assina e termina quando a assinatura é encerrada.',
      'O toSignal fica só na borda, para o template ler o valor atual sem async pipe. Como ele é criado no componente, a assinatura é atada ao ciclo de vida: quando o componente é destruído, o Angular cancela a inscrição. O contador de assinaturas ativas prova isso.',
    ],
    alternatives: [
      {
        name: 'async pipe',
        text: 'Também encerra a assinatura sozinho. Continua sendo ótimo quando o template só consome um Observable, sem precisar de um signal.',
      },
      {
        name: 'takeUntilDestroyed + subscribe',
        text: 'A saída segura quando você precisa mesmo de um subscribe (efeito colateral). Sem ele, o cleanup é manual.',
      },
    ],
    differently: [
      'Se vários componentes consumirem o mesmo feed, o fluxo frio abriria uma conexão por assinante. Aí eu compartilharia com shareReplay({ bufferSize: 1, refCount: true }) em um service.',
      'Se só o último valor importasse e o dado fosse global (como o preço em vários lugares), um service que expõe um signal alimentado pelo stream simplificaria o consumo.',
    ],
  },
  'en-us': {
    title: 'Continuous stream',
    summary: 'A simulated price ticker, as if it came from a WebSocket.',
    problem:
      'A price that updates every second, coming from an endless stream. It must stop consuming resources when the component leaves the screen.',
    question: {
      prompt: 'How would you model the price feed?',
      suggestedId: 'rxjs',
      options: [
        {
          id: 'rxjs',
          label: 'An Observable for the stream, toSignal only at the edge',
          answer:
            'The stream stays in RxJS, which knows about subscription, cancellation and composition. At the template edge, toSignal delivers the latest value and ends the subscription by itself when the component is destroyed.',
        },
        {
          id: 'signal',
          label: 'A signal() updated by a callback',
          answer:
            'You can wire the socket callback to signal.set(). But you lose subscription, retry, buffering and composition, and you take over cleanup by hand (removing the listener in onDestroy).',
        },
        {
          id: 'subscribe',
          label: 'A manual subscribe() and a property',
          answer:
            'The old pattern: it works until someone forgets the unsubscribe. The subscription leaks, the destroyed component keeps consuming, and the bug shows up as slowness weeks later.',
        },
      ],
    },
    demo: {
      price: 'Price',
      destroy: 'Destroy the component',
      recreate: 'Create the component again',
      destroyed: 'The component was destroyed and the subscription ended.',
      activeSubscriptions: 'Active subscriptions',
      emissions: 'Values emitted',
      hint: 'Destroy the component: active subscriptions drop to 0 and emissions stop growing.',
    },
    snippets: [
      { id: 'ticker-stream', label: 'The stream (RxJS)' },
      { id: 'ticker-edge', label: 'The template edge (toSignal)' },
    ],
    why: [
      'A continuous feed is the definition of "things that happen over time". RxJS models that precisely: the stream is cold, starts emitting when someone subscribes and ends when the subscription ends.',
      'toSignal stays only at the edge, so the template reads the current value without the async pipe. Because it is created in the component, the subscription is tied to its lifecycle: when the component is destroyed, Angular unsubscribes. The active subscriptions counter is the proof.',
    ],
    alternatives: [
      {
        name: 'async pipe',
        text: 'It also ends the subscription by itself. Still great when the template only consumes an Observable and does not need a signal.',
      },
      {
        name: 'takeUntilDestroyed + subscribe',
        text: 'The safe way out when you really need a subscribe (a side effect). Without it, cleanup is manual.',
      },
    ],
    differently: [
      'If several components consume the same feed, the cold stream would open one connection per subscriber. Then I would share it with shareReplay({ bufferSize: 1, refCount: true }) in a service.',
      'If only the latest value mattered and the data were global (like a price shown in many places), a service exposing a signal fed by the stream would simplify consumption.',
    ],
  },
};
