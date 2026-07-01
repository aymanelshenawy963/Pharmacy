import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function AuthHeader() {
    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 sm:px-6 pointer-events-none">
            <Link
                to="/"
                className="flex items-center gap-2.5 group pointer-events-auto"
            >
                <div className="bg-[rgb(var(--color-primary))]/10 p-2 rounded-xl group-hover:bg-[rgb(var(--color-primary))]/20 transition-all duration-300">
                    <Activity className="h-5 w-5 text-[rgb(var(--color-primary))]" />
                </div>
                <p className="font-sans text-lg font-bold tracking-tight text-[#00685f] dark:text-[#38b2ac]">
                    Jaya Medical Store
                </p>
            </Link>
            <div className="pointer-events-auto">
                <ThemeToggle />
            </div>
        </div>
    );
}
