import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function AuthHeader() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between">
            {/* Brand / Home link */}
            <Link
                to="/"
                className="flex items-center gap-2.5 group"
                aria-label="Go to homepage"
            >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgb(var(--color-primary))]/10 group-hover:bg-[rgb(var(--color-primary))]/20 transition-colors duration-200">
                    <Activity className="h-5 w-5 text-[rgb(var(--color-primary))]" />
                </div>
                <span className="font-serif text-lg font-bold tracking-tight text-[rgb(var(--color-text))] group-hover:text-[rgb(var(--color-primary))] transition-colors duration-200">
                    Jaya Medical
                </span>
            </Link>

            {/* Dark / Light mode toggle */}
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] shadow-sm">
                <ThemeToggle />
            </div>
        </header>
    );
}
