import { useState, useEffect, useCallback } from 'react';
import { Sun, Moon } from 'lucide-react';

function getSystemTheme(): 'dark' | 'light' {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function getSavedTheme(): 'dark' | 'light' | null {
  const saved = localStorage.getItem('tarot-theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return null;
}

export default function ThemeToggle() {
  // Use saved theme if exists, otherwise follow system
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return getSavedTheme() || getSystemTheme();
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
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
      localStorage.setItem('tarot-theme', next);
      return next;
    });
  }, []);

  return (
    <button
      onClick={toggle}
      className="theme-toggle"
      title={theme === 'dark' ? '切换到白天模式' : '切换到夜间模式'}
    >
      {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
