import { ownerProfile } from '../data/store';
import Icon from './Icons';

export default function OwnerCard({ compact = false }) {
    return (
        <div className={`bg-[rgb(var(--color-surface))] rounded-2xl border border-[rgb(var(--color-border))] shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md ${compact ? 'p-5' : 'p-6'}`}>
            <div className={`flex ${compact ? 'items-center gap-4' : 'flex-col gap-5'} `}>
                <div className={`relative ${compact ? 'h-20 w-20' : 'h-40 w-40'} flex-shrink-0`}>
                    <img
                        src={import.meta.env.BASE_URL + 'images/owner.jpg'}
                        alt="James Mitchell - Proprietor, Medical Store"
                        className="h-full w-full rounded-2xl object-cover ring-2 ring-[rgb(var(--color-primary))]/10"
                        loading="lazy"
                    />
                </div>
                <div className="space-y-2.5">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[rgb(var(--color-primary))]">Owner</p>
                        <h3 className="mt-1 font-sans text-2xl font-bold text-[rgb(var(--color-text))]">{ownerProfile.name}</h3>
                        <p className="mt-0.5 text-sm font-medium text-[rgb(var(--color-text-muted))]">{ownerProfile.title}</p>
                    </div>
                    <p className="text-sm leading-relaxed text-[rgb(var(--color-text-muted))] italic">&ldquo;{ownerProfile.quote}&rdquo;</p>
                    {!compact ? <p className="text-sm leading-relaxed text-[rgb(var(--color-text-muted))]">{ownerProfile.bio}</p> : null}
                    <div className="flex items-center gap-2 text-sm text-[rgb(var(--color-primary))] font-medium">
                        <Icon name="Sparkles" className="h-4 w-4" />
                        Serving for {ownerProfile.years}+ years
                    </div>
                </div>
            </div>
        </div>
    );
}
