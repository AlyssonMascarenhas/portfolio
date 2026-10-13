import { Meta, Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { Service, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { merge } from 'rxjs';

const SITE_NAME = 'Alysson Mascarenhas';
const DEFAULT_DESCRIPTION_KEY = 'meta.default';

interface PageMeta {
  titleKey?: string;
  descriptionKey: string;
}

/**
 * Título e descrição de cada página, nos dois idiomas. As rotas guardam *chaves* de tradução
 * (`title: 'title.labs'`, `data: { description: 'meta.labs' }`); a tradução acontece aqui, e é
 * refeita quando o idioma muda ou quando os arquivos de tradução terminam de carregar.
 */
@Service()
export class PortfolioTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly translate = inject(TranslateService);

  private readonly page = signal<PageMeta>({
    descriptionKey: DEFAULT_DESCRIPTION_KEY,
  });
  private readonly translationChanges = toSignal(
    merge(
      this.translate.onLangChange,
      this.translate.onTranslationChange,
      this.translate.onFallbackLangChange,
    ),
    { initialValue: null },
  );

  constructor() {
    super();
    effect(() => {
      this.translationChanges();
      const { titleKey, descriptionKey } = this.page();

      const pageTitle = titleKey ? this.translate.instant(titleKey) : '';
      this.title.setTitle(
        pageTitle && pageTitle !== titleKey
          ? `${pageTitle} · ${SITE_NAME}`
          : SITE_NAME,
      );

      const description = this.translate.instant(descriptionKey);
      if (description && description !== descriptionKey) {
        for (const name of [
          'description',
          'og:description',
          'twitter:description',
        ]) {
          this.meta.updateTag(
            name.startsWith('og:')
              ? { property: name, content: description }
              : { name, content: description },
          );
        }
      }
    });
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    let route = snapshot.root;
    let descriptionKey = DEFAULT_DESCRIPTION_KEY;
    while (route) {
      const description = route.data?.['description'];
      if (typeof description === 'string') descriptionKey = description;
      route = route.firstChild as typeof route;
    }

    this.page.set({ titleKey: this.buildTitle(snapshot), descriptionKey });
  }
}
