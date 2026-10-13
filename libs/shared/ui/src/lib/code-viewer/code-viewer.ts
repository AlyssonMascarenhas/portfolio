import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

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
  readonly status = input<CodeViewerStatus>('ready');
  readonly retry = output<void>();
}
