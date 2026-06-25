import { Eye, EyeOff } from 'lucide-react';
import { forwardRef, useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const Input = forwardRef(({ label, error, type = 'text', className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    return (
        <div className="flex w-full flex-col gap-1.5">
            {label && (
                <label className="text-sm font-medium text-[rgb(var(--color-text))]">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    ref={ref}
                    type={isPassword ? (showPassword ? 'text' : 'password') : type}
                    className={cn(
                        'w-full rounded-xl border bg-[rgb(var(--color-surface))] px-4 py-3 text-[rgb(var(--color-text))] placeholder:text-[rgb(var(--color-text-muted))] outline-none transition-all duration-200',
                        error
                            ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                            : 'border-[rgb(var(--color-border))] focus:border-[rgb(var(--color-primary))] focus:ring-1 focus:ring-[rgb(var(--color-primary))]',
                        isPassword && 'pr-10',
                        className
                    )}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                )}
            </div>
            {error && (
                <span className="text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1">
                    {error}
                </span>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
