import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  status: {
    success: string;
    warning: string;
    error: string;
  }
}

const defaultTheme: ThemeColors = {
  primary: '#1a73e8',
  secondary: '#4285f4',
  background: '#ffffff',
  surface: '#f8f9fa',
  text: '#202124',
  textSecondary: '#5f6368',
  border: '#dadce0',
  status: {
    success: '#137333',
    warning: '#ea8600',
    error: '#c5221f'
  }
};

interface ThemeContextType {
  colors: ThemeColors;
  setColors: (colors: ThemeColors) => void;
  isDark: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [colors, setColors] = useState<ThemeColors>(defaultTheme);
  const [isDark, setIsDark] = useState(false);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    // Apply dark mode colors here
    setColors(prev => ({
      ...prev,
      background: isDark ? '#ffffff' : '#202124',
      surface: isDark ? '#f8f9fa' : '#303134',
      text: isDark ? '#202124' : '#ffffff',
      textSecondary: isDark ? '#5f6368' : '#9aa0a6',
      border: isDark ? '#dadce0' : '#3c4043',
    }));
  };

  // Apply CSS variables whenever colors change
  React.useEffect(() => {
    const root = document.documentElement;
    Object.entries(colors).forEach(([key, value]) => {
      if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          root.style.setProperty(`--color-${key}-${subKey}`, subValue);
        });
      } else {
        root.style.setProperty(`--color-${key}`, value);
      }
    });
  }, [colors]);

  return (
    <ThemeContext.Provider value={{ colors, setColors, isDark, toggleDarkMode }}>
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