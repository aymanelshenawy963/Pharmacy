import Icon from './Icons';

export default function TrustBadges({ badges }) {
    return (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {badges.map((badge, index) => (
                <div
                    key={badge.title}
                    className="glass-card flex items-center gap-3.5 p-4 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] animate-[fadeInUp_0.5s_cubic-bezier(0.16,1,0.3,1)_both]"
                    style={{ animationDelay: `${index * 0.08}s` }}
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]">
                        <Icon name={badge.iconKey} className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-semibold text-[rgb(var(--color-text))]">{badge.title}</p>
                </div>
            ))}
        </div>
    );
}
