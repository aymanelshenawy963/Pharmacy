import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
    Users,
    Shield,
    FolderTree,
    Package,
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
];

const accountItems = [
    { label: 'Profile', to: '/account/profile', icon: User },
    { label: 'Security', to: '/account/security', icon: Lock },
];

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        toast.success('You have been signed out.');
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-[rgb(var(--color-bg))]">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] transition-transform duration-300 lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Brand */}
                <div className="flex h-16 items-center justify-between border-b border-[rgb(var(--color-border))] px-5">
                    <NavLink to="/admin/products" className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgb(var(--color-primary))]/10">
                            <Activity className="h-5 w-5 text-[rgb(var(--color-primary))]" />
                        </div>
                        <span className="font-serif text-lg font-bold text-[rgb(var(--color-text))]">
                            Jaya Admin
                        </span>
                    </NavLink>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="rounded-lg p-1.5 text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-bg-subtle))] lg:hidden"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Nav sections */}
                <nav className="flex-1 overflow-y-auto px-3 py-4">
                    <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-[rgb(var(--color-text-muted))]">
                        Management
                    </p>
                    <div className="mb-6 flex flex-col gap-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                                        isActive
                                            ? 'bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]'
                                            : 'text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-bg-subtle))] hover:text-[rgb(var(--color-text))]'
                                    }`
                                }
                            >
                                <item.icon size={18} />
                                {item.label}
                            </NavLink>
                        ))}
                    </div>

                    <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-[rgb(var(--color-text-muted))]">
                        Account
                    </p>
                    <div className="flex flex-col gap-1">
                        {accountItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                                        isActive
                                            ? 'bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]'
                                            : 'text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-bg-subtle))] hover:text-[rgb(var(--color-text))]'
                                    }`
                                }
                            >
                                <item.icon size={18} />
                                {item.label}
                            </NavLink>
                        ))}
                    </div>
                </nav>

                {/* User section */}
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
                        onClick={handleLogout}
                        className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex flex-1 flex-col lg:pl-64">
                {/* Top bar */}
                <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-[rgb(var(--color-border))] bg-[var(--glass-bg)] backdrop-blur-xl px-4 sm:px-6">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="rounded-xl p-2 text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-bg-subtle))] lg:hidden"
                    >
                        <Menu size={20} />
                    </button>

                    <div className="flex-1" />

                    <button
                        onClick={toggleTheme}
                        className="rounded-xl p-2 text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-bg-subtle))] transition-colors"
                        title="Toggle theme"
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    <NavLink
                        to="/"
                        className="glass-button-secondary !px-3 !py-1.5 text-xs"
                    >
                        View Store
                        <ChevronRight size={14} />
                    </NavLink>
                </header>

                {/* Page content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
