import React, { createContext, useState, useContext, useEffect } from "react";
import themes from "../../utils/theme";
import useLocalStorage from "../../../src/hooks/useLocalStorage";
export interface ThemeContextType {
  theme: string;
  themevars: any;
  toggleTheme: () => void;
}

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

// Создание контекста с указанием типов
const ThemeToggleContext = createContext<ThemeContextType>({
  theme: "light",
  themevars: themes.lightTheme,
  toggleTheme: () => {},
});

// Провайдер для переключения тем
export const ThemeToggleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isThemeDark, setCurrentTheme] = useLocalStorage("theme", false);

  const toggleTheme = () => {
    setCurrentTheme(isThemeDark ? false : true);
  };

  return (
    <ThemeToggleContext.Provider
      value={{
        theme: isThemeDark,
        themevars: !isThemeDark ? themes.lightTheme : themes.darkTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeToggleContext.Provider>
  );
};

export default ThemeToggleProvider;
// Хук для использования контекста
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeToggleContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeToggleProvider");
  }
  return context;
};
