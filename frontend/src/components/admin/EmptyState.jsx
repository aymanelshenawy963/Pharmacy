import { Inbox } from 'lucide-react';

export default function EmptyState({
    icon: IconComponent = Inbox,
    title = 'No data found',
    description = 'There are no items to display.',
    action = null,
}) {
    return (
        <div className="flex flex-col items-center justify-center py-12 sm:py-20 px-4 sm:px-6 animate-[fadeInUp_0.4s_cubic-bezier(0.25,0.46,0.45,0.94)_both]">
            <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-[rgb(var(--color-bg-subtle))] ring-1 ring-[rgb(var(--color-border))]">
                <IconComponent className="h-7 w-7 sm:h-9 sm:w-9 text-[rgb(var(--color-text-muted))]" />
            </div>
            <h3 className="mt-4 sm:mt-5 font-serif text-base sm:text-lg font-bold text-[rgb(var(--color-text))] text-center">
                {title}
            </h3>
            <p className="mt-2 max-w-xs sm:max-w-sm text-center text-xs sm:text-sm leading-relaxed text-[rgb(var(--color-text-muted))]">
                {description}
            </p>
            {action && <div className="mt-5 sm:mt-6 w-full sm:w-auto">{action}</div>}
        </div>
    );
}
