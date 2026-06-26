import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Seo from '../components/Seo';
import Icon from '../components/Icons';

export default function NotFound() {
    return (
        <>
            <Seo title="Page not found" description="The requested page could not be found." />
            <section className="page-shell section-pad">
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="glass-card mx-auto grid max-w-4xl gap-8 overflow-hidden p-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center"
                >
                    <div className="space-y-5">
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15, duration: 0.5 }}
                            className="kicker"
                        >
                            404
                        </motion.p>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="display-heading text-4xl sm:text-5xl"
                        >
                            This page is unavailable
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.25, duration: 0.5 }}
                            className="text-sm leading-7 text-slate-600"
                        >
                            The page you were looking for does not exist. Return to the home page to continue browsing the store.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            <Link
                                to="/"
                                className="glass-button text-brand-800"
                            >
                                Go home
                                <Icon name="ArrowRight" className="h-4 w-4" />
                            </Link>
                        </motion.div>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="relative rounded-[32px] bg-slate-950 p-10 text-white"
                    >
                        <div className="absolute left-8 top-8 h-20 w-20 rounded-full bg-brand-500/20 animate-pulse" />
                        <div className="absolute right-10 top-16 h-14 w-14 rounded-full bg-gold-400/20 animate-pulse" style={{ animationDelay: '0.5s' }} />
                        <div className="relative flex h-full min-h-[320px] items-center justify-center rounded-[28px] border border-white/10 bg-white/5">
                            <div className="text-center">
                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    <Icon name="PackageSearch" className="mx-auto h-14 w-14 text-brand-200" />
                                </motion.div>
                                <p className="mt-5 font-display text-4xl">Page not found</p>
                                <p className="mt-3 text-sm leading-6 text-slate-300">Try the home page or browse products instead.</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </section>
        </>
    );
}
