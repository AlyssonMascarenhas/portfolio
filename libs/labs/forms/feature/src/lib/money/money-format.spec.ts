import { formatMoney, parseMoney } from './money-format';

describe('parseMoney', () => {
  it.each([
    ['1.234,56', 1234.56],
    ['1234,5', 1234.5],
    ['1234', 1234],
    ['12,3', 12.3],
    ['R$ 99,90', 99.9],
    ['-3,00', -3],
  ])('lê "%s" como %s', (raw, expected) => {
    expect(parseMoney(raw)).toEqual({ value: expected });
  });

  it('trata campo vazio como null, não como erro', () => {
    expect(parseMoney('')).toEqual({ value: null });
    expect(parseMoney('   ')).toEqual({ value: null });
  });

  it.each(['abc', '1,2,3', '1.23', '12,345', '1..000,00', '--5'])(
    'recusa "%s" com erro de parse e sem valor',
    (raw) => {
      const result = parseMoney(raw);

      expect(result.error?.kind).toBe('parse');
      expect(result).not.toHaveProperty('value');
    },
  );
});

describe('formatMoney', () => {
  it('usa o padrão brasileiro com duas casas', () => {
    expect(formatMoney(1234.5)).toBe('1.234,50');
    expect(formatMoney(0.5)).toBe('0,50');
  });

  it('devolve texto vazio para null', () => {
    expect(formatMoney(null)).toBe('');
  });

  it('é o inverso de parseMoney para valores com até duas casas', () => {
    for (const value of [0, 0.01, 9.99, 1234.56, 10000]) {
      expect(parseMoney(formatMoney(value))).toEqual({ value });
    }
  });
});
