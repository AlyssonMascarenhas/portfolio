export const SUPPORTED_LANGS = ['pt-br', 'en-us'] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];
export const DEFAULT_LANG: Lang = 'pt-br';

const BCP47: Record<Lang, string> = { 'pt-br': 'pt-BR', 'en-us': 'en-US' };

export function isLang(value: unknown): value is Lang {
  return (
    typeof value === 'string' &&
    (SUPPORTED_LANGS as readonly string[]).includes(value)
  );
}

/** 'pt-br' -> 'pt-BR' (usado em <html lang>, Accept-Language e Intl). */
export function toBcp47(lang: Lang): string {
  return BCP47[lang];
}

/** 'en-US', 'en-US,en;q=0.9', 'pt' ... -> Lang suportado (fallback: pt-br). */
export function toLang(header: string | null | undefined): Lang {
  const first = header?.split(',')[0]?.trim().toLowerCase() ?? '';
  if (isLang(first)) return first;
  if (first.startsWith('en')) return 'en-us';
  return DEFAULT_LANG;
}
