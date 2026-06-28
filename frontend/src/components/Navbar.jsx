import { memo, useEffect, useState, useCallback } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { footerLinks } from '../data/store';
import Icon from './Icons';
import ThemeToggle from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LogOut,
    User,
    LayoutDashboard,
    ShoppingCart,
    Pill,
    FileText,
    Phone,
    Info,
    HelpCircle,
    ChevronRight,
    Shield,
    X,
} from 'lucide-react';
import toast from 'react-hot-toast';

const navLinks = footerLinks.filter((link) => link.label !== 'Home');

const shoppingLinks = [
    { label: 'Products', to: '/products', icon: Pill },
    { label: 'Prescription', to: '/prescription', icon: FileText },
];

const supportLinks = [
    { label: 'About', to: '/about', icon: Info },
    { label: 'FAQ', to: '/faq', icon: HelpCircle },
    { label: 'Contact', to: '/contact', icon: Phone },
];

function SectionTitle({ children }) {
    return (
        <p className="px-1 pt-5 pb-2 text-[11px] font-semibold uppercase tracking-widest text-[rgb(var(--color-text-muted))]">
            {children}
        </p>
    );
}

const MobileNavLink = memo(function MobileNavLink({ to, icon: IconComp, label, badge }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-medium transition-all duration-200 min-h-[48px] group ${
                    isActive
                        ? 'bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]'
                        : 'text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-subtle))]'
                }`
            }
        >
            {({ isActive }) => (
                <>
                    <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${
                            isActive
                                ? 'bg-[rgb(var(--color-primary))]/15 text-[rgb(var(--color-primary))]'
                                : 'bg-[rgb(var(--color-bg-subtle))] text-[rgb(var(--color-text-muted))] group-hover:bg-[rgb(var(--color-primary))]/10 group-hover:text-[rgb(var(--color-primary))]'
                        }`}
                    >
                        <IconComp size={18} />
                    </span>
                    <span className="flex-1">{label}</span>
                    {badge != null && badge > 0 && (
                        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[rgb(var(--color-secondary))] px-1.5 text-[10px] font-bold text-white">
                            {badge}
                        </span>
                    )}
                    <ChevronRight
                        size={16}
                        className="text-[rgb(var(--color-text-muted))] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    />
                </>
            )}
        </NavLink>
    );
});

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

    const handleLogout = useCallback(() => {
        logout();
        setMenuOpen(false);
        toast.success('You have been signed out. See you next time!', {
            icon: '\uD83D\uDC4B',
            duration: 3000,
        });
        navigate('/');
    }, [logout, navigate]);

    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [menuOpen]);

    const initials = (
        (user?.firstName?.[0] || '') + (user?.lastName?.[0] || '')
    ).toUpperCase() || '?';

    return (
        <header
            className={`sticky top-0 z-50 border-b transition-all duration-300 ${
                scrolled
                    ? 'border-[rgb(var(--color-border))] bg-[var(--glass-bg)] backdrop-blur-md shadow-[var(--shadow-md)]'
                    : 'border-transparent bg-transparent backdrop-blur-none shadow-none'
            }`}
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2.5 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group shrink-0">
                    <div className="bg-[rgb(var(--color-primary))]/10 p-2 rounded-xl group-hover:bg-[rgb(var(--color-primary))]/20 transition-all duration-300 group-hover:shadow-[var(--shadow-glow)]">
                        <Icon name="Activity" className="h-5 w-5 text-[rgb(var(--color-primary))]" />
                    </div>
                    <p className="font-serif text-base sm:text-lg font-bold tracking-tight text-[#00685f] dark:text-[#38b2ac]">
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
            </div>

            {/* Mobile slide-in drawer */}
            <AnimatePresence>
                {menuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
                            onClick={() => setMenuOpen(false)}
                            aria-hidden="true"
                        />

                        {/* Drawer panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                            className="fixed inset-y-0 right-0 z-50 flex w-[min(85vw,360px)] flex-col bg-[rgb(var(--color-surface))] shadow-2xl lg:hidden"
                        >
                            {/* Drawer header */}
                            <div className="flex items-center justify-between border-b border-[rgb(var(--color-border))] px-5 py-4">
                                <p className="font-serif text-base font-bold text-[rgb(var(--color-text))]">
                                    Menu
                                </p>
                                <button
                                    onClick={() => setMenuOpen(false)}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-bg-subtle))] hover:text-[rgb(var(--color-text))] transition-all duration-200"
                                    aria-label="Close menu"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Drawer body */}
                            <div className="flex-1 overflow-y-auto px-4 pb-6">
                                {/* Profile card */}
                                {isAuthenticated ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.05, duration: 0.35 }}
                                    >
                                        <Link
                                            to="/account/profile"
                                            onClick={() => setMenuOpen(false)}
                                            className="mt-4 flex items-center gap-3.5 rounded-2xl bg-[rgb(var(--color-bg-subtle))] p-4 transition-all duration-200 hover:shadow-[var(--shadow-sm)]"
                                        >
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[rgb(var(--color-primary))]/20 to-[rgb(var(--color-primary))]/5 text-[rgb(var(--color-primary))] text-base font-bold ring-2 ring-[rgb(var(--color-primary))]/15">
                                                {initials}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-semibold text-[rgb(var(--color-text))] truncate">
                                                    {user?.firstName} {user?.lastName}
                                                </p>
                                                <p className="text-xs text-[rgb(var(--color-text-muted))] truncate mt-0.5">
                                                    {user?.email}
                                                </p>
                                            </div>
                                            {isAdmin && (
                                                <span className="flex items-center gap-1 shrink-0 rounded-full bg-[rgb(var(--color-primary))]/10 px-2 py-0.5 text-[10px] font-semibold text-[rgb(var(--color-primary))]">
                                                    <Shield size={10} />
                                                    Admin
                                                </span>
                                            )}
                                        </Link>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.05, duration: 0.35 }}
                                        className="mt-4"
                                    >
                                        <Link
                                            to="/login"
                                            onClick={() => setMenuOpen(false)}
                                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[rgb(var(--color-primary))] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_4px_14px_0_rgba(13,148,136,0.39)] hover:opacity-90 transition-opacity min-h-[48px]"
                                        >
                                            <User size={18} />
                                            Sign In
                                        </Link>
                                    </motion.div>
                                )}

                                {/* Shopping section */}
                                <SectionTitle>Shopping</SectionTitle>
                                <div className="flex flex-col gap-1">
                                    <MobileNavLink
                                        to={shoppingLinks[0].to}
                                        icon={shoppingLinks[0].icon}
                                        label={shoppingLinks[0].label}
                                    />
                                    <MobileNavLink
                                        to="/cart"
                                        icon={ShoppingCart}
                                        label="Cart"
                                        badge={cartCount}
                                    />
                                    <MobileNavLink
                                        to={shoppingLinks[1].to}
                                        icon={shoppingLinks[1].icon}
                                        label={shoppingLinks[1].label}
                                    />
                                </div>

                                {/* Support section */}
                                <SectionTitle>Support</SectionTitle>
                                <div className="flex flex-col gap-1">
                                    {supportLinks.map((link) => (
                                        <MobileNavLink
                                            key={link.to}
                                            to={link.to}
                                            icon={link.icon}
                                            label={link.label}
                                        />
                                    ))}
                                </div>

                                {/* Admin section */}
                                {isAdmin && (
                                    <>
                                        <SectionTitle>Admin</SectionTitle>
                                        <div className="flex flex-col gap-1">
                                            <MobileNavLink
                                                to="/admin/products"
                                                icon={LayoutDashboard}
                                                label="Dashboard"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Drawer footer — Sign Out */}
                            {isAuthenticated && (
                                <div className="border-t border-[rgb(var(--color-border))] px-4 py-4">
                                    <motion.button
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        onClick={handleLogout}
                                        className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50/80 dark:bg-red-900/10 px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors duration-200 min-h-[48px]"
                                    >
                                        <LogOut size={18} />
                                        Sign Out
                                    </motion.button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
}
