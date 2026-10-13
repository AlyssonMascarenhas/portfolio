import { DOCUMENT } from '@angular/common';
import { Service, computed, effect, inject, signal } from '@angular/core';

const THEME_KEY = 'portfolio.theme';
const DESKTOP_QUERY = '(min-width: 992px)';
const DARK_QUERY = '(prefers-color-scheme: dark)';

type Theme = 'light' | 'dark';

/**
 * Estado do layout (menu e tema). O tema segue o sistema até a pessoa escolher um;
 * a escolha fica salva. A classe `app-dark` no <html> é o seletor do tema escuro do PrimeNG
 * (um script no index.html a aplica antes da primeira pintura, para não piscar).
 */
@Service()
export class LayoutService {
  private readonly document = inject(DOCUMENT);
  private readonly window = this.document.defaultView;

  private readonly stored = signal<Theme | null>(this.readStoredTheme());
  private readonly systemDark = signal(this.matches(DARK_QUERY));
  readonly isDesktop = signal(this.matches(DESKTOP_QUERY));

  readonly isDark = computed(() => {
    const stored = this.stored();
    return stored ? stored === 'dark' : this.systemDark();
  });

  /** Menu lateral aberto no mobile (no desktop ele é fixo, e pode ser recolhido). */
  readonly menuOpen = signal(false);
  readonly menuCollapsed = signal(false);

  constructor() {
    this.listen(DARK_QUERY, (matches) => this.systemDark.set(matches));
    this.listen(DESKTOP_QUERY, (matches) => {
      this.isDesktop.set(matches);
      this.menuOpen.set(false);
    });

    effect(() => {
      this.document.documentElement.classList.toggle('app-dark', this.isDark());
    });
  }

  toggleTheme(): void {
    const next: Theme = this.isDark() ? 'light' : 'dark';
    this.stored.set(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // storage indisponível: a escolha só não é lembrada
    }
  }

  toggleMenu(): void {
    if (this.isDesktop()) {
      this.menuCollapsed.update((collapsed) => !collapsed);
    } else {
      this.menuOpen.update((open) => !open);
    }
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  private matches(query: string): boolean {
    return this.window?.matchMedia?.(query).matches ?? false;
  }

  private listen(query: string, onChange: (matches: boolean) => void): void {
    this.window
      ?.matchMedia?.(query)
      .addEventListener('change', (event) => onChange(event.matches));
  }

  private readStoredTheme(): Theme | null {
    try {
      const value = localStorage.getItem(THEME_KEY);
      return value === 'light' || value === 'dark' ? value : null;
    } catch {
      return null;
    }
  }
}
