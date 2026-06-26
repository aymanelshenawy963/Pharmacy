import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
        <AnimatePresence>
            {visible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    type="button"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="glass-icon-button fixed bottom-24 right-8 z-40 !h-11 !w-11 shadow-[var(--shadow-lg)] hover:shadow-[var(--shadow-xl)]"
                    aria-label="Back to top"
                >
                    <Icon name="ArrowUp" className="h-5 w-5" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}
