import { Link } from 'react-router-dom';
import Icon from './Icons';

export default function CategoryCard({ category }) {
    return (
        <div className="hover:-translate-y-1 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <Link
                to={`/products?category=${encodeURIComponent(category.slug)}`}
                className="group glass-card glass-card-hover block p-5"
            >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] transition-all duration-300 group-hover:bg-[rgb(var(--color-primary))] group-hover:text-white group-hover:shadow-[var(--shadow-glow)]">
                    <Icon name={category.iconKey} className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-serif text-xl font-bold text-[rgb(var(--color-text))]">{category.name}</h3>
                <p className="mt-1.5 text-sm text-[rgb(var(--color-text-muted))] leading-relaxed">{category.description}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[rgb(var(--color-primary))] transition-all duration-300 group-hover:gap-2.5">
                    Explore
                    <Icon name="ArrowRight" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
            </Link>
        </div>
    );
}
