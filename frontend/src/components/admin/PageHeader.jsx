export default function PageHeader({ title, description, action = null }) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="font-serif text-2xl font-bold text-[rgb(var(--color-text))] md:text-3xl">{title}</h1>
                {description && (
                    <p className="mt-1 text-sm text-[rgb(var(--color-text-muted))]">{description}</p>
                )}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}
