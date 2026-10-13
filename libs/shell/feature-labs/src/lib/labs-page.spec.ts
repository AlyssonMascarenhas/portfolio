import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { LabsPage } from './labs-page';

describe('LabsPage', () => {
  it('lista os dois labs com link para cada rota', () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideTranslateService()],
    });
    const el: HTMLElement = TestBed.createComponent(LabsPage).nativeElement;
    TestBed.tick();

    const links = [...el.querySelectorAll('a')].map((a) =>
      a.getAttribute('href'),
    );
    expect(links).toEqual(['/labs/signals-rxjs', '/labs/api-playground']);
    expect(el.querySelector('h1')).not.toBeNull();
  });
});
