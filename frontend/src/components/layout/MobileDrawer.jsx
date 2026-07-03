import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOut, User, LayoutDashboard, ShoppingCart, Package, ChevronRight, Shield, X, Search } from 'lucide-react';
import { shoppingLinks, supportLinks } from '../../constants/navigation';

function SectionTitle({ children }) {
    return (
        <div className="flex items-center gap-3 px-1 pt-5 pb-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[rgb(var(--color-text-muted))]">
                {children}
            </p>
            <div className="flex-1 h-px bg-[rgb(var(--color-border))]" />
        </div>
    );
}

const MobileNavLink = memo(function MobileNavLink({ to, icon: IconComp, label, badge, index = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 + index * 0.04, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
            <NavLink
                to={to}
                className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3.5 py-3 text-[15px] font-medium transition-all duration-300 min-h-[48px] group ${
                        isActive
                            ? 'bg-[rgb(var(--color-primary))]/[0.08] text-[rgb(var(--color-primary))]'
                            : 'text-[rgb(var(--color-text))] active:scale-[0.98]'
                    }`
                }
            >
                {({ isActive }) => (
                    <>
                        <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${
                                isActive
                                    ? 'bg-[rgb(var(--color-primary))]/15 text-[rgb(var(--color-primary))]'
                                    : 'bg-[rgb(var(--color-bg-subtle))] text-[rgb(var(--color-text-muted))]'
                            }`}
                        >
                            <IconComp size={18} strokeWidth={1.8} />
                        </span>
                        <span className="flex-1">{label}</span>
                        {badge != null && badge > 0 && (
                            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[rgb(var(--color-primary))] px-1.5 text-[10px] font-bold text-white shadow-sm">
                                {badge}
                            </span>
                        )}
                        <ChevronRight
                            size={14}
                            className="text-[rgb(var(--color-text-muted))] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                        />
                    </>
                )}
            </NavLink>
        </motion.div>
    );
});

