import { useState } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  const handleToggle = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <button
      onClick={handleToggle}
      className={`w-12 h-12 flex items-center justify-center rounded-full transition-colors duration-300
        ${isDark ? 'bg-orange-500 text-white' : 'bg-neutral-800 text-neutral-400'}
      `}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default ThemeToggle;
