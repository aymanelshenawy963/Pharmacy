import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center h-10 w-10 rounded-xl text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-bg-subtle))] hover:text-[rgb(var(--color-text))] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]/50 overflow-hidden"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative w-5 h-5">
        <span
          className={`absolute inset-0 text-[rgb(var(--color-primary))] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            theme === 'dark'
              ? 'opacity-100 scale-100 rotate-0'
              : 'opacity-0 scale-0 rotate-90'
          }`}
        >
          <Moon size={20} />
        </span>
        <span
          className={`absolute inset-0 text-[rgb(var(--color-primary))] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            theme === 'light'
              ? 'opacity-100 scale-100 rotate-0'
              : 'opacity-0 scale-0 -rotate-90'
          }`}
        >
          <Sun size={20} />
        </span>
      </div>
    </button>
  );
};

export default ThemeToggle;
