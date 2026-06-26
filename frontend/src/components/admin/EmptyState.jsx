import { Inbox } from 'lucide-react';

export default function EmptyState({ icon = 'Inbox', title = 'No data found', description = 'There are no items to display.', action = null }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[rgb(var(--color-bg-subtle))]">
                <Inbox className="h-8 w-8 text-[rgb(var(--color-text-muted))]" />
            </div>
            <h3 className="mt-4 font-serif text-lg font-bold text-[rgb(var(--color-text))]">{title}</h3>
            <p className="mt-2 max-w-sm text-center text-sm text-[rgb(var(--color-text-muted))]">{description}</p>
            {action && <div className="mt-6">{action}</div>}
        </div>
    );
}
