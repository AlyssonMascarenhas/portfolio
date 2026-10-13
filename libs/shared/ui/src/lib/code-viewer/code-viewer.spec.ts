import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { SOURCE_BASE_URL } from '../source-url';
import { CodeViewer } from './code-viewer';

describe('CodeViewer', () => {
  function setup(inputs: Record<string, unknown>) {
    TestBed.configureTestingModule({ providers: [provideTranslateService()] });
    const fixture = TestBed.createComponent(CodeViewer);
    for (const [key, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(key, value);
    }
    TestBed.tick();
    return fixture;
  }

  it('mostra o código e o arquivo de origem', () => {
    const el: HTMLElement = setup({
      code: 'const a = signal(1);',
      file: 'libs/labs/x.ts',
    }).nativeElement;

    expect(el.querySelector('code')?.textContent).toBe('const a = signal(1);');
    expect(el.querySelector('figcaption')?.textContent).toContain(
      'libs/labs/x.ts',
    );
    expect(el.querySelector('pre')?.getAttribute('tabindex')).toBe('0');
  });

  it('indica carregamento', () => {
    const el: HTMLElement = setup({ status: 'loading' }).nativeElement;

    expect(el.querySelector('[aria-busy=true]')).not.toBeNull();
    expect(el.querySelector('pre')).toBeNull();
  });

  it('mostra o erro com alerta e emite retry ao tentar de novo', () => {
    const fixture = setup({ status: 'error' });
    const el: HTMLElement = fixture.nativeElement;
    let retried = 0;
    fixture.componentInstance.retry.subscribe(() => retried++);

    expect(el.querySelector('[role=alert]')).not.toBeNull();
    el.querySelector('button')?.click();

    expect(retried).toBe(1);
  });

  describe('link "Ver no GitHub"', () => {
    const href = (el: HTMLElement) =>
      el.querySelector('figcaption a')?.getAttribute('href');

    it('aponta para o arquivo e o intervalo de linhas no repositório', () => {
      const el: HTMLElement = setup({
        code: 'x',
        file: 'libs/labs/a.ts',
        startLine: 16,
        endLine: 20,
      }).nativeElement;

      expect(href(el)).toBe(
        'https://github.com/AlyssonMascarenhas/portfolio/blob/main/libs/labs/a.ts#L16-L20',
      );
      expect(el.querySelector('figcaption a')?.getAttribute('rel')).toBe(
        'noopener',
      );
    });

    it('usa uma linha só quando o trecho tem uma linha', () => {
      const el: HTMLElement = setup({
        code: 'x',
        file: 'a.ts',
        startLine: 7,
        endLine: 7,
      }).nativeElement;

      expect(href(el)?.endsWith('/a.ts#L7')).toBe(true);
    });

    it('sem número de linha, aponta para o arquivo inteiro', () => {
      const el: HTMLElement = setup({ code: 'x', file: 'a.ts' }).nativeElement;

      expect(href(el)?.endsWith('/blob/main/a.ts')).toBe(true);
    });

    it('respeita a base configurada no token SOURCE_BASE_URL', () => {
      TestBed.configureTestingModule({
        providers: [
          provideTranslateService(),
          {
            provide: SOURCE_BASE_URL,
            useValue: 'https://exemplo.dev/blob/dev',
          },
        ],
      });
      const fixture = TestBed.createComponent(CodeViewer);
      fixture.componentRef.setInput('file', 'a.ts');
      TestBed.tick();

      expect(href(fixture.nativeElement)).toBe(
        'https://exemplo.dev/blob/dev/a.ts',
      );
    });
  });
});
