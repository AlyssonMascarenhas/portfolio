import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

export type CodeViewerStatus = 'loading' | 'error' | 'ready';

/** Exibe um trecho de código (sem realce de sintaxe), com os estados de loading e erro tratados. */
@Component({
  selector: 'pf-code-viewer',
  imports: [TranslatePipe, ButtonModule, MessageModule],
  template: `
    @switch (status()) {
      @case ('error') {
        <div class="state">
          <p-message severity="error">{{
            'lab.code.loadError' | translate
          }}</p-message>
          <button pButton type="button" (click)="retry.emit()">
            {{ 'common.retry' | translate }}
          </button>
        </div>
      }
      @case ('loading') {
        <p class="state" aria-busy="true">
          {{ 'common.loading' | translate }}
        </p>
      }
      @default {
        <figure>
          @if (file(); as file) {
            <figcaption>{{ file }}</figcaption>
          }
          <pre
            tabindex="0"
            role="region"
            [attr.aria-label]="'lab.code.label' | translate"
          ><code>{{ code() }}</code></pre>
        </figure>
      }
    }
  `,
  styles: `
    :host {
      display: block;
    }
    figure {
      margin: 0;
    }
    figcaption {
      font-size: 0.85rem;
      color: var(--color-muted);
      margin-bottom: 0.25rem;
    }
    pre {
      margin: 0;
      padding: var(--space);
      overflow-x: auto;
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      font-size: 0.875rem;
      line-height: 1.5;
    }
    button {
      margin-top: 0.75rem;
    }
  `,
})
export class CodeViewer {
  readonly code = input<string>();
  /** Arquivo de origem, mostrado como legenda. */
  readonly file = input<string>();
  readonly status = input<CodeViewerStatus>('ready');
  readonly retry = output<void>();
}
