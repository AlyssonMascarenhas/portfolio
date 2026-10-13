---
name: traducao-i18n
description: Adiciona, renomeia ou remove textos de interface nos arquivos de tradução pt-br.json e en-us.json do portfólio. Use sempre que um template ganhar ou perder texto visível.
---

# Textos de interface (ngx-translate)

Arquivos: `apps/portfolio/public/i18n/pt-br.json` e `apps/portfolio/public/i18n/en-us.json`.

## É texto de interface ou conteúdo?

- Rótulo de botão, título de seção, mensagem de erro, aria-label → **interface**: vai nos JSON.
- Descrição de experiência, parágrafo do "Sobre", nome de competência → **conteúdo**: vai na API (skill `novo-endpoint`).

## Regras

- Chaves agrupadas por seção: `secao.chave` (ex.: `experience.loadError`, `hero.cta.resume`), em camelCase.
- Toda chave existe nos dois arquivos, na mesma posição.
- Interpolação: `"{{years}}+ anos de experiência"` e no template `'hero.yearsOfExperience' | translate: { years: years() }`.
- Sentence case, voz ativa, sem ponto final em botões. Mensagens de erro dizem o que falhou.
- Português do Brasil e inglês americano naturais, não traduções literais.
- Ao remover um texto do template, remova a chave dos dois arquivos.

## Validação

    npm run i18n:check
