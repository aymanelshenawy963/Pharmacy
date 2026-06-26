import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { footerLinks, ownerProfile, socialLinks, storeInfo } from '../data/products';
import Icon from './Icons';

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
};

const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function Footer() {
    const year = new Date().getFullYear();

    const handleSubscribe = (event) => {
        event.preventDefault();
        toast.success('Thanks for subscribing.');
        event.currentTarget.reset();
    };

    return (
        <footer className="border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text))] relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-[rgb(var(--color-primary))]/5 blur-[100px] pointer-events-none" />

            <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
                className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.4fr_0.6fr_0.6fr_1fr] lg:gap-16 lg:px-8 relative z-10"
            >
                {/* Brand column */}
                <motion.div variants={item} className="space-y-6">
                    <div>
                        <p className="font-serif text-2xl font-bold tracking-tight">
                            Jaya Medical Store
                        </p>
                        <p className="mt-4 max-w-md text-sm leading-relaxed text-[rgb(var(--color-text-muted))]">
                            A neighborhood pharmacy experience shaped for clarity, care, and dependable service.
                        </p>
                    </div>

                    {/* Owner badge */}
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] border border-[rgb(var(--color-primary))]/20">
                            <Icon name="UserRound" className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-[rgb(var(--color-text))]">{ownerProfile.name}</p>
                            <p className="text-xs text-[rgb(var(--color-text-muted))] mt-0.5">{ownerProfile.title}</p>
                        </div>
                    </div>

                    {/* Address */}
                    <p className="max-w-sm text-sm leading-relaxed text-[rgb(var(--color-text-muted))]">
                        {storeInfo.address}
                    </p>

                    {/* Social links */}
                    <div className="flex items-center gap-2.5 pt-2">
                        {socialLinks.map((social) => (
                            <a
                                key={social.name}
                                href={social.href}
                                target="_blank"
                                rel="noreferrer"
                                className="group inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-muted))] transition-all duration-300 hover:border-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary))] hover:text-white hover:shadow-[var(--shadow-glow)]"
                                aria-label={social.name}
                            >
                                <Icon name={social.name === 'WhatsApp' ? 'MessageCircle' : social.name} className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                            </a>
                        ))}
                    </div>
                </motion.div>

                {/* Quick Links */}
                <motion.div variants={item}>
                    <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[rgb(var(--color-primary))]">
                        Quick Links
                    </p>
                    <div className="grid gap-3">
                        {footerLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="group flex items-center gap-2.5 text-sm text-[rgb(var(--color-text-muted))] transition-colors duration-200 hover:text-[rgb(var(--color-primary))]"
                            >
                                <span className="inline-block h-px w-3 bg-[rgb(var(--color-border))] transition-all duration-300 group-hover:w-6 group-hover:bg-[rgb(var(--color-primary))]" />
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </motion.div>

                {/* Legal links */}
                <motion.div variants={item}>
                    <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[rgb(var(--color-primary))]">
                        Legal
                    </p>
                    <div className="grid gap-3">
                        {[
                            { label: 'Privacy Policy', to: '/privacy-policy' },
                            { label: 'Terms & Conditions', to: '/terms-conditions' },
                            { label: 'Cancellation Policy', to: '/cancel-order' },
                        ].map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="group flex items-center gap-2.5 text-sm text-[rgb(var(--color-text-muted))] transition-colors duration-200 hover:text-[rgb(var(--color-primary))]"
                            >
                                <span className="inline-block h-px w-3 bg-[rgb(var(--color-border))] transition-all duration-300 group-hover:w-6 group-hover:bg-[rgb(var(--color-primary))]" />
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </motion.div>

                {/* Newsletter + Contact column */}
                <motion.div variants={item} className="space-y-8">
                    <div>
                        <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[rgb(var(--color-primary))]">
                            Stay Updated
                        </p>
                        <p className="max-w-sm text-sm leading-relaxed text-[rgb(var(--color-text-muted))] mb-4">
                            Get store updates, wellness notes, and product highlights without clutter.
                        </p>
                        <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5">
                            <input
                                id="footer-email"
                                type="email"
                                required
                                placeholder="Enter your email address"
                                className="glass-input !py-2.5"
                            />
                            <button
                                type="submit"
                                className="glass-button-primary w-full !py-2.5"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>

                    {/* Contact details */}
                    <div className="glass-card p-4 space-y-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[rgb(var(--color-text-muted))] mb-3">
                            Contact Support
                        </p>
                        <div className="flex items-center gap-3 text-sm text-[rgb(var(--color-text-muted))]">
                            <Icon name="Phone" className="h-3.5 w-3.5 text-[rgb(var(--color-primary))]" />
                            <span>{storeInfo.phone}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-[rgb(var(--color-text-muted))]">
                            <Icon name="Mail" className="h-3.5 w-3.5 text-[rgb(var(--color-primary))]" />
                            <span>{storeInfo.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-[rgb(var(--color-text-muted))]">
                            <Icon name="Clock3" className="h-3.5 w-3.5 text-[rgb(var(--color-primary))]" />
                            <span>{storeInfo.hours}</span>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Bottom bar */}
            <div className="border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))]">
                <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-[rgb(var(--color-text-muted))] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                    <p>&copy; {year} Jaya Medical Store. All rights reserved.</p>
                    <p className="flex items-center gap-1">
                        Built for reliable pharmacy care <Icon name="HeartPulse" className="w-3.5 h-3.5 text-red-500" />
                    </p>
                </div>
            </div>
        </footer>
    );
}
