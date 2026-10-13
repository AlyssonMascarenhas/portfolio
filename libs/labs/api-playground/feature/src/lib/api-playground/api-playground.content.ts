import { LabOrderScenario } from '@portfolio/contracts';
import { ErrorKind } from '@portfolio/labs/api-playground/data-access';
import { LocalizedScenario } from '@portfolio/lab-kit';

export interface KindText {
  /** Título do banner de erro. */
  title: string;
  /** O que a pessoa pode fazer. */
  hint: string;
}

export interface ApiPlaygroundDemoText {
  scenarioLegend: string;
  scenarios: Record<LabOrderScenario, string>;
  idempotencyKey: string;
  idempotencyHint: string;
  send: string;
  sending: string;
  retry: string;
  hint: string;
  pipelineTitle: string;
  stepRequest: string;
  stepInterceptors: string;
  stepMapper: string;
  stepDomainError: string;
  stepUi: string;
  attempts: string;
  noMapping: string;
  uiSuccess: string;
  successMessage: string;
  correlationId: string;
  metricAttempts: string;
  metricResult: string;
  resultSuccess: string;
  fields: Record<string, string>;
  fieldCodes: Record<string, string>;
  fieldUnknown: string;
  kinds: Record<ErrorKind, KindText>;
}

export const API_PLAYGROUND_CONTENT: LocalizedScenario<ApiPlaygroundDemoText> =
  {
    'pt-br': {
      title: 'API Playground',
      summary:
        'Uma chamada HTTP que falha de onze jeitos diferentes, e como cada um chega à tela.',
      problem:
        'Criar um pedido pode dar certo, ser recusado por validação, expirar a sessão, cair no servidor ou nem sair da máquina. A tela não deveria saber nada de status HTTP.',
      question: {
        prompt: 'Onde você trataria os erros de HTTP?',
        suggestedId: 'centralized',
        options: [
          {
            id: 'centralized',
            label: 'Na fronteira: interceptors e um mapper para DomainError',
            answer:
              'Um único lugar conhece HTTP (status, corpo, timeout) e entrega à aplicação erros de domínio. Retry, timeout e logging ficam fora dos componentes, e a UI reage a "conflito" ou "sessão expirada", não a 409 ou 401.',
          },
          {
            id: 'component',
            label: 'Em cada componente, no subscribe/catchError',
            answer:
              'Funciona para uma tela. Com dez, cada uma interpreta o status do seu jeito, o retry é reinventado e a mensagem de "sessão expirada" aparece em três versões. O custo cresce com o número de telas.',
          },
          {
            id: 'global',
            label: 'Só um ErrorHandler global',
            answer:
              'É a rede de proteção certa para o inesperado, mas chega tarde: já perdeu o contexto da chamada. Serve como última camada, não como estratégia principal.',
          },
        ],
      },
      demo: {
        scenarioLegend: 'Escolha o que a API vai responder',
        scenarios: {
          ok: '201 Criado',
          'bad-request': '400 Requisição inválida',
          unauthorized: '401 Não autenticado',
          forbidden: '403 Sem permissão',
          'not-found': '404 Não encontrado',
          conflict: '409 Conflito',
          validation: '422 Validação',
          server: '500 Erro do servidor',
          timeout: 'Timeout (a API não responde)',
          offline: 'Offline (sem rede)',
          flaky: 'Instável (503, 503, depois 201)',
        },
        idempotencyKey: 'Enviar Idempotency-Key',
        idempotencyHint:
          'Com a chave, o POST pode ser repetido sem duplicar o pedido. Desligue e rode o cenário "Instável" para ver a diferença.',
        send: 'Enviar pedido',
        sending: 'Enviando…',
        retry: 'Tentar de novo',
        hint: 'A chamada é real: passa pelo HttpClient e pelos interceptors; só o servidor é um mock (MSW).',
        pipelineTitle: 'O caminho da chamada',
        stepRequest: 'Requisição',
        stepInterceptors: 'Interceptors (timeout, trace, retry)',
        stepMapper: 'Error mapper',
        stepDomainError: 'DomainError',
        stepUi: 'Interface',
        attempts: '{n} tentativa(s)',
        noMapping: 'sem erro para mapear',
        uiSuccess: 'confirmação do pedido',
        successMessage: 'Pedido {id} criado.',
        correlationId: 'Código para o suporte',
        metricAttempts: 'Tentativas',
        metricResult: 'Resultado',
        resultSuccess: 'sucesso',
        fields: { email: 'E-mail', quantity: 'Quantidade' },
        fieldCodes: {
          invalid_email: 'Informe um e-mail válido.',
          min_1: 'A quantidade mínima é 1.',
        },
        fieldUnknown: 'Valor inválido.',
        kinds: {
          'bad-request': {
            title: 'Não foi possível enviar o pedido',
            hint: 'Algo saiu errado na requisição. Isso é um defeito nosso, não seu.',
          },
          unauthorized: {
            title: 'Sua sessão expirou',
            hint: 'Entre novamente para continuar. O pedido não foi perdido.',
          },
          forbidden: {
            title: 'Você não tem permissão para isto',
            hint: 'Peça acesso a quem administra a conta.',
          },
          'not-found': {
            title: 'Não encontramos o cadastro',
            hint: 'Confira os dados do cliente e tente de novo.',
          },
          conflict: {
            title: 'Este pedido já existe',
            hint: 'Parece que ele foi enviado antes. Confira seus pedidos antes de repetir.',
          },
          validation: {
            title: 'Corrija os campos abaixo',
            hint: 'Nenhum dado foi salvo.',
          },
          server: {
            title: 'O servidor falhou',
            hint: 'Já tentamos de novo quando era seguro. Tente mais tarde.',
          },
          timeout: {
            title: 'A resposta demorou demais',
            hint: 'Tentamos de novo e não houve resposta. Tente novamente em instantes.',
          },
          offline: {
            title: 'Sem conexão',
            hint: 'Confira sua internet e tente de novo.',
          },
          unknown: {
            title: 'Algo inesperado aconteceu',
            hint: 'Tente de novo. Se continuar, fale com o suporte.',
          },
        },
      },
      snippets: [
        {
          id: 'api-send-pipeline',
          label: 'Da tela à API: o pipeline de envio',
        },
        {
          id: 'api-interceptor-chain',
          label: 'A cadeia de interceptors (e a ordem importa)',
        },
        {
          id: 'api-interceptors',
          label: 'Timeout, retry com backoff e mapeamento',
        },
        {
          id: 'api-error-mapper',
          label: 'O error mapper: HttpErrorResponse vira DomainError',
        },
      ],
      why: [
        'A fronteira com a rede é o único lugar que deveria conhecer status HTTP. O mapper converte tudo em um DomainError com um "tipo" (conflito, sessão expirada, validação...) e a tela decide o que mostrar a partir disso. Trocar a API não muda nenhuma tela.',
        'A ordem dos interceptors é uma decisão: o timeout vale por tentativa, o retry vê o erro bruto de cada uma, e o mapper roda por último, uma única vez, sobre a falha final. Se o mapper rodasse antes do retry, o retry não saberia mais que era um 503.',
        'Retry só para falha transitória (rede, 502/503/504, timeout) e só quando repetir é seguro: GET, ou POST com Idempotency-Key. Repetir um POST sem a chave pode criar o pedido duas vezes. O 500 não é repetido: normalmente é um bug, e repetir só piora.',
        'O HttpClient com esses interceptors é provido nas rotas do lab, não na raiz. Os interceptors não afetam o resto do site, e o lab continua isolado.',
      ],
      alternatives: [
        {
          name: 'Tratar no componente',
          text: 'Simples no começo, divergente depois. Dá para manter só se houver poucas telas e um time pequeno.',
        },
        {
          name: 'ErrorHandler global',
          text: 'Ótimo como última camada (logar o inesperado, mostrar uma tela genérica). Ruim como estratégia: não sabe qual chamada falhou nem o que o usuário queria fazer.',
        },
        {
          name: 'Interceptor baseado em classe (DI)',
          text: 'Funciona, mas interceptors funcionais compõem melhor, são mais fáceis de testar e dispensam a classe.',
        },
      ],
      differently: [
        'Para 401 com refresh token, o interceptor precisaria renovar a sessão uma vez e enfileirar as chamadas concorrentes; o cenário aqui só mostra a mensagem.',
        'Em produção eu somaria jitter ao backoff (para não sincronizar clientes), respeitaria o header Retry-After e consideraria um circuit breaker se a API sofrer degradação prolongada.',
        'O correlationId do 500 deveria ir para a ferramenta de observabilidade (por exemplo, Sentry) junto com o contexto da tela; aqui ele só é mostrado.',
        'Para leituras (GET) que alimentam a tela, o httpResource passa pelos mesmos interceptors e dá loading e erro prontos; aqui o foco é a escrita.',
      ],
    },
    'en-us': {
      title: 'API Playground',
      summary:
        'One HTTP call that fails in eleven different ways, and how each reaches the screen.',
      problem:
        'Creating an order can succeed, be rejected by validation, expire the session, hit a server failure or never leave the machine. The screen should know nothing about HTTP status codes.',
      question: {
        prompt: 'Where would you handle HTTP errors?',
        suggestedId: 'centralized',
        options: [
          {
            id: 'centralized',
            label: 'At the boundary: interceptors and a mapper to DomainError',
            answer:
              'A single place knows HTTP (status, body, timeout) and hands the app domain errors. Retry, timeout and logging live outside components, and the UI reacts to "conflict" or "session expired", not to 409 or 401.',
          },
          {
            id: 'component',
            label: 'In each component, in subscribe/catchError',
            answer:
              'It works for one screen. With ten, each interprets status its own way, retry gets reinvented and the "session expired" message shows up in three versions. The cost grows with the number of screens.',
          },
          {
            id: 'global',
            label: 'Only a global ErrorHandler',
            answer:
              'It is the right safety net for the unexpected, but it arrives late: the context of the call is already lost. It works as the last layer, not as the main strategy.',
          },
        ],
      },
      demo: {
        scenarioLegend: 'Choose what the API will answer',
        scenarios: {
          ok: '201 Created',
          'bad-request': '400 Bad request',
          unauthorized: '401 Unauthorized',
          forbidden: '403 Forbidden',
          'not-found': '404 Not found',
          conflict: '409 Conflict',
          validation: '422 Validation',
          server: '500 Server error',
          timeout: 'Timeout (the API never answers)',
          offline: 'Offline (no network)',
          flaky: 'Flaky (503, 503, then 201)',
        },
        idempotencyKey: 'Send Idempotency-Key',
        idempotencyHint:
          'With the key, the POST can be repeated without duplicating the order. Turn it off and run the "Flaky" scenario to see the difference.',
        send: 'Send order',
        sending: 'Sending…',
        retry: 'Try again',
        hint: 'The call is real: it goes through HttpClient and the interceptors; only the server is a mock (MSW).',
        pipelineTitle: 'The path of the call',
        stepRequest: 'Request',
        stepInterceptors: 'Interceptors (timeout, trace, retry)',
        stepMapper: 'Error mapper',
        stepDomainError: 'DomainError',
        stepUi: 'UI',
        attempts: '{n} attempt(s)',
        noMapping: 'no error to map',
        uiSuccess: 'order confirmation',
        successMessage: 'Order {id} created.',
        correlationId: 'Support code',
        metricAttempts: 'Attempts',
        metricResult: 'Result',
        resultSuccess: 'success',
        fields: { email: 'Email', quantity: 'Quantity' },
        fieldCodes: {
          invalid_email: 'Enter a valid email.',
          min_1: 'The minimum quantity is 1.',
        },
        fieldUnknown: 'Invalid value.',
        kinds: {
          'bad-request': {
            title: 'The order could not be sent',
            hint: 'Something went wrong with the request. That is our bug, not yours.',
          },
          unauthorized: {
            title: 'Your session expired',
            hint: 'Sign in again to continue. Your order was not lost.',
          },
          forbidden: {
            title: 'You do not have permission for this',
            hint: 'Ask whoever manages the account for access.',
          },
          'not-found': {
            title: 'We could not find the account',
            hint: 'Check the customer details and try again.',
          },
          conflict: {
            title: 'This order already exists',
            hint: 'It looks like it was sent before. Check your orders before repeating.',
          },
          validation: {
            title: 'Fix the fields below',
            hint: 'Nothing was saved.',
          },
          server: {
            title: 'The server failed',
            hint: 'We already retried where it was safe. Try again later.',
          },
          timeout: {
            title: 'The response took too long',
            hint: 'We retried and got no answer. Try again in a moment.',
          },
          offline: {
            title: 'No connection',
            hint: 'Check your internet and try again.',
          },
          unknown: {
            title: 'Something unexpected happened',
            hint: 'Try again. If it keeps happening, contact support.',
          },
        },
      },
      snippets: [
        {
          id: 'api-send-pipeline',
          label: 'From the screen to the API: the send pipeline',
        },
        {
          id: 'api-interceptor-chain',
          label: 'The interceptor chain (order matters)',
        },
        {
          id: 'api-interceptors',
          label: 'Timeout, retry with backoff and mapping',
        },
        {
          id: 'api-error-mapper',
          label: 'The error mapper: HttpErrorResponse becomes DomainError',
        },
      ],
      why: [
        'The network boundary is the only place that should know HTTP status codes. The mapper turns everything into a DomainError with a "kind" (conflict, session expired, validation...) and the screen decides what to show from that. Swapping the API changes no screen.',
        'Interceptor order is a decision: the timeout applies per attempt, retry sees the raw error of each one, and the mapper runs last, once, on the final failure. If the mapper ran before retry, retry would no longer know it was a 503.',
        'Retry only for transient failures (network, 502/503/504, timeout) and only when repeating is safe: GET, or POST with an Idempotency-Key. Repeating a POST without the key can create the order twice. 500 is not retried: it is usually a bug, and repeating only makes it worse.',
        'The HttpClient with these interceptors is provided in the lab routes, not at the root. The interceptors do not affect the rest of the site, and the lab stays isolated.',
      ],
      alternatives: [
        {
          name: 'Handling it in the component',
          text: 'Simple at first, divergent later. Only sustainable with few screens and a small team.',
        },
        {
          name: 'Global ErrorHandler',
          text: 'Great as a last layer (log the unexpected, show a generic screen). Poor as a strategy: it does not know which call failed or what the user was trying to do.',
        },
        {
          name: 'Class-based (DI) interceptor',
          text: 'Works, but functional interceptors compose better, are easier to test and need no class.',
        },
      ],
      differently: [
        'For a 401 with a refresh token, the interceptor would need to renew the session once and queue concurrent calls; here the scenario only shows the message.',
        'In production I would add jitter to the backoff (to avoid synchronizing clients), honor the Retry-After header and consider a circuit breaker if the API degrades for long.',
        'The 500 correlationId should go to the observability tool (for example, Sentry) along with the screen context; here it is only displayed.',
        'For reads (GET) that feed the screen, httpResource goes through the same interceptors and gives loading and error states for free; the focus here is writes.',
      ],
    },
  };
