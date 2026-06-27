import { motion } from 'framer-motion';
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
        <motion.div
          initial={false}
          animate={{
            scale: theme === 'dark' ? 1 : 0,
            opacity: theme === 'dark' ? 1 : 0,
            rotate: theme === 'dark' ? 0 : 90
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          className="absolute inset-0 text-[rgb(var(--color-primary))]"
        >
          <Moon size={20} />
        </motion.div>
        
        <motion.div
          initial={false}
          animate={{
            scale: theme === 'light' ? 1 : 0,
            opacity: theme === 'light' ? 1 : 0,
            rotate: theme === 'light' ? 0 : -90
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          className="absolute inset-0 text-[rgb(var(--color-primary))]"
        >
          <Sun size={20} />
        </motion.div>
      </div>
    </button>
  );
};

export default ThemeToggle;
