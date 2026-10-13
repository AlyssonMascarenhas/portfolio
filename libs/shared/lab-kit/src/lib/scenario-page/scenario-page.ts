import { Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CodeViewer, LabLayout } from '@portfolio/ui';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ScenarioText } from '../scenario-text';
import { SNIPPET_SOURCE } from '../snippet-source';

/**
 * Página-padrão de um cenário: problema, pergunta opcional, e as abas Demo, Code e Architecture.
 * A demo entra por projeção; os trechos da aba Code vêm do código real (ver `extract-snippets`).
 */
@Component({
  selector: 'pf-scenario-page',
  imports: [
    TranslatePipe,
    RouterLink,
    FormsModule,
    ButtonModule,
    FieldsetModule,
    RadioButtonModule,
    LabLayout,
    CodeViewer,
  ],
  templateUrl: './scenario-page.html',
  styleUrl: './scenario-page.scss',
})
export class ScenarioPage {
  readonly text = input.required<ScenarioText<unknown>>();

  protected readonly snippets = inject(SNIPPET_SOURCE);
  protected readonly groupName = `pf-question-${nextQuestionId++}`;
  protected readonly chosenId = signal<string | undefined>(undefined);

  protected readonly answer = computed(() => {
    const question = this.text().question;
    const chosen = question?.options.find((o) => o.id === this.chosenId());
    if (!question || !chosen) return undefined;
    return {
      text: chosen.answer,
      isSuggested: chosen.id === question.suggestedId,
      suggestedLabel:
        question.options.find((o) => o.id === question.suggestedId)?.label ??
        '',
    };
  });

  protected readonly status = computed(() => {
    const source = this.snippets;
    if (source.error()) return 'error';
    return source.hasValue() ? 'ready' : 'loading';
  });

  protected readonly blocks = computed(() => {
    const all = this.snippets.hasValue() ? (this.snippets.value() ?? {}) : {};
    return this.text().snippets.map(({ id, label }) => ({
      id,
      label,
      code: all[id]?.code,
      file: all[id]?.file,
      startLine: all[id]?.startLine,
      endLine: all[id]?.endLine,
    }));
  });
}

let nextQuestionId = 0;
