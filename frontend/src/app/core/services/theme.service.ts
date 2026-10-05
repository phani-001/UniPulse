import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'unipulse_theme';
  readonly currentTheme = signal<Theme>(this.getInitialTheme());

  constructor() {
    // Apply theme whenever signal changes
    effect(() => {
      const theme = this.currentTheme();
      this.applyTheme(theme);
    });
  }

  toggleTheme(): void {
    const nextTheme: Theme = this.currentTheme() === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
  }

  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
    try {
      localStorage.setItem(this.THEME_KEY, theme);
    } catch (e) {
      console.warn('Unable to persist theme to localStorage', e);
    }
  }

  private applyTheme(theme: Theme): void {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.style.colorScheme = 'light';
    }
    root.setAttribute('data-theme', theme);
  }

  private getInitialTheme(): Theme {
    try {
      const saved = localStorage.getItem(this.THEME_KEY) as Theme;
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
    } catch {}

    // Default to dark for high-tech aesthetic, or light if system prefers
    if (typeof window !== 'undefined' && window.matchMedia) {
      if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
    }
    return 'dark';
  }
}
