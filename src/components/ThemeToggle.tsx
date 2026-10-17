import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import styles from "./ThemeToggle.module.css";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const next = theme === "light" ? "dark" : "light";

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label={`Switch to ${next} theme`}
    >
      {theme === "light" ? (
        <Moon aria-hidden="true" size={20} strokeWidth={1.75} />
      ) : (
        <Sun aria-hidden="true" size={20} strokeWidth={1.75} />
      )}
    </button>
  );
};
