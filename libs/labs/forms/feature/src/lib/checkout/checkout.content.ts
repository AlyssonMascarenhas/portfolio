import { LocalizedScenario } from '@portfolio/lab-kit';

export interface CheckoutDemoText {
  name: string;
  email: string;
  confirmEmail: string;
  quantity: string;
  coupon: string;
  couponHint: string;
  submit: string;
  submitting: string;
  /** Usa {id}. */
  success: string;
  hint: string;
  /** Mensagem por tipo de erro (kind). */
  messages: Record<string, string>;
  fieldStates: string;
  touched: string;
  dirty: string;
  valid: string;
  invalid: string;
  pending: string;
  metricCouponChecks: string;
  metricSubmits: string;
}

export const CHECKOUT_CONTENT: LocalizedScenario<CheckoutDemoText> = {
  'pt-br': {
    title: 'Formulário de checkout',
    summary:
      'Validação síncrona, entre campos e assíncrona (cupom), com Signal Forms e o equivalente em Reactive Forms.',
    problem:
      'Um checkout valida nome e e-mail, confere a confirmação do e-mail, limita a quantidade, consulta o cupom no servidor e aceita a recusa do servidor por campo. Tudo precisa ser acessível e só mostrar erro depois que a pessoa mexeu no campo.',
    question: {
      prompt: 'Que API de formulários você usaria num formulário novo?',
      suggestedId: 'signal',
      options: [
        {
          id: 'signal',
          label: 'Signal Forms (@angular/forms/signals)',
          answer:
            'O modelo é um signal, as regras ficam num schema ao lado dele e o estado de cada campo (tocado, sujo, inválido, pendente) já é um signal. É estável no Angular 22 e dispensa subscriptions. Para formulário novo é o ponto de partida.',
        },
        {
          id: 'reactive',
          label: 'Reactive Forms (FormGroup e FormControl)',
          answer:
            'Continua sendo a escolha certa em código existente e quando você depende de bibliotecas de componentes que só falam ControlValueAccessor. O custo é converter estado em signals na mão (toSignal sobre statusChanges) para usá-lo no template moderno.',
        },
        {
          id: 'template',
          label: 'Template-driven (ngModel)',
          answer:
            'Serve para um campo ou dois, sem regras. Com validação entre campos e assíncrona, as regras se espalham pelo template e ficam difíceis de testar. Evito para qualquer formulário que tenha regra de negócio.',
        },
      ],
    },
    demo: {
      name: 'Nome',
      email: 'E-mail',
      confirmEmail: 'Confirme o e-mail',
      quantity: 'Quantidade (1 a 10)',
      coupon: 'Cupom (opcional)',
      couponHint:
        'Tente PROMO10 (válido). A consulta ao servidor espera 400 ms depois da última tecla. O e-mail taken@example.com é recusado pelo servidor no envio.',
      submit: 'Finalizar pedido',
      submitting: 'Enviando…',
      success: 'Pedido {id} criado.',
      hint: 'Os erros só aparecem depois que você sai do campo (ou tenta enviar), e ao enviar com erro o foco vai para o primeiro campo inválido.',
      messages: {
        required: 'Este campo é obrigatório.',
        minLength: 'Use pelo menos 3 caracteres.',
        email: 'Informe um e-mail válido.',
        emailsDiffer: 'Os e-mails não são iguais.',
        min: 'A quantidade mínima é 1.',
        max: 'A quantidade máxima é 10.',
        parse: 'Informe um número.',
        couponInvalid: 'Cupom inválido.',
        couponUnavailable: 'Não foi possível validar o cupom agora.',
        emailTaken: 'Este e-mail já tem cadastro.',
        submitFailed: 'Não foi possível enviar o pedido. Tente de novo.',
        invalid: 'Valor inválido.',
      },
      fieldStates: 'Estado de cada campo',
      touched: 'tocado',
      dirty: 'alterado',
      valid: 'válido',
      invalid: 'inválido',
      pending: 'validando',
      metricCouponChecks: 'Consultas de cupom ao servidor',
      metricSubmits: 'Envios',
    },
    snippets: [
      {
        id: 'forms-signal-form',
        label:
          'Signal Forms: o modelo e o schema de validação (o que roda na demo)',
      },
      {
        id: 'forms-reactive-form',
        label: 'Reactive Forms: o mesmo formulário, para comparar',
      },
    ],
    why: [
      'No Signal Forms o formulário é só dados e regras: um signal com o modelo e uma função de schema com required, minLength, email, min e max. Regras entre campos (a confirmação do e-mail) leem o valor de outro campo no mesmo schema, e a validação assíncrona do cupom é uma regra como as outras, com o resultado mapeado para um tipo de erro.',
      'O estado de cada campo é um signal. O painel de instrumentação lê touched, dirty, valid e pending direto, sem subscription. O debounce de 400 ms no cupom reduz as consultas ao servidor: digitar "PROMO10" dispara uma consulta, não sete.',
      'Duas decisões de interface valem mais que a API: o erro só aparece depois que o campo foi tocado (ou o envio foi tentado), para não gritar com quem ainda está digitando; e, ao enviar com erro, o foco vai para o primeiro campo inválido, para quem usa teclado ou leitor de tela. Os dois formulários têm testes que provam que aceitam e recusam exatamente os mesmos valores.',
    ],
    alternatives: [
      {
        name: 'Reactive Forms',
        text: 'Equivalente em capacidade. A diferença é ergonômica: o estado vive em observables, e a validação assíncrona precisa de um AsyncValidatorFn com timer e switchMap para ter debounce e cancelamento. É o código da aba Code, ao lado.',
      },
      {
        name: 'Validar no envio e mostrar tudo de uma vez',
        text: 'Mais simples, e frustrante: a pessoa descobre o erro tarde e perde o contexto. Funciona em formulários de um campo só.',
      },
      {
        name: 'Biblioteca de schema (Zod, Valibot)',
        text: 'Boa quando o mesmo schema valida o formulário e a resposta da API. O Signal Forms aceita schemas no padrão Standard Schema, então dá para combinar com as regras acima.',
      },
    ],
    differently: [
      'Em um código que já usa Reactive Forms e bibliotecas de componentes baseadas em ControlValueAccessor, eu manteria Reactive Forms e só adotaria Signal Forms nos formulários novos.',
      'Se as mesmas regras também validassem o corpo da API (em um BFF em TypeScript, por exemplo), eu moveria o schema para uma biblioteca compartilhada com Standard Schema e o usaria nos dois lados.',
      'Para formulários muito longos e dinâmicos (dezenas de campos condicionais), eu usaria applyWhen e schemas por seção, para a lógica não virar uma função gigante.',
    ],
  },
  'en-us': {
    title: 'Checkout form',
    summary:
      'Synchronous, cross-field and asynchronous (coupon) validation, with Signal Forms and the Reactive Forms equivalent.',
    problem:
      'A checkout validates name and email, checks the email confirmation, limits the quantity, looks the coupon up on the server and accepts the server rejecting a field. Everything must be accessible and only show an error after the person has touched the field.',
    question: {
      prompt: 'Which forms API would you use for a new form?',
      suggestedId: 'signal',
      options: [
        {
          id: 'signal',
          label: 'Signal Forms (@angular/forms/signals)',
          answer:
            'The model is a signal, the rules live in a schema next to it, and each field state (touched, dirty, invalid, pending) is already a signal. It is stable in Angular 22 and needs no subscriptions. For a new form, it is the starting point.',
        },
        {
          id: 'reactive',
          label: 'Reactive Forms (FormGroup and FormControl)',
          answer:
            'Still the right pick in existing code and when you depend on component libraries that only speak ControlValueAccessor. The cost is converting state to signals by hand (toSignal over statusChanges) to use it in modern templates.',
        },
        {
          id: 'template',
          label: 'Template-driven (ngModel)',
          answer:
            'Fine for one or two fields with no rules. With cross-field and async validation, rules spread across the template and become hard to test. I avoid it for any form with business rules.',
        },
      ],
    },
    demo: {
      name: 'Name',
      email: 'Email',
      confirmEmail: 'Confirm email',
      quantity: 'Quantity (1 to 10)',
      coupon: 'Coupon (optional)',
      couponHint:
        'Try PROMO10 (valid). The server lookup waits 400 ms after the last keystroke. The email taken@example.com is rejected by the server on submit.',
      submit: 'Place order',
      submitting: 'Sending…',
      success: 'Order {id} created.',
      hint: 'Errors only show after you leave the field (or try to submit), and submitting with errors moves focus to the first invalid field.',
      messages: {
        required: 'This field is required.',
        minLength: 'Use at least 3 characters.',
        email: 'Enter a valid email.',
        emailsDiffer: 'The emails do not match.',
        min: 'The minimum quantity is 1.',
        max: 'The maximum quantity is 10.',
        parse: 'Enter a number.',
        couponInvalid: 'Invalid coupon.',
        couponUnavailable: 'Could not validate the coupon right now.',
        emailTaken: 'This email is already registered.',
        submitFailed: 'Could not send the order. Try again.',
        invalid: 'Invalid value.',
      },
      fieldStates: 'State of each field',
      touched: 'touched',
      dirty: 'dirty',
      valid: 'valid',
      invalid: 'invalid',
      pending: 'validating',
      metricCouponChecks: 'Coupon lookups sent to the server',
      metricSubmits: 'Submits',
    },
    snippets: [
      {
        id: 'forms-signal-form',
        label:
          'Signal Forms: the model and the validation schema (what runs in the demo)',
      },
      {
        id: 'forms-reactive-form',
        label: 'Reactive Forms: the same form, for comparison',
      },
    ],
    why: [
      "In Signal Forms the form is just data and rules: a signal with the model and a schema function with required, minLength, email, min and max. Cross-field rules (the email confirmation) read another field's value in the same schema, and the async coupon validation is a rule like any other, with the result mapped to an error kind.",
      'Each field state is a signal. The instrumentation panel reads touched, dirty, valid and pending directly, with no subscription. The 400 ms debounce on the coupon cuts server lookups: typing "PROMO10" sends one lookup, not seven.',
      'Two interface decisions matter more than the API: the error only shows after the field was touched (or a submit was attempted), so it does not shout at someone still typing; and, when submitting with errors, focus moves to the first invalid field, for keyboard and screen reader users. Both forms have tests proving they accept and reject exactly the same values.',
    ],
    alternatives: [
      {
        name: 'Reactive Forms',
        text: 'Equivalent in capability. The difference is ergonomic: state lives in observables, and async validation needs an AsyncValidatorFn with a timer and switchMap to get debounce and cancellation. That is the code in the Code tab, alongside.',
      },
      {
        name: 'Validate on submit and show everything at once',
        text: 'Simpler, and frustrating: the person finds the error late and loses context. Works for single-field forms.',
      },
      {
        name: 'A schema library (Zod, Valibot)',
        text: 'Good when the same schema validates the form and the API response. Signal Forms accepts Standard Schema, so it can be combined with the rules above.',
      },
    ],
    differently: [
      'In code that already uses Reactive Forms and ControlValueAccessor-based component libraries, I would keep Reactive Forms and only adopt Signal Forms in new forms.',
      'If the same rules also validated the API body (in a TypeScript BFF, for example), I would move the schema to a shared library with Standard Schema and use it on both sides.',
      'For very long, dynamic forms (dozens of conditional fields), I would use applyWhen and per-section schemas, so the logic does not become one giant function.',
    ],
  },
};
