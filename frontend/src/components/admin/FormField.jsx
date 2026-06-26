import { clsx } from 'clsx';

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
    const baseInputClass = clsx(
        'w-full rounded-xl border bg-[rgb(var(--color-surface))] px-4 py-3 text-sm text-[rgb(var(--color-text))] placeholder:text-[rgb(var(--color-text-muted))] outline-none transition-all duration-200',
        error
            ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
            : 'border-[rgb(var(--color-border))] focus:border-[rgb(var(--color-primary))] focus:ring-1 focus:ring-[rgb(var(--color-primary))]',
        disabled && 'opacity-50 cursor-not-allowed'
    );

    const renderInput = () => {
        if (children) return children;

        if (type === 'select') {
            return (
                <select name={name} value={value} onChange={onChange} disabled={disabled} className={baseInputClass}>
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
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    placeholder={placeholder}
                    rows={rows}
                    className={clsx(baseInputClass, 'resize-none')}
                />
            );
        }

        if (type === 'checkbox') {
            return (
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        name={name}
                        checked={value}
                        onChange={onChange}
                        disabled={disabled}
                        className="h-4 w-4 rounded border-[rgb(var(--color-border))] text-[rgb(var(--color-primary))] focus:ring-[rgb(var(--color-primary))]"
                    />
                    {label && <label className="text-sm text-[rgb(var(--color-text))]">{label}</label>}
                </div>
            );
        }

        return (
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                placeholder={placeholder}
                required={required}
                className={baseInputClass}
            />
        );
    };

    if (type === 'checkbox') {
        return (
            <div className={clsx('flex flex-col gap-1.5', className)}>
                {renderInput()}
                {error && <span className="text-xs font-medium text-red-500">{error}</span>}
            </div>
        );
    }

    return (
        <div className={clsx('flex flex-col gap-1.5', className)}>
            {label && (
                <label htmlFor={name} className="text-sm font-medium text-[rgb(var(--color-text))]">
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}
            {renderInput()}
            {error && <span className="text-xs font-medium text-red-500">{error}</span>}
        </div>
    );
}
