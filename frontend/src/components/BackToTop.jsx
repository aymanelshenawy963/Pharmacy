import { useEffect, useState } from 'react';
import Icon from './Icons';

export default function BackToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 500);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`inline-flex items-center justify-center h-11 w-11 rounded-full bg-[rgb(var(--color-primary))] text-white shadow-lg hover:shadow-xl hover:bg-[rgb(var(--color-primary-dark))] transition-all duration-300 fixed bottom-24 right-8 z-40 ${
                visible
                    ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                    : 'opacity-0 translate-y-4 scale-90 pointer-events-none'
            }`}
            aria-label="Back to top"
        >
            <Icon name="ArrowUp" className="h-5 w-5" />
        </button>
    );
}
