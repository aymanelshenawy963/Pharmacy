import { clsx } from 'clsx';

export default function StatusBadge({ active = true, activeText = 'Active', inactiveText = 'Inactive' }) {
    return (
        <span
            className={clsx(
                'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
                active
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            )}
        >
            <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-red-500'}`} />
            {active ? activeText : inactiveText}
        </span>
    );
}
