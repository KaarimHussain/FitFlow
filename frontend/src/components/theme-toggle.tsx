import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="rounded-md p-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon size={15}/>
      ) : (
        <Sun size={15} />
      )}
    </button>
  );
}