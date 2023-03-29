import { createContext, useState } from 'react';

interface ThemeContextProps {
  darkTheme: boolean;
  toggleTheme: () => void;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [darkTheme, setDarkTheme] = useState<boolean>(localStorage.getItem('darkTheme') === 'true');
  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  }

  return (
    <ThemeContext.Provider value={{ darkTheme, toggleTheme }} >
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider;