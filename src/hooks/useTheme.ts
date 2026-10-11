import { createContext, useContext } from "react";

export type Theme = "light" | "dark";

export interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

// The context lives with the hook that reads it, in a file that exports no
// components, so fast refresh keeps working (see ThemeProvider for the value).
export const ThemeContext = createContext<ThemeContextValue | null>(null);

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
};
