import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { footerLinks } from '../../data/store';

const navLinks = footerLinks.filter((link) => link.label !== 'Home');

export default function DesktopNav() {
    return (
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
    );
}
