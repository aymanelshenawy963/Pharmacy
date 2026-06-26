import { motion } from 'framer-motion';

export default function Reveal({ children, className = '', delay = 0, direction = 'up' }) {
    const directionMap = {
        up: { y: 24, x: 0 },
        down: { y: -24, x: 0 },
        left: { x: 24, y: 0 },
        right: { x: -24, y: 0 },
    };

    const offset = directionMap[direction] || directionMap.up;

    return (
        <motion.div
            initial={{ opacity: 0, ...offset }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
                duration: 0.6,
                delay,
                ease: [0.16, 1, 0.3, 1],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
