import { useRef, useEffect, useState } from 'react';

export default function Reveal({ children, className = '', delay = 0, direction = 'up' }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(el);
                }
            },
            { threshold: 0.15 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const directionStyles = {
        up: { transform: visible ? 'translateY(0)' : 'translateY(16px)' },
        down: { transform: visible ? 'translateY(0)' : 'translateY(-16px)' },
        left: { transform: visible ? 'translateX(0)' : 'translateX(16px)' },
        right: { transform: visible ? 'translateX(0)' : 'translateX(-16px)' },
    };

    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: visible ? 1 : 0,
                transform: (directionStyles[direction] || directionStyles.up).transform,
                transition: `opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
            }}
        >
            {children}
        </div>
    );
}