export default function MobileDrawer({ isOpen, onClose, user, isAuthenticated, isAdmin, cartCount, onLogout, searchQuery, setSearchQuery, onSearch }) {
    const [searchOpen, setSearchOpen] = useState(false);
    const searchInputRef = useRef(null);
    const initials = (
        (user?.firstName?.[0] || '') + (user?.lastName?.[0] || '')
    ).toUpperCase() || '?';

    useEffect(() => {
        if (searchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [searchOpen]);

    const handleSearchKeyDown = useCallback((e) => {
        if (e.key === 'Escape') {
            setSearchOpen(false);
            setSearchQuery('');
        }
    }, [setSearchQuery]);

    const handleSearchSubmit = useCallback((e) => {
        onSearch(e);
        setSearchOpen(false);
    }, [onSearch]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
                        onClick={onClose}
                        aria-hidden="true"
                    />

                    {/* Drawer panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 320 }}
                        className="fixed inset-y-0 right-0 z-50 flex w-[min(85vw,360px)] flex-col bg-[rgb(var(--color-surface))] shadow-2xl lg:hidden"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Navigation menu"
                    >
                        {/* Drawer header */}
                        <div className="flex items-center justify-between border-b border-[rgb(var(--color-border))] px-5 py-4">
                            <p className="font-sans text-base font-bold text-[rgb(var(--color-text))] tracking-tight">
                                Menu
                            </p>
                            <button
                                onClick={onClose}
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-primary))] active:scale-90 transition-all duration-300"
                                aria-label="Close menu"
                            >
                                <X size={20} strokeWidth={1.8} />
                            </button>
                        </div>

                        {/* Drawer body */}
                        <div className="flex-1 overflow-y-auto px-4 pb-6">
                            {/* Search Toggle */}
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05, duration: 0.35 }}
                                className="mt-4"
                            >
                                <AnimatePresence mode="wait">
                                    {searchOpen ? (
                                        <motion.form
                                            key="search-form"
                                            onSubmit={handleSearchSubmit}
                                            initial={{ height: 44, opacity: 0.6 }}
                                            animate={{ height: 44, opacity: 1 }}
                                            exit={{ height: 44, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="relative flex items-center"
                                        >
                                            <Search
                                                size={16}
                                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[rgb(var(--color-primary))] pointer-events-none"
                                            />
                                            <input
                                                ref={searchInputRef}
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                onKeyDown={handleSearchKeyDown}
                                                placeholder="Search medicines..."
                                                className="w-full rounded-full border border-[rgb(var(--color-primary))]/30 bg-[rgb(var(--color-surface))] py-2.5 pl-10 pr-10 text-[14px] font-medium text-[rgb(var(--color-text))] placeholder:text-[rgb(var(--color-text-muted))] focus:outline-none focus:border-[rgb(var(--color-primary))] focus:shadow-[0_0_0_3px_rgba(13,148,136,0.1)] transition-all duration-300"
                                                aria-label="Search medicines"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-primary))] transition-colors duration-200"
                                                aria-label="Close search"
                                            >
                                                <X size={12} />
                                            </button>
                                        </motion.form>
                                    ) : (
                                        <motion.button
                                            key="search-btn"
                                            type="button"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            onClick={() => setSearchOpen(true)}
                                            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-[15px] font-medium text-[rgb(var(--color-text-muted))] min-h-[48px] active:scale-[0.98] transition-all duration-300"
                                        >
                                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[rgb(var(--color-bg-subtle))] text-[rgb(var(--color-text-muted))]">
                                                <Search size={18} strokeWidth={1.8} />
                                            </span>
                                            Search medicines...
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                            </motion.div>

                            {/* Profile card */}
                            {isAuthenticated ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1, duration: 0.35 }}
                                >
                                    <Link
                                        to="/account/profile"
                                        onClick={onClose}
                                        className="mt-4 flex items-center gap-3.5 rounded-2xl bg-[rgb(var(--color-bg-subtle))] p-4 transition-all duration-300 active:scale-[0.98]"
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
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1, duration: 0.35 }}
                                    className="mt-4"
                                >
                                    <Link
                                        to="/login"
                                        onClick={onClose}
                                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[rgb(var(--color-primary))] px-4 py-3.5 text-sm font-semibold text-white hover:bg-[rgb(var(--color-primary-dark))] active:scale-[0.98] transition-all duration-300 min-h-[48px]"
                                    >
                                        <User size={18} strokeWidth={2} />
                                        Sign In
                                    </Link>
                                </motion.div>
                            )}

                            {/* Shopping section */}
                            <SectionTitle>Shopping</SectionTitle>
                            <div className="flex flex-col gap-0.5">
                                <MobileNavLink
                                    to={shoppingLinks[0].to}
                                    icon={shoppingLinks[0].icon}
                                    label={shoppingLinks[0].label}
                                    index={0}
                                />
                                <MobileNavLink
                                    to="/cart"
                                    icon={ShoppingCart}
                                    label="Cart"
                                    badge={cartCount}
                                    index={1}
                                />
                                {isAuthenticated && (
                                    <MobileNavLink
                                        to="/account/orders"
                                        icon={Package}
                                        label="My Orders"
                                        index={2}
                                    />
                                )}
                                <MobileNavLink
                                    to={shoppingLinks[1].to}
                                    icon={shoppingLinks[1].icon}
                                    label={shoppingLinks[1].label}
                                    index={3}
                                />
                            </div>

                            {/* Support section */}
                            <SectionTitle>Support</SectionTitle>
                            <div className="flex flex-col gap-0.5">
                                {supportLinks.map((link, i) => (
                                    <MobileNavLink
                                        key={link.to}
                                        to={link.to}
                                        icon={link.icon}
                                        label={link.label}
                                        index={i + 4}
                                    />
                                ))}
                            </div>

                            {/* Admin section */}
                            {isAdmin && (
                                <>
                                    <SectionTitle>Admin</SectionTitle>
                                    <div className="flex flex-col gap-0.5">
                                        <MobileNavLink
                                            to="/admin/products"
                                            icon={LayoutDashboard}
                                            label="Dashboard"
                                            index={7}
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
                                    onClick={onLogout}
                                    className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50/80 dark:bg-red-900/10 px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 active:scale-[0.98] transition-all duration-300 min-h-[48px]"
                                >
                                    <LogOut size={18} strokeWidth={1.8} />
                                    Sign Out
                                </motion.button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
