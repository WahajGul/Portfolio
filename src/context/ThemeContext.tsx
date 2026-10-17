import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ThemeContext, type Theme } from "../hooks/useTheme";

const STORAGE_KEY = "theme";

const isTheme = (value: string | null): value is Theme =>
  value === "light" || value === "dark";

/** Stored choice only; null means "follow the OS". Wrapped: localStorage can throw. */
const readStoredTheme = (): Theme | null => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isTheme(stored) ? stored : null;
  } catch {
    return null;
  }
};

const detectSystemTheme = (): Theme =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [preference, setPreference] = useState<Theme | null>(readStoredTheme);
  const [system, setSystem] = useState<Theme>(detectSystemTheme);
  const theme = preference ?? system;

  // Follow the OS while the user has made no explicit choice.
  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) => {
      setSystem(event.matches ? "dark" : "light");
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  // Apply instantly: flip the attribute, then point the theme-color meta at
  // the resulting --background. No crossfade, no color transition anywhere.
  // The inline script in index.html already did this before first paint; this
  // effect keeps it correct after any later change.
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;

    const background = getComputedStyle(root).getPropertyValue("--background").trim();
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta && background) {
      meta.setAttribute("content", background);
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setPreference(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage unavailable (private mode): the choice holds for this visit.
    }
  }, [theme]);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
