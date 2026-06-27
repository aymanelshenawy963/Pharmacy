import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { footerLinks } from '../data/products';
import Icon from './Icons';
import ThemeToggle from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, LayoutDashboard, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

const navLinks = footerLinks.filter((link) => link.label !== 'Home');

export default function Navbar() {
    const { cartCount } = useCart();
    const { user, isAuthenticated, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const isAdmin = user?.roles?.includes('Admin');
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleLogout = () => {
        logout();
        toast.success('You have been signed out. See you next time!', {
            icon: '\uD83D\uDC4B',
            duration: 3000,
        });
        navigate('/');
    };

    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    return (
        <header
            className={`sticky top-0 z-50 border-b transition-all duration-300 ${
                scrolled
                    ? 'border-[rgb(var(--color-border))] bg-[var(--glass-bg)] backdrop-blur-xl shadow-[var(--shadow-md)]'
                    : 'border-transparent bg-transparent backdrop-blur-none shadow-none'
            }`}
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 group shrink-0">
                    <div className="bg-[rgb(var(--color-primary))]/10 p-2 rounded-xl group-hover:bg-[rgb(var(--color-primary))]/20 transition-all duration-300 group-hover:shadow-[var(--shadow-glow)]">
                        <Icon name="Activity" className="h-5 w-5 text-[rgb(var(--color-primary))]" />
                    </div>
                    <p className="font-serif text-lg font-bold tracking-tight text-[#00685f] dark:text-[#38b2ac] hidden sm:block">
                        Jaya Medical Store
                    </p>
                </Link>

                {/* Desktop nav links */}
                <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                `relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    isActive
                                        ? 'text-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/8'
                                        : 'text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-subtle))]'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {link.label}
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-indicator"
                                            className="absolute bottom-0 left-3 right-3 h-0.5 bg-[rgb(var(--color-primary))] rounded-full"
                                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Desktop right actions */}
                <div className="hidden items-center gap-2 lg:flex">
                    <Link
                        to="/cart"
                        className="relative flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-subtle))] transition-all duration-200"
                    >
                        <ShoppingCart size={18} />
                        <span>Cart</span>
                        <AnimatePresence>
                            {cartCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[rgb(var(--color-secondary))] px-1 text-[10px] font-bold text-white shadow-sm"
                                >
                                    {cartCount}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>

                    {isAdmin && (
                        <NavLink
                            to="/admin/products"
                            className={({ isActive }) =>
                                `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    isActive
                                        ? 'text-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/8 shadow-[var(--shadow-glow)]'
                                        : 'text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-subtle))]'
                                }`
                            }
                        >
                            <LayoutDashboard size={16} />
                            Dashboard
                        </NavLink>
                    )}

                    <div className="w-px h-5 bg-[rgb(var(--color-border))]" />

                    {isAuthenticated ? (
                        <div className="flex items-center gap-2">
                            <Link
                                to="/account/profile"
                                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-[rgb(var(--color-text))] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-sm)] transition-all duration-200"
                            >
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[rgb(var(--color-primary))]/10">
                                    <User size={12} className="text-[rgb(var(--color-primary))]" />
                                </div>
                                <span className="hidden xl:inline">{user?.firstName}</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="glass-icon-button !w-9 !h-9"
                                title="Sign Out"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="glass-button-primary !px-5 !py-2 !text-sm"
                        >
                            Sign In
                        </Link>
                    )}

                    <ThemeToggle />
                </div>

                {/* Mobile right actions */}
                <div className="flex items-center gap-1 lg:hidden">
                    <Link
                        to="/cart"
                        className="relative flex items-center justify-center h-10 w-10 rounded-xl text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-bg-subtle))] hover:text-[rgb(var(--color-text))] transition-all duration-200"
                    >
                        <ShoppingCart size={20} />
                        <AnimatePresence>
                            {cartCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[rgb(var(--color-secondary))] px-1 text-[9px] font-bold text-white shadow-sm"
                                >
                                    {cartCount}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>

                    <button
                        type="button"
                        className="flex items-center justify-center h-10 w-10 rounded-xl text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-bg-subtle))] hover:text-[rgb(var(--color-text))] transition-all duration-200"
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={menuOpen}
                        onClick={() => setMenuOpen((v) => !v)}
                    >
                        <Icon name={menuOpen ? 'X' : 'Menu'} className="h-5 w-5" />
                    </button>

                    <ThemeToggle />
                </div>
            </div>

            {/* Mobile menu dropdown */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                        className="border-t border-[rgb(var(--color-border))] bg-[var(--glass-bg)] backdrop-blur-xl lg:hidden overflow-hidden"
                    >
                        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
                            <div className="flex flex-col gap-0.5">
                                {/* Auth section first */}
                                {isAuthenticated ? (
                                    <>
                                        <motion.div
                                            initial={{ opacity: 0, x: -12 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0 }}
                                            className="flex items-center gap-3 px-3 py-3"
                                        >
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgb(var(--color-primary))]/10">
                                                <User size={18} className="text-[rgb(var(--color-primary))]" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-[rgb(var(--color-text))] truncate">
                                                    {user?.firstName} {user?.lastName}
                                                </p>
                                                <p className="text-xs text-[rgb(var(--color-text-muted))] truncate">{user?.email}</p>
                                            </div>
                                        </motion.div>

                                        {isAdmin && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -12 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.05 }}
                                            >
                                                <NavLink
                                                    to="/admin/products"
                                                    className={({ isActive }) =>
                                                        `flex items-center gap-2.5 p-3 rounded-xl text-sm font-medium transition-colors ${
                                                            isActive
                                                                ? 'bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]'
                                                                : 'text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-subtle))]'
                                                        }`
                                                    }
                                                >
                                                    <LayoutDashboard size={18} />
                                                    Dashboard
                                                </NavLink>
                                            </motion.div>
                                        )}

                                        <motion.div
                                            initial={{ opacity: 0, x: -12 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 }}
                                        >
                                            <button
                                                onClick={handleLogout}
                                                className="flex w-full items-center gap-2.5 p-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                                            >
                                                <LogOut size={18} />
                                                Sign Out
                                            </button>
                                        </motion.div>
                                    </>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, x: -12 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0 }}
                                    >
                                        <Link
                                            to="/login"
                                            className="flex w-full items-center justify-center p-3 rounded-xl text-sm font-medium bg-[rgb(var(--color-primary))] text-white hover:opacity-90 transition-opacity shadow-[0_4px_14px_0_rgba(13,148,136,0.39)]"
                                        >
                                            Sign In
                                        </Link>
                                    </motion.div>
                                )}

                                <div className="my-2 border-t border-[rgb(var(--color-border))]" />

                                {/* Navigation links */}
                                {navLinks.map((link, i) => (
                                    <motion.div
                                        key={link.to}
                                        initial={{ opacity: 0, x: -12 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.15 + i * 0.04 }}
                                    >
                                        <NavLink
                                            to={link.to}
                                            className={({ isActive }) =>
                                                `flex items-center p-3 rounded-xl text-sm font-medium transition-colors ${
                                                    isActive
                                                        ? 'bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]'
                                                        : 'text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-subtle))]'
                                                }`
                                            }
                                        >
                                            {link.label}
                                        </NavLink>
                                    </motion.div>
                                ))}

                                {/* Cart link with badge */}
                                <motion.div
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.15 + navLinks.length * 0.04 }}
                                >
                                    <NavLink
                                        to="/cart"
                                        className={({ isActive }) =>
                                            `flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-colors ${
                                                isActive
                                                    ? 'bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]'
                                                    : 'text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-subtle))]'
                                            }`
                                        }
                                    >
                                        <span className="flex items-center gap-2.5">
                                            <ShoppingCart size={18} />
                                            Cart
                                        </span>
                                        {cartCount > 0 && (
                                            <span className="rounded-full bg-[rgb(var(--color-secondary))] px-2 py-0.5 text-xs text-white font-bold">
                                                {cartCount}
                                            </span>
                                        )}
                                    </NavLink>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
