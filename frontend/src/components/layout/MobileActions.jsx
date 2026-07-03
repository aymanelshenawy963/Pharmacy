import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingCart, Search } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';
import Icon from '../Icons';

export default function MobileActions({ cartCount, menuOpen, setMenuOpen }) {
    return (
        <div className="flex items-center gap-1 lg:hidden">
            {/* Cart */}
            <Link
                to="/cart"
                className="relative flex items-center justify-center h-11 w-11 rounded-xl text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-primary))] active:scale-90 transition-all duration-300"
                aria-label={`Shopping cart, ${cartCount} items`}
            >
                <ShoppingCart size={20} strokeWidth={1.8} />
                <AnimatePresence>
                    {cartCount > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                            className="absolute top-1.5 right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[rgb(var(--color-primary))] px-1 text-[9px] font-bold text-white shadow-sm ring-[1.5px] ring-[rgb(var(--color-surface))]"
                        >
                            {cartCount}
                        </motion.span>
                    )}
                </AnimatePresence>
            </Link>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Hamburger Menu */}
            <button
                type="button"
                className="flex items-center justify-center h-11 w-11 rounded-xl text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-primary))] active:scale-90 transition-all duration-300"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
            >
                <div className="relative h-5 w-5">
                    <motion.span
                        animate={menuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -6 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        className="absolute left-0 top-1/2 h-[1.5px] w-5 origin-center bg-current rounded-full"
                    />
                    <motion.span
                        animate={menuOpen ? { opacity: 0, x: -4 } : { opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 top-1/2 h-[1.5px] w-5 -translate-y-1/2 bg-current rounded-full"
                    />
                    <motion.span
                        animate={menuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 6 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        className="absolute left-0 top-1/2 h-[1.5px] w-5 origin-center bg-current rounded-full"
                    />
                </div>
            </button>
        </div>
    );
}
