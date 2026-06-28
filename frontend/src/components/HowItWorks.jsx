import Icon from './Icons';

export default function HowItWorks({ steps }) {
    return (
        <div className="grid gap-4 lg:grid-cols-3">
            {steps.map((step, index) => (
                <div
                    key={step.title}
                    className="glass-card glass-card-hover relative p-6 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] animate-[fadeInUp_0.5s_cubic-bezier(0.16,1,0.3,1)_both]"
                    style={{ animationDelay: `${index * 0.1}s` }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[rgb(var(--color-secondary))]/10 text-[rgb(var(--color-secondary))]">
                            <Icon name={step.iconKey} className="h-5 w-5" />
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgb(var(--color-primary))]/10 text-xs font-bold text-[rgb(var(--color-primary))]">
                            0{index + 1}
                        </div>
                    </div>
                    <h3 className="mt-5 font-serif text-lg font-bold text-[rgb(var(--color-text))]">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[rgb(var(--color-text-muted))]">{step.text}</p>
                    {index < steps.length - 1 ? (
                        <div className="absolute right-4 top-1/2 hidden h-px w-12 bg-[rgb(var(--color-border))] xl:block" />
                    ) : null}
                </div>
            ))}
        </div>
    );
}
