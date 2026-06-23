import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { footerLinks } from '../data/products';
import Icon from './Icons';
import ThemeToggle from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = footerLinks.filter((link) => link.label !== 'Home');

export default function Navbar() {
    const { cartCount } = useCart();
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-[var(--glass-bg)] backdrop-blur-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.4)] transition-colors duration-300">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
                        <Icon name="Activity" className="h-6 w-6 text-primary" />
                    </div>
                    <p className="font-serif text-xl font-bold tracking-tight text-[#00685f] dark:text-[#38b2ac]">Jaya Medical Store</p>
                </Link>

                <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary navigation">
                    <NavLink to="/" className={({ isActive }) => navLinkClass(isActive)}>
                        Home
                    </NavLink>
                    {navLinks.map((link) => (
                        <NavLink key={link.to} to={link.to} className={({ isActive }) => navLinkClass(isActive)}>
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="hidden items-center gap-4 lg:flex">
                    <ThemeToggle />
                    <Link
                        to="/cart"
                        className="glass-button bg-surface text-text hover:bg-bg-subtle relative"
                    >
                        <Icon name="ShoppingCart" className="h-5 w-5" />
                        <span>Cart</span>
                        <AnimatePresence>
                            {cartCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-white shadow-sm"
                                >
                                    {cartCount}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>
                </div>

                <div className="flex items-center gap-2 lg:hidden">
                    <ThemeToggle />
                    <button
                        type="button"
                        className="p-2 rounded-xl bg-surface text-text hover:bg-bg-subtle transition-colors"
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={menuOpen}
                        onClick={() => setMenuOpen((value) => !value)}
                    >
                        <Icon name={menuOpen ? 'X' : 'Menu'} className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {menuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-border bg-[var(--glass-bg)] backdrop-blur-xl lg:hidden overflow-hidden"
                    >
                        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
                            <div className="flex flex-col gap-2">
                                <NavLink to="/" className={({ isActive }) => mobileNavClass(isActive)}>
                                    Home
                                </NavLink>
                                {navLinks.map((link) => (
                                    <NavLink key={link.to} to={link.to} className={({ isActive }) => mobileNavClass(isActive)}>
                                        {link.label}
                                    </NavLink>
                                ))}
                                <NavLink to="/cart" className={({ isActive }) => mobileNavClass(isActive)}>
                                    <span className="flex items-center justify-between w-full">
                                        Cart
                                        {cartCount > 0 && (
                                            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-white">{cartCount}</span>
                                        )}
                                    </span>
                                </NavLink>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

const navLinkClass = (isActive) =>
    [
        'text-sm font-medium transition-colors relative',
        isActive ? 'text-primary after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-full after:bg-primary after:rounded-full' : 'text-text-muted hover:text-text',
    ].join(' ');

const mobileNavClass = (isActive) =>
    [
        'flex items-center p-3 rounded-xl text-sm font-medium transition-colors',
        isActive ? 'bg-primary/10 text-primary' : 'text-text hover:bg-bg-subtle',
    ].join(' ');