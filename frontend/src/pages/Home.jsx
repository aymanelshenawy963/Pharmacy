import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../components/Icons';
import Seo from '../components/Seo';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/productService';
import { normalizeProduct } from '../utils/normalizeProduct';
import notify from '../utils/notifications';
import { trustBadges, howItWorksSteps, collectionCards } from '../data/store';
import { staggerContainer, fadeInUp } from '../constants/animations';

export default function Home() {
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    useEffect(() => {
        let cancelled = false;
        async function loadFeatured() {
            try {
                const res = await productService.getAll({ TopSelling: true, PageSize: 8, PageNumber: 1 });
                if (!cancelled) {
                    const items = (res.data || []).map(normalizeProduct).slice(0, 8);
                    setFeaturedProducts(items);
                }
            } catch {
                // Non-critical — silently ignore
            } finally {
                if (!cancelled) setLoadingProducts(false);
            }
        }
        loadFeatured();
        return () => { cancelled = true; };
    }, []);

    const handleSubscribe = (event) => {
        event.preventDefault();
        notify.success('Newsletter signup submitted.');
        setNewsletterEmail('');
    };

    return (
        <>
            <Seo
                title="Home"
                description="Medical Store is a curated medical store experience with medicines, wellness products, and local delivery support."
            />

            {/* Hero Section */}
            <section
                className="relative flex items-center overflow-hidden"
                style={{ minHeight: 'calc(100vh - 72px)' }}
            >
                <div className="absolute inset-0 z-0">
                    <img
                        className="absolute inset-0 h-full w-full object-cover"
                        alt="Capsules and soft product composition"
                        src={import.meta.env.BASE_URL + 'images/heroimage.webp'}
                        fetchpriority="high"
                        width="1200"
                        height="800"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--color-bg))]/90 via-[rgb(var(--color-bg))]/50 to-transparent" />
                </div>

                <div className="relative z-10 mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-10 px-5 py-[60px] md:grid-cols-12 md:px-8 lg:px-16">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ staggerChildren: 0.15, delayChildren: 0.2 }}
                        className="flex flex-col items-start gap-7 md:col-span-12 lg:col-span-9"
                    >
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[rgb(var(--color-primary))]/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[rgb(var(--color-primary-dark))]"
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--color-primary))]" />
                            Licensed Pharmacy
                        </motion.span>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="max-w-[700px] font-sans text-[44px] font-bold leading-[1.1] text-[rgb(var(--color-text))] md:text-[52px] lg:text-[58px]"
                        >
                            Your Health,{' '}
                            <span className="text-[rgb(var(--color-primary))]">Our Priority</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="max-w-[520px] text-[16px] leading-[1.7] text-[rgb(var(--color-text-muted))] md:text-[17px]"
                        >
                            Genuine medicines, expert advice, and same-day delivery.
                            Order online — we handle the rest.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col gap-3 pt-2 sm:flex-row"
                        >
                            <Link
                                to="/products"
                                className="inline-flex min-w-[180px] items-center justify-center gap-2 rounded-full bg-[rgb(var(--color-primary))] px-7 py-3.5 text-[14px] font-semibold text-white transition-all duration-300 hover:bg-[rgb(var(--color-primary-dark))] active:scale-[0.97]"
                            >
                                Browse Products
                                <Icon name="ArrowRight" className="h-4 w-4" />
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Trust Badges */}
            <section className="border-y border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))]">
                <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="grid grid-cols-2 gap-6 md:grid-cols-4"
                    >
                        {trustBadges.map((badge) => (
                            <motion.div
                                key={badge.title}
                                variants={fadeInUp}
                                className="group flex flex-col items-center gap-4 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6 text-center transition-all duration-300 hover:border-[rgb(var(--color-primary))]/30 hover:shadow-md"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] transition-colors duration-300 group-hover:bg-[rgb(var(--color-primary))]/15">
                                    <Icon name={badge.iconKey} className="h-6 w-6" />
                                </div>
                                <h3 className="text-[14px] font-semibold text-[rgb(var(--color-text))]">{badge.title}</h3>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Collections */}
            <section className="bg-[rgb(var(--color-bg))]">
                <div className="mx-auto max-w-7xl px-4 py-24 md:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6"
                >
                    <div className="max-w-2xl">
                        <span className="kicker">Collections</span>
                        <h2 className="display-heading mb-4">Curated Categories</h2>
                        <p className="text-lg text-[rgb(var(--color-text-muted))]">
                            Explore our meticulously selected categories, designed to address your specific health and wellness needs.
                        </p>
                    </div>
                    <Link to="/products" className="glass-button-secondary inline-flex w-max">
                        View All Categories
                        <Icon name="ArrowRight" className="h-4 w-4" />
                    </Link>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="grid auto-rows-[280px] grid-cols-1 gap-6 md:grid-cols-12"
                >
                    {collectionCards.map((card) =>
                        card.large ? (
                            <motion.div variants={fadeInUp} key={card.title} className="md:col-span-8 md:row-span-2">
                                <Link to="/products" className="group relative block w-full h-full overflow-hidden rounded-2xl border border-[rgb(var(--color-border))] shadow-sm transition-all duration-500 hover:shadow-lg hover:shadow-[rgb(var(--color-primary))]/5 hover:border-[rgb(var(--color-primary))]/20">
                                    <img
                                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        alt={card.title}
                                        src={card.image}
                                        loading="lazy"
                                        width="600"
                                        height="400"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                                    <div className="absolute bottom-0 left-0 p-8 md:p-10 w-full transition-transform duration-500 group-hover:translate-y-[-4px]">
                                        <h3 className="mb-3 font-sans text-4xl font-semibold text-white">{card.title}</h3>
                                        <p className="max-w-md text-base text-white/80">{card.description}</p>
                                    </div>
                                </Link>
                            </motion.div>
                        ) : (
                            <motion.div variants={fadeInUp} key={card.title} className="md:col-span-4">
                                <Link to="/products" className="group relative flex flex-col justify-end overflow-hidden rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6 h-full shadow-sm transition-all duration-500 hover:shadow-lg hover:shadow-[rgb(var(--color-primary))]/5 hover:border-[rgb(var(--color-primary))]/20">
                                    {card.image && (
                                        <>
                                            <img
                                                className="absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                                                alt={card.title}
                                                src={card.image}
                                                loading="lazy"
                                                width="400"
                                                height="400"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/5 transition-all duration-500 group-hover:via-black/40" />
                                        </>
                                    )}
                                    <div className="relative z-10 transition-transform duration-500 group-hover:translate-y-[-4px]">
                                        <div className="mb-4 inline-flex rounded-xl bg-white/20 backdrop-blur-md p-2 text-white transition-all duration-300 group-hover:bg-white/30 group-hover:scale-110">
                                            <Icon name={card.icon || 'Pill'} className="h-6 w-6" />
                                        </div>
                                        <h3 className="font-sans text-2xl font-semibold text-white mb-1">{card.title}</h3>
                                        <p className="text-sm text-white/70 line-clamp-2">{card.description}</p>
                                    </div>
                                </Link>
                            </motion.div>
                        )
                    )}
                </motion.div>
                </div>
            </section>

            {/* Featured Products */}
            {(loadingProducts || featuredProducts.length > 0) && (
                <section className="bg-[rgb(var(--color-bg))] border-y border-[rgb(var(--color-border))]">
                    <div className="mx-auto max-w-7xl px-4 py-24 md:px-8">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6"
                        >
                            <div className="max-w-2xl">
                                <span className="kicker">Curated for You</span>
                                <h2 className="display-heading mb-4">Best Sellers</h2>
                                <p className="text-lg text-[rgb(var(--color-text-muted))]">
                                    Trusted products our customers keep coming back for.
                                </p>
                            </div>
                            <Link to="/products" className="glass-button-secondary inline-flex w-max">
                                View All Products
                                <Icon name="ArrowRight" className="h-4 w-4" />
                            </Link>
                        </motion.div>

                        {loadingProducts ? (
                            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="bg-[rgb(var(--color-surface))] h-[420px] animate-pulse overflow-hidden flex flex-col rounded-2xl border border-[rgb(var(--color-border))] shadow-sm"
                                    >
                                        <div className="h-48 bg-gradient-to-r from-[rgb(var(--color-border))]/40 via-[rgb(var(--color-border))]/60 to-[rgb(var(--color-border))]/40" />
                                        <div className="p-5 space-y-4 flex-grow flex flex-col justify-between">
                                            <div>
                                                <div className="h-3 w-16 bg-[rgb(var(--color-border))] rounded-full mb-3" />
                                                <div className="h-5 w-3/4 bg-[rgb(var(--color-border))]/80 rounded-full mb-2" />
                                                <div className="h-4 w-1/2 bg-[rgb(var(--color-border))]/60 rounded-full" />
                                            </div>
                                            <div className="h-12 w-full bg-[rgb(var(--color-border))]/50 rounded-xl" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={staggerContainer}
                                className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                            >
                                {featuredProducts.map((product) => (
                                    <motion.div key={product.id} variants={fadeInUp}>
                                        <ProductCard product={product} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </section>
            )}

            {/* Process */}
            <section className="relative overflow-hidden py-24 md:py-32">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-[rgb(var(--color-bg))]">
                    <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[rgb(var(--color-primary))] opacity-[0.03] blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[rgb(var(--color-primary))] opacity-[0.03] blur-3xl" />
                </div>

                <div className="mx-auto max-w-7xl px-4 md:px-8 relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-50px' }}
                        variants={fadeInUp}
                        className="mb-16 md:mb-20 text-center max-w-2xl mx-auto"
                    >
                        <span className="kicker">How it works</span>
                        <h2 className="display-heading mb-4">Your Journey to Better Health</h2>
                        <p className="text-lg text-[rgb(var(--color-text-muted))]">
                            From browsing to doorstep delivery, we've streamlined every step so you can focus on what matters most — your well-being.
                        </p>
                    </motion.div>

                    {/* Desktop: Horizontal timeline */}
                    <div className="hidden md:block">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-50px' }}
                            variants={staggerContainer}
                            className="relative"
                        >
                            {/* Connecting progress line */}
                            <div className="absolute top-[40px] left-[10%] right-[10%] h-px bg-[rgb(var(--color-border))]" />
                            <motion.div
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                                className="absolute top-[40px] left-[10%] right-[10%] h-px bg-gradient-to-r from-[rgb(var(--color-primary))] via-[rgb(var(--color-primary-light))] to-[rgb(var(--color-primary))] origin-left"
                            />

                            <div className="grid grid-cols-5 gap-4">
                                {howItWorksSteps.map((step, index) => (
                                    <motion.div
                                        variants={fadeInUp}
                                        key={step.title}
                                        className="relative flex flex-col items-center text-center group/step"
                                    >
                                        {/* Step number badge */}
                                        <div className="relative z-10 mb-5">
                                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-[rgb(var(--color-primary))] bg-[rgb(var(--color-bg))] shadow-lg text-[rgb(var(--color-primary))] transition-all duration-500 group-hover/step:scale-110 group-hover/step:shadow-xl group-hover/step:shadow-[rgb(var(--color-primary))]/20 group-hover/step:bg-[rgb(var(--color-primary))] group-hover/step:text-white">
                                                <Icon name={step.iconKey} className="h-8 w-8 transition-transform duration-500 group-hover/step:scale-110" />
                                            </div>
                                            {/* Number badge */}
                                            <div className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-[rgb(var(--color-primary))] text-xs font-bold text-white shadow-md">
                                                {String(index + 1).padStart(2, '0')}
                                            </div>
                                        </div>

                                        {/* Card */}
                                        <div className="w-full rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-5 shadow-sm transition-all duration-500 group-hover/step:-translate-y-2 group-hover/step:shadow-lg group-hover/step:border-[rgb(var(--color-primary))]/30">
                                            <h4 className="mb-2 font-sans text-base font-semibold text-[rgb(var(--color-text))] transition-colors duration-300 group-hover/step:text-[rgb(var(--color-primary))]">
                                                {step.title}
                                            </h4>
                                            <p className="text-sm leading-relaxed text-[rgb(var(--color-text-muted))]">
                                                {step.text}
                                            </p>
                                        </div>

                                        {/* Arrow connector */}
                                        {index < howItWorksSteps.length - 1 && (
                                            <div className="absolute top-[40px] -right-2 z-20 flex h-5 w-5 items-center justify-center text-[rgb(var(--color-primary))] opacity-60">
                                                <Icon name="ArrowRight" className="h-4 w-4" />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Mobile: Vertical timeline */}
                    <div className="md:hidden">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-50px' }}
                            variants={staggerContainer}
                            className="relative"
                        >
                            {/* Vertical connecting line */}
                            <div className="absolute left-[38px] top-0 bottom-0 w-px bg-[rgb(var(--color-border))]" />
                            <motion.div
                                initial={{ scaleY: 0 }}
                                whileInView={{ scaleY: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                                className="absolute left-[38px] top-0 bottom-0 w-px bg-gradient-to-b from-[rgb(var(--color-primary))] via-[rgb(var(--color-primary-light))] to-[rgb(var(--color-primary))] origin-top"
                            />

                            <div className="flex flex-col gap-1">
                                {howItWorksSteps.map((step, index) => (
                                    <motion.div
                                        variants={fadeInUp}
                                        key={step.title}
                                        className="relative flex items-start gap-5 group/step"
                                    >
                                        {/* Step icon + badge */}
                                        <div className="relative z-10 flex-shrink-0">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-[rgb(var(--color-primary))] bg-[rgb(var(--color-bg))] shadow-md text-[rgb(var(--color-primary))] transition-all duration-500 group-hover/step:scale-110 group-hover/step:bg-[rgb(var(--color-primary))] group-hover/step:text-white">
                                                <Icon name={step.iconKey} className="h-6 w-6 transition-transform duration-500 group-hover/step:scale-110" />
                                            </div>
                                            <div className="absolute -top-1.5 -right-1.5 flex h-5.5 w-5.5 items-center justify-center rounded-full bg-[rgb(var(--color-primary))] text-[10px] font-bold text-white shadow-sm">
                                                {String(index + 1).padStart(2, '0')}
                                            </div>
                                        </div>

                                        {/* Card */}
                                        <div className="flex-1 rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-5 shadow-sm transition-all duration-500 group-hover/step:-translate-y-1 group-hover/step:shadow-md group-hover/step:border-[rgb(var(--color-primary))]/30">
                                            <h4 className="mb-1.5 font-sans text-base font-semibold text-[rgb(var(--color-text))] transition-colors duration-300 group-hover/step:text-[rgb(var(--color-primary))]">
                                                {step.title}
                                            </h4>
                                            <p className="text-sm leading-relaxed text-[rgb(var(--color-text-muted))]">
                                                {step.text}
                                            </p>
                                        </div>

                                        {/* Arrow connector */}
                                        {index < howItWorksSteps.length - 1 && (
                                            <div className="absolute left-[31px] top-[56px] z-20 flex h-5 w-5 items-center justify-center text-[rgb(var(--color-primary))] opacity-60">
                                                <Icon name="ChevronDown" className="h-3.5 w-3.5" />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Owner Section */}
            <section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="grid grid-cols-1 items-center gap-4 md:grid-cols-2"
                >
                    <motion.div
                        variants={fadeInUp}
                        className="relative w-full aspect-[3/4] max-w-md overflow-hidden rounded-2xl shadow-xl group/owner"
                    >
                        <img
                            className="h-full w-full object-cover object-top transition-transform duration-700 group-hover/owner:scale-105"
                            alt="James Mitchell"
                            src={import.meta.env.BASE_URL + 'images/doctor.webp'}
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8 text-white transition-transform duration-500 group-hover/owner:translate-y-[-4px]">
                            <p className="font-sans text-2xl font-semibold">James Mitchell</p>
                            <p className="text-white/80">Founder &amp; Owner</p>
                        </div>
                    </motion.div>

                    <motion.div variants={staggerContainer} className="flex flex-col items-start gap-8">
                        <motion.span variants={fadeInUp} className="kicker">The Visionary</motion.span>
                        <motion.h2 variants={fadeInUp} className="font-sans text-3xl lg:text-4xl font-bold leading-tight text-[rgb(var(--color-text))]">
                            &quot;True care requires a synthesis of unyielding precision and profound empathy.&quot;
                        </motion.h2>
                        <motion.div variants={fadeInUp} className="h-1 w-16 bg-[rgb(var(--color-primary))] rounded-full" />
                        <motion.p variants={fadeInUp} className="text-lg text-[rgb(var(--color-text-muted))] leading-relaxed">
                            Founded by James Mitchell, Medical Store was established to elevate the standard of pharmaceutical provision. We are committed to providing quality pharmaceutical care to every customer.
                        </motion.p>
                        <motion.div variants={fadeInUp}>
                            <Link to="/about" className="glass-button-secondary">
                                Read Our Full Story
                            </Link>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Newsletter */}
            <section className="bg-[rgb(var(--color-bg-subtle))] py-24 relative overflow-hidden">
                <div className="mx-auto max-w-3xl px-4 text-center relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="bg-[rgb(var(--color-surface))] rounded-2xl border border-[rgb(var(--color-border))] shadow-sm p-12 md:p-16"
                    >
                        <motion.div variants={fadeInUp} className="inline-flex bg-[rgb(var(--color-primary))]/10 p-4 rounded-full mb-6 transition-transform duration-300 hover:scale-110 hover:bg-[rgb(var(--color-primary))]/15">
                            <Icon name="Mail" className="h-8 w-8 text-[rgb(var(--color-primary))]" />
                        </motion.div>
                        <motion.h2 variants={fadeInUp} className="display-heading !mb-4">Join The Sanctuary</motion.h2>
                        <motion.p variants={fadeInUp} className="mb-10 text-lg text-[rgb(var(--color-text-muted))]">
                            Subscribe to receive insights on wellness, exclusive product curations, and priority medical updates.
                        </motion.p>
                        <motion.form variants={fadeInUp} onSubmit={handleSubscribe} className="mx-auto flex flex-col sm:flex-row gap-4 max-w-lg">
                            <input
                                type="email"
                                required
                                value={newsletterEmail}
                                onChange={(event) => setNewsletterEmail(event.target.value)}
                                placeholder="Enter your email address"
                                className="flex-1 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-6 py-4 text-sm text-[rgb(var(--color-text))] outline-none focus:border-[rgb(var(--color-primary))] focus:ring-2 focus:ring-[rgb(var(--color-primary))]/20 transition-all duration-300 shadow-sm focus:shadow-md"
                            />
                            <button type="submit" className="glass-button-primary !py-4 !px-8">
                                Subscribe
                            </button>
                        </motion.form>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
