import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { footerLinks } from '../../data/store';

const navLinks = footerLinks;

export default function DesktopNav({ searchOpen }) {
    return (
        <AnimatePresence>
            {!searchOpen && (
                <motion.nav
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    className="hidden items-center gap-1 overflow-hidden lg:flex"
                    aria-label="Primary navigation"
                >
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                `group relative px-4 py-2 rounded-lg text-[13.5px] tracking-wide font-medium transition-colors duration-300 ${
                                    isActive
                                        ? 'text-[rgb(var(--color-primary))]'
                                        : 'text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-primary))]'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <span className="relative z-10">{link.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-indicator"
                                            className="absolute bottom-0.5 left-4 right-4 h-[2.5px] bg-[rgb(var(--color-primary))] rounded-full"
                                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </motion.nav>
            )}
        </AnimatePresence>
    );
}
