import { useState, useEffect, useCallback } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { notificationService } from '../../services/notificationService';
import PageBackground from '../PageBackground';
import {
    Users,
    Shield,
    FolderTree,
    Package,
    ShoppingBag,
    Bell,
    User,
    Lock,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Activity,
    Moon,
    Sun,
} from 'lucide-react';
import toast from 'react-hot-toast';

const navItems = [
    { label: 'Users', to: '/admin/users', icon: Users },
    { label: 'Roles', to: '/admin/roles', icon: Shield },
    { label: 'Categories', to: '/admin/categories', icon: FolderTree },
    { label: 'Products', to: '/admin/products', icon: Package },
    { label: 'Orders', to: '/admin/orders', icon: ShoppingBag },
    { label: 'Notifications', to: '/admin/notifications', icon: Bell },
];

const accountItems = [
    { label: 'Profile', to: '/account/profile', icon: User },
    { label: 'Security', to: '/account/security', icon: Lock },
    { label: 'My Orders', to: '/account/orders', icon: ShoppingBag },
];

function SidebarContent({ onNavigate, user, onLogout, unreadCount = 0 }) {
    const isAdmin = user?.roles?.includes('Admin');

    return (
        <>
            <div className="flex h-16 items-center justify-between border-b border-[rgb(var(--color-border))] px-5">
                <NavLink to={isAdmin ? '/admin/products' : '/account/profile'} onClick={onNavigate} className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgb(var(--color-primary))]/10">
                        <Activity className="h-5 w-5 text-[rgb(var(--color-primary))]" />
                    </div>
                    <span className="font-sans text-lg font-bold text-[rgb(var(--color-text))]">
                        {isAdmin ? 'Admin Dashboard' : 'Medical Store'}
                    </span>
                </NavLink>
                <button
                    onClick={onNavigate}
                    className="rounded-lg p-2 text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-bg-subtle))] transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center lg:hidden"
                    aria-label="Close menu"
                >
                    <X size={18} />
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4">
                {isAdmin && (
                    <>
                        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-[rgb(var(--color-text-muted))]">
                            Management
                        </p>
                        <div className="mb-6 flex flex-col gap-1">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    onClick={onNavigate}
                                    className={({ isActive }) =>
                                        `relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 group min-h-[44px] ${
                                            isActive
                                                ? 'bg-gradient-to-r from-[rgb(var(--color-primary))]/15 to-[rgb(var(--color-primary))]/5 text-[rgb(var(--color-primary))] shadow-sm'
                                                : 'text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-bg-subtle))] hover:text-[rgb(var(--color-text))]'
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            {isActive && (
                                                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-[rgb(var(--color-primary))]" />
                                            )}
                                            <item.icon size={18} className="transition-transform duration-200 group-hover:scale-110" />
                                            <span>{item.label}</span>
                                            {item.label === 'Notifications' && unreadCount > 0 && (
                                                <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                                                    {unreadCount > 99 ? '99+' : unreadCount}
                                                </span>
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            ))}
                        </div>
                    </>
                )}

                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-[rgb(var(--color-text-muted))]">
                    Account
                </p>
                <div className="flex flex-col gap-1">
                    {accountItems
                        .filter((item) => item.label !== 'My Orders' || !isAdmin)
                        .map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={onNavigate}
                            className={({ isActive }) =>
                                `relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 group min-h-[44px] ${
                                    isActive
                                        ? 'bg-gradient-to-r from-[rgb(var(--color-primary))]/15 to-[rgb(var(--color-primary))]/5 text-[rgb(var(--color-primary))] shadow-sm'
                                        : 'text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-bg-subtle))] hover:text-[rgb(var(--color-text))]'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-[rgb(var(--color-primary))]" />
                                    )}
                                    <item.icon size={18} className="transition-transform duration-200 group-hover:scale-110" />
                                    <span>{item.label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </nav>

            <div className="border-t border-[rgb(var(--color-border))] p-3">
                <div className="flex items-center gap-3 rounded-xl px-3 py-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]">
                        <User size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-[rgb(var(--color-text))]">
                            {user?.firstName} {user?.lastName}
                        </p>
                        <p className="truncate text-xs text-[rgb(var(--color-text-muted))]">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={onLogout}
                    className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-200 min-h-[44px]"
                >
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>
        </>
    );
}

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        let cancelled = false;
        async function fetchUnreadCount() {
            try {
                const result = await notificationService.getUnreadCount();
                if (!cancelled) setUnreadCount(result.count);
            } catch {
                // non-critical
            }
        }
        fetchUnreadCount();
        return () => { cancelled = true; };
    }, []);

    const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

    useEffect(() => {
        if (!isSidebarOpen) return;
        function handleKeyDown(e) {
            if (e.key === 'Escape') closeSidebar();
        }
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isSidebarOpen, closeSidebar]);

    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isSidebarOpen]);

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth >= 1024) setIsSidebarOpen(false);
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = useCallback(async () => {
        closeSidebar();
        await logout();
        toast.success('You have been signed out.');
        navigate('/login');
    }, [logout, navigate, closeSidebar]);

    return (
        <div className="relative flex min-h-screen bg-[rgb(var(--color-bg))]">
            <PageBackground />
            {/* Mobile overlay */}
            <div
                className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
                    isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={closeSidebar}
                aria-hidden="true"
            />

            {/* Sidebar - Desktop */}
            <aside className="fixed inset-y-0 left-0 z-50 hidden lg:flex w-64 flex-col border-r border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]">
                <SidebarContent onNavigate={() => {}} user={user} onLogout={handleLogout} unreadCount={unreadCount} />
            </aside>

            {/* Sidebar - Mobile */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] transition-transform duration-300 ease-in-out lg:hidden ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <SidebarContent onNavigate={closeSidebar} user={user} onLogout={handleLogout} unreadCount={unreadCount} />
            </aside>

            {/* Main content */}
            <div className="relative z-10 flex flex-1 flex-col min-w-0 overflow-hidden lg:pl-64">
                {/* Top bar */}
                <header className="sticky top-0 z-30 flex h-14 sm:h-16 items-center gap-3 sm:gap-4 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-3 sm:px-6">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="rounded-xl p-2 text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-bg-subtle))] lg:hidden transition-all duration-200 hover:scale-105 active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                        <Menu size={20} />
                    </button>

                    <div className="flex-1" />

                    <button
                        onClick={toggleTheme}
                        className="rounded-xl p-2 text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-bg-subtle))] transition-all duration-200 hover:scale-105 active:scale-95 active:rotate-180 min-h-[44px] min-w-[44px] flex items-center justify-center"
                        title="Toggle theme"
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    <NavLink
                        to="/"
                        className="glass-button-secondary !px-3 !py-1.5 text-xs transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] min-h-[40px] flex items-center"
                    >
                        <span className="hidden sm:inline">View Store</span>
                        <span className="sm:hidden">Store</span>
                        <ChevronRight size={14} />
                    </NavLink>
                </header>

                {/* Page content */}
                <main className="flex-1 p-3 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
