import { useTheme } from "../../contexts/ThemeContext.jsx";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-neutral-800 transition-colors"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-blue-600" />}
    </button>
  );
};

export default ThemeToggle;
