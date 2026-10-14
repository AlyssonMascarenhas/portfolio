import { TestBed } from '@angular/core/testing';
import { provideFormsTesting } from '../testing';
import { FormsLabPage } from './forms-lab.page';

describe('FormsLabPage', () => {
  let el: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: provideFormsTesting() });
    el = TestBed.createComponent(FormsLabPage).nativeElement;
    TestBed.tick();
  });

  it('apresenta o lab e lista os dois cenários com link para cada um', () => {
    expect(el.querySelector('h1')?.textContent).toBe(
      'Formulários com Signal Forms',
    );
    const links = [...el.querySelectorAll('.scenarios a')];

    expect(links.map((a) => a.getAttribute('href'))).toEqual([
      '/checkout',
      '/money',
    ]);
    expect(links.map((a) => a.textContent)).toEqual([
      'Formulário de checkout',
      'Campo de moeda com transformedValue',
    ]);
  });
});
