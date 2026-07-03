import { Link } from 'react-router-dom';
import Icon from './Icons';

export default function CategoryCard({ category }) {
    return (
        <div>
            <Link
                to={`/products?category=${encodeURIComponent(category.slug)}`}
                className="group bg-[rgb(var(--color-surface))] rounded-2xl border border-[rgb(var(--color-border))] shadow-sm block p-5 transition-all duration-300 hover:shadow-md hover:border-[rgb(var(--color-primary))]/20"
            >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] transition-all duration-300 group-hover:bg-[rgb(var(--color-primary))] group-hover:text-white ">
                    <Icon name={category.iconKey} className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-sans text-xl font-bold text-[rgb(var(--color-text))]">{category.name}</h3>
                <p className="mt-1.5 text-sm text-[rgb(var(--color-text-muted))] leading-relaxed">{category.description}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[rgb(var(--color-primary))] transition-all duration-300 group-hover:gap-2.5">
                    Explore
                    <Icon name="ArrowRight" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
            </Link>
        </div>
    );
}
