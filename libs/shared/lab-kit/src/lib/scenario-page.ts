import { Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CodeViewer, LabLayout } from '@portfolio/ui';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ScenarioText } from './scenario-text';
import { SNIPPET_SOURCE } from './snippet-source';

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
  template: `
    <pf-lab-layout [title]="text().title" [problem]="text().problem">
      <div demo>
        @if (text().question; as question) {
          <p-fieldset [legend]="question.prompt" class="question">
            @for (option of question.options; track option.id) {
              <div class="option">
                <p-radiobutton
                  [inputId]="groupName + '-' + option.id"
                  [name]="groupName"
                  [value]="option.id"
                  [ngModel]="chosenId()"
                  (ngModelChange)="chosenId.set($event)"
                />
                <label [for]="groupName + '-' + option.id">{{
                  option.label
                }}</label>
              </div>
            }
          </p-fieldset>

          @if (answer(); as answer) {
            <div class="answer" role="status">
              <p>
                {{ answer.text }}
                <strong class="mine">
                  @if (answer.isSuggested) {
                    {{ 'lab.scenario.sameChoice' | translate }}
                  } @else {
                    {{
                      'lab.scenario.myChoice'
                        | translate: { label: answer.suggestedLabel }
                    }}
                  }
                </strong>
              </p>
            </div>
          }
        }

        <ng-content />
      </div>

      <div code>
        @for (block of blocks(); track block.id) {
          <h2>{{ block.label }}</h2>
          <pf-code-viewer
            [code]="block.code"
            [file]="block.file"
            [status]="status()"
            (retry)="snippets.reload()"
          />
        }
      </div>

      <div architecture>
        <h2>{{ 'lab.scenario.why' | translate }}</h2>
        @for (paragraph of text().why; track $index) {
          <p>{{ paragraph }}</p>
        }

        <h2>{{ 'lab.scenario.alternatives' | translate }}</h2>
        <dl>
          @for (alt of text().alternatives; track alt.name) {
            <dt>{{ alt.name }}</dt>
            <dd>{{ alt.text }}</dd>
          }
        </dl>

        <h2>{{ 'lab.scenario.differently' | translate }}</h2>
        <ul>
          @for (item of text().differently; track $index) {
            <li>{{ item }}</li>
          }
        </ul>
      </div>
    </pf-lab-layout>

    <p class="back">
      <a pButton routerLink=".." [text]="true">{{
        'lab.scenario.back' | translate
      }}</a>
    </p>
  `,
  styles: `
    .question {
      display: block;
      margin-bottom: var(--space);
    }
    .option {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.35rem 0;
    }
    .option label {
      cursor: pointer;
    }
    .answer {
      margin-bottom: var(--space);
      padding: 0.25rem 0 0.25rem var(--space);
      border-left: 3px solid var(--color-accent);
    }
    .mine {
      display: block;
      margin-top: 0.35rem;
    }
    dt {
      font-weight: 600;
      margin-top: 0.5rem;
    }
    dd {
      margin-left: 0;
    }
    .back {
      max-width: var(--measure);
      margin: 0 auto;
      padding: 0 var(--space) var(--space);
    }
  `,
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
    }));
  });
}

let nextQuestionId = 0;
