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
            <div className="relative group">
                <input
                    ref={ref}
                    type={isPassword ? (showPassword ? 'text' : 'password') : type}
                    className={cn(
                        'glass-input',
                        error
                            ? 'input-error'
                            : '',
                        isPassword && 'pr-10',
                        className
                    )}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] transition-colors duration-200"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>
            {error && (
                <span className="text-xs font-medium text-red-500 animate-slide-down" style={{ animationDuration: '0.2s' }}>
                    {error}
                </span>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
