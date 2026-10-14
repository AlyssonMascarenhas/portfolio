/** Resultado de ler o que a pessoa digitou: o número, um erro, ou os dois (como o `transformedValue` espera). */
export interface MoneyParseResult {
  value?: number | null;
  error?: { kind: string; message: string };
}

/** 1.234,56 · 1234,5 · 12 · -3,00 (separador de milhar e "R$" são opcionais). */
const MONEY = /^-?(\d{1,3}(\.\d{3})+|\d+)(,\d{1,2})?$/;

/** Texto digitado (pt-BR) -> número. Vazio é `null`; o que não for dinheiro vira erro e não gera valor. */
export function parseMoney(raw: string): MoneyParseResult {
  const text = raw.replace(/R\$/g, '').replace(/\s/g, '');
  if (!text) return { value: null };
  if (!MONEY.test(text)) {
    return { error: { kind: 'parse', message: 'Informe um valor em reais.' } };
  }
  return { value: Number(text.replace(/\./g, '').replace(',', '.')) };
}

const BRL = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Número -> texto no padrão brasileiro, com duas casas. `null` é campo vazio. */
export function formatMoney(value: number | null): string {
  return value === null ? '' : BRL.format(value);
}
