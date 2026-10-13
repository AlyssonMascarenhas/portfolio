import { Component, computed, inject, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { SOURCE_BASE_URL } from '../source-url';

export type CodeViewerStatus = 'loading' | 'error' | 'ready';

/** Exibe um trecho de código (sem realce de sintaxe), com os estados de loading e erro tratados. */
@Component({
  selector: 'pf-code-viewer',
  imports: [TranslatePipe, ButtonModule, MessageModule],
  templateUrl: './code-viewer.html',
  styleUrl: './code-viewer.scss',
})
export class CodeViewer {
  readonly code = input<string>();
  /** Arquivo de origem, mostrado como legenda. */
  readonly file = input<string>();
  /** Linhas do trecho no arquivo, para apontar o link para o intervalo certo. */
  readonly startLine = input<number>();
  readonly endLine = input<number>();
  readonly status = input<CodeViewerStatus>('ready');
  readonly retry = output<void>();

  private readonly baseUrl = inject(SOURCE_BASE_URL);

  /** Link para o arquivo (e as linhas) no repositório; vazio quando não há arquivo. */
  protected readonly sourceUrl = computed(() => {
    const file = this.file();
    if (!file) return undefined;
    const start = this.startLine();
    const end = this.endLine();
    const lines = start
      ? `#L${start}${end && end !== start ? `-L${end}` : ''}`
      : '';
    return `${this.baseUrl}/${file}${lines}`;
  });
}
