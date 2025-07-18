import React, { createContext, useContext, useState } from 'react';
import { DarkTheme, LightTheme } from '../constants/theme.ts';

type ThemeType = typeof DarkTheme;

interface ThemeContextProps {
  theme: ThemeType;
  themeName: 'dark' | 'light';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: DarkTheme,
  themeName: 'dark',
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState(DarkTheme);
  const [themeName, setThemeName] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => {
    if (themeName === 'dark') {
      setTheme(LightTheme);
      setThemeName('light');
    } else {
      setTheme(DarkTheme);
      setThemeName('dark');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, themeName, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
