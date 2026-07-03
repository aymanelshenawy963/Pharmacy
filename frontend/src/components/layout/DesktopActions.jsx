import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOut, User, LayoutDashboard, ShoppingCart, Search, X, ChevronDown } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';

export default function DesktopActions({ user, isAuthenticated, isAdmin, cartCount, onLogout, searchQuery, setSearchQuery, searchOpen, setSearchOpen, onSearch }) {
    const inputRef = useRef(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (searchOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [searchOpen]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dropdownOpen]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                setDropdownOpen(false);
            }
        };
        if (dropdownOpen) {
            document.addEventListener('keydown', handleEscape);
        }
        return () => document.removeEventListener('keydown', handleEscape);
    }, [dropdownOpen]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') {
            setSearchOpen(false);
            setSearchQuery('');
        }
    }, [setSearchOpen, setSearchQuery]);

    return (
        <div className="hidden items-center gap-2 lg:flex">
            {/* Search Icon / Expandable Input */}
            <div className="relative flex items-center">
                <AnimatePresence mode="wait">
                    {searchOpen ? (
                        <motion.form
                            key="search-input"
                            onSubmit={(e) => { onSearch(e); setSearchOpen(false); }}
                            initial={{ width: 36, opacity: 0.6 }}
                            animate={{ width: 520, opacity: 1 }}
                            exit={{ width: 36, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                            className="flex items-center overflow-hidden"
                        >
                            <div className="relative flex items-center w-full">
                                <Search
                                    size={15}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-primary))] pointer-events-none"
                                />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Search medicines..."
                                    className="w-full rounded-full border border-[rgb(var(--color-primary))]/30 bg-[rgb(var(--color-surface))] py-2 pl-9 pr-8 text-[13px] font-medium text-[rgb(var(--color-text))] placeholder:text-[rgb(var(--color-text-muted))] focus:outline-none focus:border-[rgb(var(--color-primary))] focus:shadow-[0_0_0_3px_rgba(13,148,136,0.1)] transition-all duration-300"
                                    aria-label="Search medicines"
                                />
                                <button
                                    type="button"
                                    onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] transition-colors duration-200"
                                    aria-label="Close search"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        </motion.form>
                    ) : (
                        <motion.button
                            key="search-icon"
                            type="button"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSearchOpen(true)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-primary))] active:scale-90 transition-all duration-300"
                            aria-label="Open search"
                        >
                            <Search size={18} strokeWidth={1.8} />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {/* Cart */}
            <Link
                to="/cart"
                className="relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13.5px] font-medium text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-primary))] transition-all duration-300 active:scale-[0.97]"
            >
                <ShoppingCart size={17} strokeWidth={1.8} />
                <span className="hidden xl:inline">Cart</span>
                <AnimatePresence>
                    {cartCount > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                            className="absolute -top-1.5 -right-1.5 flex h-[20px] min-w-[20px] items-center justify-center rounded-full bg-[rgb(var(--color-primary))] px-1 text-[9px] font-bold text-white shadow-sm ring-2 ring-[rgb(var(--color-surface))]"
                        >
                            {cartCount}
                        </motion.span>
                    )}
                </AnimatePresence>
            </Link>

            {/* Divider */}
            <div className="w-px h-5 bg-[rgb(var(--color-border))] mx-0.5" />

            {/* Auth Section */}
            {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen((v) => !v)}
                        className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[13px] font-medium text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary-dark))] transition-all duration-300 active:scale-[0.97]"
                    >
                        <User size={18} strokeWidth={1.8} />
                        <span className="hidden xl:inline max-w-[80px] truncate">{user?.firstName}</span>
                        <ChevronDown
                            size={14}
                            className={`hidden xl:block transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                        />
                    </button>

                    <AnimatePresence>
                        {dropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                                className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] py-1.5 shadow-[var(--shadow-lg)]"
                            >
                                <div className="px-3.5 py-2.5 border-b border-[rgb(var(--color-border))]">
                                    <p className="text-[13px] font-semibold text-[rgb(var(--color-text))] truncate">{user?.firstName} {user?.lastName}</p>
                                    <p className="text-[11px] text-[rgb(var(--color-text-muted))] truncate mt-0.5">{user?.email}</p>
                                </div>

                                <div className="py-1">
                                    <Link
                                        to="/account/profile"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-2.5 px-3.5 py-2 text-[13px] font-medium text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary))]/[0.04] transition-colors duration-200"
                                    >
                                        <User size={15} strokeWidth={1.8} />
                                        Profile
                                    </Link>

                                    {isAdmin && (
                                        <Link
                                            to="/admin/products"
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-3.5 py-2 text-[13px] font-medium text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary))]/[0.04] transition-colors duration-200"
                                        >
                                            <LayoutDashboard size={15} strokeWidth={1.8} />
                                            Dashboard
                                        </Link>
                                    )}
                                </div>

                                <div className="border-t border-[rgb(var(--color-border))] pt-1">
                                    <button
                                        onClick={() => { setDropdownOpen(false); onLogout(); }}
                                        className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] font-medium text-[rgb(var(--color-text-muted))] hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors duration-200"
                                    >
                                        <LogOut size={15} strokeWidth={1.8} />
                                        Sign Out
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ) : (
                <Link
                    to="/login"
                    className="flex items-center gap-2 rounded-full bg-[rgb(var(--color-primary))] px-5 py-2 text-[13px] font-semibold text-white hover:bg-[rgb(var(--color-primary-dark))] active:scale-[0.97] transition-all duration-300"
                >
                    <User size={14} strokeWidth={2} />
                    Sign In
                </Link>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />
        </div>
    );
}
