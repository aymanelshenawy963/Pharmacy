import { motion } from 'framer-motion';
import { authScaleFadeVariants, authContainerVariants } from '../../constants/auth';

export default function AuthDecorativePanel({ icon: Icon, title, highlightText, description, children }) {
    return (
        <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative overflow-hidden bg-gradient-to-br from-teal-600 via-teal-700 to-teal-900 flex-col items-center justify-center p-12 text-white">
            <motion.div
                animate={{ y: [0, -12, 0], transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' } }}
                className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/5"
            />
            <motion.div
                animate={{ y: [0, 10, 0], x: [0, -8, 0], transition: { duration: 7, repeat: Infinity, ease: 'easeInOut' } }}
                className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-white/5"
            />
            <motion.div
                animate={{ y: [0, -6, 0], x: [0, 6, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-white/[0.03]"
            />
            <motion.div
                animate={{ y: [0, -8, 0], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute top-20 right-20 h-3 w-3 rounded-full bg-teal-300/40"
            />
            <motion.div
                animate={{ y: [0, 12, 0], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
                className="absolute bottom-32 left-16 h-2 w-2 rounded-full bg-white/30"
            />
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                className="absolute top-1/3 left-8 h-16 w-16 rounded-full border border-white/10"
            />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative z-10 max-w-sm text-center"
            >
                <div className="mb-8 flex justify-center">
                    <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.6, delay: 0.4, type: 'spring', stiffness: 200 }}
                        className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm"
                    >
                        <Icon className="h-10 w-10 text-white" />
                    </motion.div>
                </div>
                <h1 className="font-sans text-4xl font-bold mb-4 leading-tight text-white">
                    {title}{' '}
                    <span className="bg-gradient-to-r from-teal-200 via-emerald-200 to-teal-300 bg-clip-text text-transparent">
                        {highlightText}
                    </span>
                </h1>
                <p className="text-teal-100/80 text-lg leading-relaxed">
                    {description}
                </p>

                {children && (
                    <motion.div
                        variants={authContainerVariants}
                        initial="hidden"
                        animate="show"
                        className="mt-12"
                    >
                        {children}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
