import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';

const errorVariants = {
    hidden: { opacity: 0, y: -4, height: 0 },
    visible: {
        opacity: 1,
        y: 0,
        height: 'auto',
        transition: { type: 'spring', damping: 20, stiffness: 300 },
    },
    exit: {
        opacity: 0,
        y: -4,
        height: 0,
        transition: { duration: 0.15 },
    },
};

export default function FormField({
    label,
    name,
    type = 'text',
    value,
    onChange,
    error,
    required = false,
    placeholder = '',
    disabled = false,
    className = '',
    children,
    options,
    multiple = false,
    rows = 3,
}) {
    const [isFocused, setIsFocused] = useState(false);

    const baseInputClass = clsx(
        'w-full rounded-xl border bg-[rgb(var(--color-surface))] px-4 py-3 text-sm text-[rgb(var(--color-text))] placeholder:text-[rgb(var(--color-text-muted))] outline-none transition-all duration-200 min-h-[44px]',
        error
            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
            : 'border-[rgb(var(--color-border))] focus:border-[rgb(var(--color-primary))] focus:ring-2 focus:ring-[rgb(var(--color-primary))]/20',
        disabled && 'opacity-50 cursor-not-allowed'
    );

    const renderInput = () => {
        if (children) return children;

        if (type === 'select') {
            return (
                <select
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={clsx(baseInputClass, 'appearance-none bg-no-repeat bg-[right_12px_center] bg-[length:16px]')}
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")` }}
                >
                    <option value="">{placeholder || 'Select...'}</option>
                    {options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            );
        }

        if (type === 'textarea') {
            return (
                <textarea
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    placeholder={placeholder}
                    rows={rows}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={clsx(baseInputClass, 'resize-none min-h-[80px]')}
                />
            );
        }

        if (type === 'checkbox') {
            return (
                <div className="flex items-center gap-3">
                    <label className="relative flex items-center cursor-pointer group">
                        <input
                            type="checkbox"
                            name={name}
                            checked={value}
                            onChange={onChange}
                            disabled={disabled}
                            className="peer sr-only"
                        />
                        <div className={clsx(
                            'h-5 w-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center',
                            value
                                ? 'bg-[rgb(var(--color-primary))] border-[rgb(var(--color-primary))] scale-110'
                                : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] group-hover:border-[rgb(var(--color-primary))]/50',
                            disabled && 'opacity-50 cursor-not-allowed'
                        )}>
                            <AnimatePresence>
                                {value && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        transition={{ type: 'spring', damping: 15, stiffness: 400 }}
                                    >
                                        <Check size={12} className="text-white" strokeWidth={3} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </label>
                    {label && <label className="text-sm text-[rgb(var(--color-text))] select-none cursor-pointer">{label}</label>}
                </div>
            );
        }

        if (type === 'radio') {
            return (
                <div className="flex flex-col gap-2">
                    {options?.map((opt) => (
                        <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                                <input
                                    type="radio"
                                    name={name}
                                    value={opt.value}
                                    checked={value === opt.value}
                                    onChange={onChange}
                                    disabled={disabled}
                                    className="peer sr-only"
                                />
                                <div className={clsx(
                                    'h-5 w-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center',
                                    value === opt.value
                                        ? 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]'
                                        : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] group-hover:border-[rgb(var(--color-primary))]/50',
                                    disabled && 'opacity-50 cursor-not-allowed'
                                )}>
                                    <AnimatePresence>
                                        {value === opt.value && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                                transition={{ type: 'spring', damping: 15, stiffness: 400 }}
                                                className="h-2 w-2 rounded-full bg-white"
                                            />
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                            <span className="text-sm text-[rgb(var(--color-text))] select-none">{opt.label}</span>
                        </label>
                    ))}
                </div>
            );
        }

        return (
            <input
                id={name}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                placeholder={placeholder}
                required={required}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={clsx(baseInputClass)}
            />
        );
    };

    if (type === 'checkbox') {
        return (
            <div className={clsx('flex flex-col gap-1.5', className)}>
                {renderInput()}
                <AnimatePresence>
                    {error && (
                        <motion.span
                            variants={errorVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="text-xs font-medium text-red-500 overflow-hidden"
                        >
                            {error}
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <div className={clsx('flex flex-col gap-1.5', className)}>
            {label && (
                <label htmlFor={name} className="text-sm font-medium text-[rgb(var(--color-text))] select-none">
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}
            {renderInput()}
            <AnimatePresence>
                {error && (
                    <motion.span
                        variants={errorVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="text-xs font-medium text-red-500 overflow-hidden"
                    >
                        {error}
                    </motion.span>
                )}
            </AnimatePresence>
        </div>
    );
}
