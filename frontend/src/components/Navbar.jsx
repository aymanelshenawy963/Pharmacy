import { useEffect, useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Icon from './Icons';
import DesktopNav from './layout/DesktopNav';
import DesktopActions from './layout/DesktopActions';
import MobileActions from './layout/MobileActions';
import MobileDrawer from './layout/MobileDrawer';
import notify from '../utils/notifications';

export default function Navbar() {
    const { cartCount } = useCart();
    const { user, isAuthenticated, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);
    const isAdmin = user?.roles?.includes('Admin');
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 16);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleLogout = useCallback(() => {
        logout();
        setMenuOpen(false);
        notify.success('You have been signed out. See you next time!', {
            icon: '\uD83D\uDC4B',
            duration: 3000,
        });
        navigate('/');
    }, [logout, navigate]);

    const handleSearch = useCallback((e) => {
        e.preventDefault();
        const q = searchQuery.trim();
        if (q) {
            navigate(`/products?q=${encodeURIComponent(q)}`);
            setSearchQuery('');
            setSearchOpen(false);
            setMenuOpen(false);
        }
    }, [searchQuery, navigate]);

    useEffect(() => {
        setMenuOpen(false);
        setSearchOpen(false);
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

    return (
        <header
            className={`sticky top-0 z-50 border-b transition-all duration-300 ${
                scrolled
                    ? 'border-[rgb(var(--color-border))]/60 bg-[rgb(var(--color-surface))]/95 backdrop-blur-xl shadow-[var(--shadow-sm)]'
                    : 'border-transparent bg-[rgb(var(--color-surface))]/80 backdrop-blur-none shadow-none'
            }`}
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-3 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-2.5 group shrink-0"
                    aria-label="Medical Store — Home"
                >
                    <div className="bg-[rgb(var(--color-primary))]/10 p-2 rounded-xl group-hover:bg-[rgb(var(--color-primary))]/15 group-hover:scale-[1.03] transition-all duration-300">
                        <Activity className="h-5 w-5 text-[rgb(var(--color-primary))]" strokeWidth={2} />
                    </div>
                    <p className="font-sans text-base sm:text-lg font-bold tracking-tight text-[#00685f] dark:text-[#38b2ac]">
                        Medical Store
                    </p>
                </Link>

                <DesktopNav searchOpen={searchOpen} />

                <DesktopActions
                    user={user}
                    isAuthenticated={isAuthenticated}
                    isAdmin={isAdmin}
                    cartCount={cartCount}
                    onLogout={handleLogout}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    searchOpen={searchOpen}
                    setSearchOpen={setSearchOpen}
                    onSearch={handleSearch}
                />

                <MobileActions
                    cartCount={cartCount}
                    menuOpen={menuOpen}
                    setMenuOpen={setMenuOpen}
                />
            </div>

            <MobileDrawer
                isOpen={menuOpen}
                onClose={() => setMenuOpen(false)}
                user={user}
                isAuthenticated={isAuthenticated}
                isAdmin={isAdmin}
                cartCount={cartCount}
                onLogout={handleLogout}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearch={handleSearch}
            />
        </header>
    );
}
