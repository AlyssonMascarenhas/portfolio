import { httpResource } from '@angular/common/http';
import { Service } from '@angular/core';

export interface Snippet {
  /** Arquivo de origem, para o botão "ver no código". */
  file: string;
  code: string;
  /** Linhas do trecho no arquivo (1 a N), para o link "ver no GitHub". */
  startLine?: number;
  endLine?: number;
}

/**
 * Trechos de código exibidos na aba Code dos labs.
 * O JSON é gerado por `tools/scripts/extract-snippets.mjs` a partir das regiões `// #region <id>`
 * do código real dos labs, então o que aparece na tela é o que roda na demo.
 */
@Service()
export class SnippetsService {
  readonly all = httpResource<Record<string, Snippet>>(() => 'snippets.json');
}
