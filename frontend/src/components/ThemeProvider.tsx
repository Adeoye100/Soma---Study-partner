import React from 'react';
import { ThemeProvider as BaseThemeProvider, useTheme } from '../context/ThemeContext';

export { useTheme };

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <BaseThemeProvider>{children}</BaseThemeProvider>;
}
