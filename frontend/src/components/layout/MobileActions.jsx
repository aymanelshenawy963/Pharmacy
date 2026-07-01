import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';
import Icon from '../Icons';

export default function MobileActions({ cartCount, menuOpen, setMenuOpen }) {
    return (
        <div className="flex items-center gap-0.5 lg:hidden">
            <Link
                to="/cart"
                className="relative flex items-center justify-center h-10 w-10 rounded-xl text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-bg-subtle))] hover:text-[rgb(var(--color-text))] active:scale-95 transition-all duration-200"
            >
                <ShoppingCart size={20} />
                <AnimatePresence>
                    {cartCount > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute top-1 right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[rgb(var(--color-secondary))] px-1 text-[9px] font-bold text-white shadow-sm"
                        >
                            {cartCount}
                        </motion.span>
                    )}
                </AnimatePresence>
            </Link>

            <ThemeToggle />

            <button
                type="button"
                className="flex items-center justify-center h-10 w-10 rounded-xl text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-bg-subtle))] hover:text-[rgb(var(--color-text))] active:scale-95 transition-all duration-200"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
            >
                <motion.div
                    animate={{ rotate: menuOpen ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <Icon name={menuOpen ? 'X' : 'Menu'} className="h-5 w-5" />
                </motion.div>
            </button>
        </div>
    );
}
