export default function AuthCard({ children, className = '' }) {
    return (
        <div className={`relative ${className}`}>
            <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-[rgb(var(--color-primary))]/20 via-transparent to-[rgb(var(--color-primary))]/10 opacity-60" />
            <div className="bg-surface p-8 sm:p-10 relative rounded-3xl border border-border shadow-sm">
                {children}
            </div>
        </div>
    );
}
