import { httpResource } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import {
  ExperienceEntry,
  Profile,
  SkillGroup,
  toBcp47,
} from '@portfolio/contracts';
import { LanguageService } from '@portfolio/i18n';

/**
 * Conteúdo das seções vindo da "API" (MSW no navegador).
 *
 * httpResource lê o idioma dentro da função de request: quando o idioma muda,
 * a requisição é refeita e a anterior é cancelada automaticamente.
 * O lab Signals vs RxJS compara esta abordagem com toObservable + switchMap.
 */
@Service()
export class PortfolioContentService {
  private readonly language = inject(LanguageService);

  readonly profile = httpResource<Profile>(() => this.request('api/profile'));
  readonly experience = httpResource<ExperienceEntry[]>(() =>
    this.request('api/experience'),
  );
  readonly skills = httpResource<SkillGroup[]>(() =>
    this.request('api/skills'),
  );

  private request(url: string) {
    return {
      url,
      headers: { 'Accept-Language': toBcp47(this.language.current()) },
    };
  }
}
