import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

export default function SearchInput({ value, onChange, placeholder = 'Search...', className = '' }) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className={`relative ${className}`}>
            <motion.div
                animate={{
                    scale: isFocused ? 1.02 : 1,
                    boxShadow: isFocused
                        ? '0 0 0 3px rgba(var(--color-primary), 0.1)'
                        : '0 0 0 0px rgba(var(--color-primary), 0)',
                }}
                transition={{ duration: 0.2 }}
                className="relative"
            >
                <Search
                    className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-200 ${
                        isFocused
                            ? 'text-[rgb(var(--color-primary))]'
                            : 'text-[rgb(var(--color-text-muted))]'
                    }`}
                />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className="w-full rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] py-2.5 pl-10 pr-9 text-sm text-[rgb(var(--color-text))] placeholder:text-[rgb(var(--color-text-muted))] outline-none transition-all duration-200 focus:border-[rgb(var(--color-primary))] focus:ring-2 focus:ring-[rgb(var(--color-primary))]/20"
                />
                <AnimatePresence>
                    {value && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.15 }}
                            onClick={() => onChange('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-subtle))] transition-colors"
                            aria-label="Clear search"
                        >
                            <X size={14} />
                        </motion.button>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
