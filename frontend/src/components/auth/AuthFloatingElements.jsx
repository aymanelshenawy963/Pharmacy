import { motion } from 'framer-motion';

export default function AuthFloatingElements() {
    return (
        <>
            <motion.div
                animate={{ y: [0, -10, 0], transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' } }}
                className="absolute top-20 left-[20%] h-16 w-16 rounded-full bg-[rgb(var(--color-primary))]/5 blur-xl"
            />
            <motion.div
                animate={{ y: [0, 8, 0], transition: { duration: 7, repeat: Infinity, ease: 'easeInOut' } }}
                className="absolute bottom-24 right-[18%] h-14 w-14 rounded-full bg-[rgb(var(--color-primary))]/5 blur-xl"
            />
        </>
    );
}
