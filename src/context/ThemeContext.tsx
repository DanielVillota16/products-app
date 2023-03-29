import { ConfigProvider } from 'antd';
import { createContext, useEffect, useMemo, useState } from 'react';

interface ThemeContextProps {
  darkTheme: boolean;
  toggleTheme: () => void;
  currentTheme: ThemeProps;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

interface ThemeProps {
  colorTextBase: string;
  colorPrimary: string;
  colorBgBase: string;
}

interface ThemeOption {
  dark: ThemeProps;
  light: ThemeProps;
}

const themes: ThemeOption = {
  dark: {
    colorTextBase: "#b7dcfa",
    colorPrimary: "#1554ad",
    colorBgBase: "#111a2c",
  },
  light: {
    colorTextBase: "#111a2c",
    colorPrimary: "#1554ad",
    colorBgBase: "#ecf5fa",
  }
}

const ThemeContext = createContext<ThemeContextProps>({} as ThemeContextProps);

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [darkTheme, setDarkTheme] = useState<boolean>(localStorage.getItem('darkTheme') === 'true');
  const currentTheme: ThemeProps = useMemo(() => darkTheme ? themes.dark : themes.light, [darkTheme]);

  useEffect(() => {
    localStorage['darkTheme'] = darkTheme;
  }, [darkTheme]);

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  }

  return (
    <ThemeContext.Provider value={{ darkTheme, currentTheme, toggleTheme }} >
      <ConfigProvider
        theme={{
          token: currentTheme
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  )
}

export { ThemeContext, ThemeProvider };