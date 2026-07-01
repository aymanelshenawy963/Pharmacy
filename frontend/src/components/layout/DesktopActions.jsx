import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOut, User, LayoutDashboard, ShoppingCart } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';

export default function DesktopActions({ user, isAuthenticated, isAdmin, cartCount, onLogout }) {
    return (
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
                        onClick={onLogout}
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
    );
}
