import { memo } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOut, User, LayoutDashboard, ShoppingCart, Package, ChevronRight, Shield, X } from 'lucide-react';
import { shoppingLinks, supportLinks } from '../../constants/navigation';

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

export default function MobileDrawer({ isOpen, onClose, user, isAuthenticated, isAdmin, cartCount, onLogout }) {
    const initials = (
        (user?.firstName?.[0] || '') + (user?.lastName?.[0] || '')
    ).toUpperCase() || '?';

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
                        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                        className="fixed inset-y-0 right-0 z-50 flex w-[min(85vw,360px)] flex-col bg-[rgb(var(--color-surface))] shadow-2xl lg:hidden"
                    >
                        {/* Drawer header */}
                        <div className="flex items-center justify-between border-b border-[rgb(var(--color-border))] px-5 py-4">
                            <p className="font-sans text-base font-bold text-[rgb(var(--color-text))]">
                                Menu
                            </p>
                            <button
                                onClick={onClose}
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
                                        onClick={onClose}
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
                                        onClick={onClose}
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
                                {isAuthenticated && (
                                    <MobileNavLink
                                        to="/account/orders"
                                        icon={Package}
                                        label="My Orders"
                                    />
                                )}
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
                                    onClick={onLogout}
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
    );
}
