---
name: novo-cenario-lab
description: Desenha e implementa um cenário de lab interativo (ex. Signals vs RxJS, API Playground) com as abas Demo, Code e Architecture. Use ao criar ou revisar cenários dos labs do portfólio.
---

# Cenário de lab

Cada cenário demonstra uma decisão técnica, não uma tecnologia.

## Estrutura obrigatória

1. **Problema concreto** em uma frase (ex.: "Busca de produtos que dispara a cada tecla").
2. **Pergunta opcional** "O que você usaria?" com 2–3 opções plausíveis. Evite rotular opções como "erradas"; explique custo e contexto.
3. **Demo** funcionando de verdade, com um painel de instrumentação que torne visível o comportamento invisível (recálculos de `computed`, requisições disparadas e canceladas, emissões de um stream).
4. **Code**: o trecho exibido sai do código-fonte real, delimitado por `// #region demo` e `// #endregion`. Nunca copie código para dentro de strings.
5. **Architecture**: por que essa escolha, alternativas consideradas e uma seção final "Quando eu escolheria diferente".

## Implementação

- Cada lab tem libs próprias com `scope:lab-<nome>` (skill `nova-lib`) e não importa outros labs.
- Textos de interface via `traducao-i18n`; textos longos do cenário (problema, arquitetura) em pt-br e en-us, junto do cenário.
- Teste a lógica da demo. Para RxJS com tempo, use timers falsos do Vitest ou marble testing.

## Checklist de qualidade

- Funciona no celular e só com teclado.
- Respeita `prefers-reduced-motion`.
- A seção "Quando eu escolheria diferente" existe e é honesta.
