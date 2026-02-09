import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = '@holy_scriptures_theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeType>('light');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_KEY);
      if (saved) {
        setThemeState(saved as ThemeType);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const setTheme = async (newTheme: ThemeType) => {
    try {
      setThemeState(newTheme);
      await AsyncStorage.setItem(THEME_KEY, newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        isDark: theme === 'dark',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
