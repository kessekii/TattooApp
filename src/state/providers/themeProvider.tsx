import React, { createContext, useState, useContext } from 'react';
import themes from "../../utils/theme"
export interface ThemeContextType {
  theme: string;
  themevars: any;
  toggleTheme: () => void;
}

// Создание контекста с указанием типов
const ThemeToggleContext = createContext<ThemeContextType>({ theme: 'light', themevars: themes.lightTheme, toggleTheme: () => { } });

// Провайдер для переключения тем
export const ThemeToggleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<string>('light');


  const toggleTheme = () => {
    setCurrentTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeToggleContext.Provider value={{ theme: currentTheme, themevars: currentTheme == 'light' ? themes.lightTheme : themes.darkTheme, toggleTheme }} >
      {children}
    </ThemeToggleContext.Provider>
  );
};

export default ThemeToggleProvider;
// Хук для использования контекста
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeToggleContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeToggleProvider');
  }
  return context;
};