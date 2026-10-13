import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
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
    expect(el.querySelector('figcaption')?.textContent).toBe('libs/labs/x.ts');
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
});
