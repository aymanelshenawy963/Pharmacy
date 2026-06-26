import { motion } from 'framer-motion';

const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
};

const orbitVariants = {
    animate: (size) => ({
        rotate: 360,
        transition: {
            duration: 0.9,
            ease: 'linear',
            repeat: Infinity,
        },
    }),
};

const dotVariants = {
    animate: (i) => ({
        scale: [1, 1.4, 1],
        opacity: [0.6, 1, 0.6],
        transition: {
            duration: 1.2,
            ease: 'easeInOut',
            repeat: Infinity,
            delay: i * 0.15,
        },
    }),
};

export default function LoadingSpinner({ size = 'md', className = '' }) {
    const dotCount = size === 'sm' ? 3 : 4;
    const dotSize = size === 'sm' ? 1.5 : 2;
    const radius = size === 'sm' ? 4 : size === 'md' ? 6 : 8;

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div className="relative" style={{ width: radius * 2 + dotSize, height: radius * 2 + dotSize }}>
                {Array.from({ length: dotCount }).map((_, i) => {
                    const angle = (i / dotCount) * 360;
                    const x = Math.cos((angle * Math.PI) / 180) * radius;
                    const y = Math.sin((angle * Math.PI) / 180) * radius;
                    return (
                        <motion.div
                            key={i}
                            custom={i}
                            variants={dotVariants}
                            animate="animate"
                            className="absolute rounded-full bg-[rgb(var(--color-primary))]"
                            style={{
                                width: dotSize,
                                height: dotSize,
                                left: `calc(50% + ${x}px - ${dotSize / 2}px)`,
                                top: `calc(50% + ${y}px - ${dotSize / 2}px)`,
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
}
