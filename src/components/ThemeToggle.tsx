import { useState, useEffect, useCallback } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useI18n } from '@/i18n';

function getSystemTheme(): 'dark' | 'light' {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function getSavedTheme(): 'dark' | 'light' | null {
  try {
    const saved = localStorage.getItem('tarot-theme');
    return saved === 'light' || saved === 'dark' ? saved : null;
  } catch {
    return null;
  }
}

export default function ThemeToggle() {
  const { t } = useI18n();
  // Use saved theme if exists, otherwise follow system
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return getSavedTheme() || getSystemTheme();
  });

  // Apply theme to document
  useEffect(() => {
    const background = theme === 'dark' ? '#050B14' : '#F5F0E8';
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.backgroundColor = background;
    document.body.style.backgroundColor = background;
  }, [theme]);

  // Listen to system theme changes
  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: light)');
    const handler = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't manually overridden
      const saved = getSavedTheme();
      if (!saved) {
        setTheme(e.matches ? 'light' : 'dark');
      }
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const toggle = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('tarot-theme', next); } catch { /* Keep the session theme when storage is unavailable. */ }
      return next;
    });
  }, []);

  return (
    <button
      onClick={toggle}
      className="theme-toggle"
      title={theme === 'dark' ? t('lightMode') : t('darkMode')}
      aria-label={theme === 'dark' ? t('lightMode') : t('darkMode')}
    >
      {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
