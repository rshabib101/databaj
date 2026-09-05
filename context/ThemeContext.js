'use client';

import { createContext, useContext, useEffect, useSyncExternalStore } from 'react';

const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => {},
});

function applyTheme(newTheme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(newTheme);
  root.setAttribute('data-theme', newTheme);
  root.style.colorScheme = newTheme;
}

const themeListeners = new Set();
function subscribe(callback) {
  themeListeners.add(callback);
  return () => themeListeners.delete(callback);
}

function getSnapshot() {
  if (typeof window === 'undefined') return 'dark';
  return localStorage.getItem('databaj_theme') || 'dark';
}

function getServerSnapshot() {
  return 'dark';
}

export function ThemeProvider({ children }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    if (typeof window !== 'undefined') {
      localStorage.setItem('databaj_theme', nextTheme);
    }
    applyTheme(nextTheme);
    themeListeners.forEach((listener) => listener());
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
