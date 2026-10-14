import { LocalizedScenario } from '@portfolio/lab-kit';

export interface MoneyDemoText {
  amount: string;
  hint: string;
  /** Mensagem por tipo de erro (kind). */
  messages: Record<string, string>;
  metricText: string;
  metricModel: string;
  metricParse: string;
  metricParseOk: string;
  metricParseFailed: string;
  metricState: string;
  touched: string;
  valid: string;
  invalid: string;
}

export const MONEY_CONTENT: LocalizedScenario<MoneyDemoText> = {
  'pt-br': {
    title: 'Campo de moeda com transformedValue',
    summary:
      'O usuário digita texto, o model guarda número: a conversão fica no controle, não no template nem no submit.',
    problem:
      'Um campo de valor em reais mostra "1.234,56", mas a regra de negócio quer o número 1234.56. Quem digita lixo não pode contaminar o model, e a validação (mínimo, máximo) precisa olhar o número, não o texto.',
    question: {
      prompt: 'Onde você converteria o texto digitado em número?',
      suggestedId: 'control',
      options: [
        {
          id: 'control',
          label: 'No custom control, com transformedValue()',
          answer:
            'O controle expõe value tipado (number | null) e guarda o texto num segundo signal com parse e format. O texto inválido vira erro do campo sem tocar no model. Quem usa o campo não conhece o texto.',
        },
        {
          id: 'template',
          label: 'No template ou num setter do componente',
          answer:
            'Funciona para um campo, mas a conversão se repete em cada tela e o erro de parse precisa de um caminho próprio para chegar ao formulário. É onde costumam nascer NaN no model e validações que olham o tipo errado.',
        },
        {
          id: 'submit',
          label: 'No envio, antes de chamar a API',
          answer:
            'O model fica com string, as regras de mínimo e máximo comparam texto, e o erro só aparece no fim. Eu uso só quando o backend aceita a string e decide tudo lá.',
        },
      ],
    },
    demo: {
      amount: 'Valor (R$)',
      hint: 'Digite 1.234,56, 1234,5 ou texto inválido como abc. O valor tem que ficar entre 0,01 e 10.000,00. Ao sair do campo, o texto válido é reformatado.',
      messages: {
        required: 'Informe um valor.',
        parse: 'Informe um valor em reais, como 1.234,56.',
        min: 'O valor mínimo é R$ 0,01.',
        max: 'O valor máximo é R$ 10.000,00.',
        invalid: 'Valor inválido.',
      },
      metricText: 'Texto no campo',
      metricModel: 'Valor no model',
      metricParse: 'Leitura do texto',
      metricParseOk: 'ok',
      metricParseFailed: 'falhou (model preservado)',
      metricState: 'Estado do campo',
      touched: 'tocado',
      valid: 'válido',
      invalid: 'inválido',
    },
    snippets: [
      {
        id: 'forms-transformed-value',
        label:
          'Signal Forms: o controle com transformedValue (o que roda na demo)',
      },
      {
        id: 'forms-money-schema',
        label: 'Signal Forms: as regras comparam o número',
      },
      {
        id: 'forms-money-reactive',
        label: 'Reactive Forms: o mesmo campo como ControlValueAccessor',
      },
    ],
    why: [
      'A fronteira entre texto e número é uma só, e o transformedValue a põe num lugar só: parse converte o que foi digitado, format converte o model de volta. O controle declara value como number | null e o resto do formulário (regras, envio, testes) nunca vê string.',
      'Quando o parse falha, o model não é atualizado e o erro vai sozinho para o campo, com o kind "parse". Por isso não existe NaN no model, e a mensagem sai do mesmo mecanismo das outras regras. O painel mostra isso: o texto "abc" no campo, o model ainda com o último número válido.',
      'As regras min e max do schema comparam números, então "10.000,01" é recusado por max, não por uma expressão regular de tela. O mesmo vale para a versão em Reactive Forms ao lado, com a diferença de que a conversão fica espalhada em writeValue, input, blur e no validador, e o último erro de parse precisa ser guardado na mão.',
    ],
    alternatives: [
      {
        name: 'ControlValueAccessor (Reactive Forms)',
        text: 'Mesma capacidade, mais código: quatro lugares fazem a conversão e o estado de "o último parse falhou" é um campo privado. É a versão da aba Code, para comparar.',
      },
      {
        name: 'Máscara de input (biblioteca)',
        text: 'Boa para guiar a digitação, mas uma máscara sozinha ainda entrega string ao model. Combina com o transformedValue: a máscara cuida da digitação e o parse do tipo.',
      },
      {
        name: 'Guardar centavos como inteiro',
        text: 'Evita erros de ponto flutuante em somas. O parse do controle pode devolver centavos (123456) em vez de 1234.56, e a mesma estrutura continua valendo.',
      },
    ],
    differently: [
      'Para dinheiro de verdade eu guardaria centavos inteiros (ou uma biblioteca de decimais) no model, e não number com casas decimais: 0.1 + 0.2 não é 0.3, e isso importa em soma de pedido.',
      'O parse acima só entende o padrão brasileiro. Num produto com vários idiomas eu usaria Intl.NumberFormat.formatToParts para descobrir os separadores do locale, em vez de fixar vírgula e ponto.',
      'Para datas eu não escreveria o parse à mão: um campo de data nativo já entrega o valor normalizado, e o transformedValue só entra se o model precisar de Date em vez de string.',
    ],
  },
  'en-us': {
    title: 'Currency field with transformedValue',
    summary:
      'The user types text, the model holds a number: the conversion lives in the control, not in the template or the submit.',
    problem:
      'A currency field shows "1.234,56", but the business rule wants the number 1234.56. Typing junk must not contaminate the model, and validation (min, max) has to look at the number, not the text.',
    question: {
      prompt: 'Where would you convert the typed text into a number?',
      suggestedId: 'control',
      options: [
        {
          id: 'control',
          label: 'In the custom control, with transformedValue()',
          answer:
            'The control exposes a typed value (number | null) and keeps the text in a second signal with parse and format. Invalid text becomes a field error without touching the model. Whoever uses the field never sees the text.',
        },
        {
          id: 'template',
          label: 'In the template or a component setter',
          answer:
            'It works for one field, but the conversion repeats on every screen and the parse error needs its own path to reach the form. That is where NaN in the model and rules that look at the wrong type tend to come from.',
        },
        {
          id: 'submit',
          label: 'On submit, before calling the API',
          answer:
            'The model keeps a string, min and max rules compare text, and the error only shows at the end. I use it only when the backend accepts the string and decides everything there.',
        },
      ],
    },
    demo: {
      amount: 'Amount (BRL)',
      hint: 'Type 1.234,56, 1234,5 or invalid text such as abc. The amount must be between 0.01 and 10,000.00. When you leave the field, valid text is reformatted.',
      messages: {
        required: 'Enter an amount.',
        parse: 'Enter an amount in reais, like 1.234,56.',
        min: 'The minimum amount is R$ 0.01.',
        max: 'The maximum amount is R$ 10,000.00.',
        invalid: 'Invalid value.',
      },
      metricText: 'Text in the field',
      metricModel: 'Value in the model',
      metricParse: 'Reading the text',
      metricParseOk: 'ok',
      metricParseFailed: 'failed (model preserved)',
      metricState: 'Field state',
      touched: 'touched',
      valid: 'valid',
      invalid: 'invalid',
    },
    snippets: [
      {
        id: 'forms-transformed-value',
        label:
          'Signal Forms: the control with transformedValue (what runs in the demo)',
      },
      {
        id: 'forms-money-schema',
        label: 'Signal Forms: the rules compare the number',
      },
      {
        id: 'forms-money-reactive',
        label: 'Reactive Forms: the same field as a ControlValueAccessor',
      },
    ],
    why: [
      'The boundary between text and number is one, and transformedValue puts it in one place: parse converts what was typed, format converts the model back. The control declares value as number | null and the rest of the form (rules, submit, tests) never sees a string.',
      'When parsing fails the model is not updated and the error goes to the field by itself, with kind "parse". That is why there is no NaN in the model, and the message comes from the same mechanism as the other rules. The panel shows it: the text "abc" in the field, the model still holding the last valid number.',
      'The schema min and max rules compare numbers, so "10.000,01" is rejected by max, not by a screen regular expression. The same holds for the Reactive Forms version alongside, except the conversion is spread across writeValue, input, blur and the validator, and the last parse error has to be stored by hand.',
    ],
    alternatives: [
      {
        name: 'ControlValueAccessor (Reactive Forms)',
        text: 'Same capability, more code: four places do the conversion and the "last parse failed" state is a private field. It is the version in the Code tab, for comparison.',
      },
      {
        name: 'An input mask (library)',
        text: 'Good at guiding typing, but a mask alone still hands a string to the model. It pairs with transformedValue: the mask handles typing and the parse handles the type.',
      },
      {
        name: 'Store cents as an integer',
        text: 'Avoids floating point errors in sums. The control parse can return cents (123456) instead of 1234.56, and the same structure still holds.',
      },
    ],
    differently: [
      'For real money I would store integer cents (or a decimal library) in the model, not a number with decimals: 0.1 + 0.2 is not 0.3, and that matters when summing an order.',
      'The parse above only understands the Brazilian format. In a multi-language product I would use Intl.NumberFormat.formatToParts to discover the locale separators instead of hard-coding comma and dot.',
      'For dates I would not hand-write the parse: a native date field already gives a normalized value, and transformedValue only comes in if the model needs a Date instead of a string.',
    ],
  },
};
