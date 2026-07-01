import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../components/Icons';
import Seo from '../components/Seo';
import notify from '../utils/notifications';
import { trustBadges, howItWorksSteps, collectionCards } from '../data/store';
import { staggerContainer, fadeInUp } from '../constants/animations';
import { buildProductSearchUrl } from '../constants/routes';

export default function Home() {
    const navigate = useNavigate();
    const [heroSearch, setHeroSearch] = useState('');
    const [newsletterEmail, setNewsletterEmail] = useState('');

    const handleHeroSearch = (e) => {
        e.preventDefault();
        const query = heroSearch.trim();
        if (query) {
            navigate(buildProductSearchUrl(query));
        }
    };

    const handleSubscribe = (event) => {
        event.preventDefault();
        notify.success('Newsletter signup submitted.');
        setNewsletterEmail('');
    };

    return (
        <>
            <Seo
                title="Home"
                description="Jaya Medical Store is a curated medical store experience with medicines, prescription uploads, wellness products, and local delivery support."
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
                    <div className="absolute inset-0 bg-[rgb(var(--color-bg))]/75" />
                </div>

                <div className="relative z-10 mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-10 px-5 py-[60px] md:grid-cols-12 md:px-8 lg:px-16">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ staggerChildren: 0.15, delayChildren: 0.2 }}
                        className="flex flex-col items-start gap-9 md:col-span-12 lg:col-span-9"
                    >
                        <motion.span
                            initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            className="inline-block rounded-full bg-[rgb(var(--color-primary))]/10 px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.08em] text-[rgb(var(--color-primary-dark))]"
                        >
                            The Curated Sanctuary
                        </motion.span>
                        <div className="space-y-5">
                            <motion.h1
                                initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                className="max-w-[920px] font-sans text-[68px] font-bold leading-[0.95] text-[rgb(var(--color-text))] lg:text-[76px]"
                                style={{ letterSpacing: '0.03em', wordSpacing: '0.18em' }}
                            >
                                <span className="block whitespace-nowrap">Your Health,</span>
                                <span className="block whitespace-nowrap italic font-normal text-[rgb(var(--color-primary))]">
                                    Our Priority.
                                </span>
                            </motion.h1>
                            <motion.div
                                initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                className="max-w-[920px] text-[19px] leading-[1.6] text-[rgb(var(--color-text-muted))] lg:text-[20px]"
                            >
                                <p>Experience clinical excellence curated for your well-being.</p>
                                <p>We blend rigorous medical standards with a sophisticated approach</p>
                                <p>to personal care, delivering genuine remedies directly to your sanctuary.</p>
                            </motion.div>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col gap-4 pt-4 sm:flex-row"
                        >
                            <Link
                                to="/products"
                                className="inline-flex min-w-[208px] items-center justify-center gap-2 rounded-full bg-[rgb(var(--color-secondary))] px-8 py-4 text-[14px] font-medium tracking-[0.05em] text-[rgb(var(--color-text))] transition-all duration-300 hover:bg-[rgb(var(--color-secondary))]/90 hover:shadow-lg hover:shadow-[rgb(var(--color-secondary))]/30 hover:-translate-y-0.5 active:translate-y-0"
                            >
                                Browse Products
                                <Icon name="ArrowRight" className="h-4 w-4" />
                            </Link>
                            <Link
                                to="/prescription"
                                className="inline-flex min-w-[230px] items-center justify-center gap-2 rounded-full bg-[rgb(var(--color-surface))]/60 backdrop-blur-md border border-[rgb(var(--color-border))]/40 px-8 py-4 text-[14px] font-medium tracking-[0.05em] text-[rgb(var(--color-text))] transition-all duration-300 hover:bg-[rgb(var(--color-surface))]/80 hover:shadow-lg hover:shadow-[rgb(var(--color-surface))]/20 hover:-translate-y-0.5 active:translate-y-0"
                            >
                                <Icon name="Upload" className="h-4 w-4" />
                                Upload Prescription
                            </Link>
                        </motion.div>

                        <motion.form
                            initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            className="mt-6 w-full md:max-w-none md:mr-[-14%] lg:mr-[-18%]"
                            style={{ minWidth: '100%' }}
                            onSubmit={handleHeroSearch}
                        >
                            <label htmlFor="hero-search" className="sr-only">Search</label>
                            <div className="flex items-center gap-3 w-full">
                                <input
                                    id="hero-search"
                                    value={heroSearch}
                                    onChange={(e) => setHeroSearch(e.target.value)}
                                    placeholder="Search for medicines, vitamins, baby care and personal care..."
                                    className="flex-1 min-w-0 bg-[rgb(var(--color-surface))]/80 backdrop-blur-md border border-[rgb(var(--color-border))]/40 shadow-sm rounded-full px-6 py-3.5 text-[15px] outline-none transition-all duration-300 focus:bg-[rgb(var(--color-surface))]/95 focus:shadow-md focus:ring-2 focus:ring-[rgb(var(--color-primary))]/20 placeholder:text-[rgb(var(--color-text-muted))]"
                                />
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[rgb(var(--color-primary))] px-8 py-3.5 text-[14px] font-medium tracking-[0.05em] text-white transition-all duration-300 hover:bg-[rgb(var(--color-primary-dark))] hover:shadow-lg hover:shadow-[rgb(var(--color-primary-dark))]/30 hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    Search
                                </button>
                            </div>
                        </motion.form>
                    </motion.div>
                </div>
            </section>

            {/* Trust Badges */}
            <section className="border-y border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]/50">
                <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="grid grid-cols-2 gap-8 md:grid-cols-4"
                    >
                        {trustBadges.map((badge) => (
                            <motion.div
                                key={badge.title}
                                variants={fadeInUp}
                                className="group flex flex-col items-center gap-4 text-center"
                            >
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] shadow-sm text-[rgb(var(--color-primary))] transition-all duration-300 group-hover:scale-110 group-hover:bg-[rgb(var(--color-primary))]/10 group-hover:shadow-md group-hover:shadow-[rgb(var(--color-primary))]/10">
                                    <Icon name={badge.iconKey} className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
                                </div>
                                <h3 className="text-base font-medium text-[rgb(var(--color-text))] transition-colors duration-200 group-hover:text-[rgb(var(--color-primary))]">{badge.title}</h3>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Collections */}
            <section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
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
            </section>

            {/* Process */}
            <section className="bg-[rgb(var(--color-surface))] border-y border-[rgb(var(--color-border))] py-24 relative overflow-hidden">
                <div className="mx-auto max-w-7xl px-4 md:px-8 relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="mb-16 text-center max-w-2xl mx-auto"
                    >
                        <span className="kicker">How it works</span>
                        <h2 className="display-heading mb-4">A Seamless Process</h2>
                        <p className="text-lg text-[rgb(var(--color-text-muted))]">
                            Acquiring your essential medications should be as calming as the cure itself. Follow our streamlined three-step approach.
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="relative flex flex-col gap-12 md:flex-row md:items-start md:justify-between"
                    >
                        <div className="absolute left-1/2 md:left-0 top-0 md:top-10 h-full md:h-px w-px md:w-full -translate-x-1/2 md:translate-x-0 bg-[rgb(var(--color-border))] md:block" />

                        {howItWorksSteps.map((step, index) => (
                            <motion.div
                                variants={fadeInUp}
                                key={step.title}
                                className="z-10 flex w-full flex-col items-center bg-[rgb(var(--color-surface))] md:bg-transparent px-4 text-center md:w-1/3 pt-4 md:pt-0 group/step"
                            >
                                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] shadow-lg text-[rgb(var(--color-primary))] transition-all duration-300 group-hover/step:scale-110 group-hover/step:shadow-xl group-hover/step:shadow-[rgb(var(--color-primary))]/15">
                                    <Icon name={step.iconKey} className="h-8 w-8 transition-transform duration-300 group-hover/step:scale-110" />
                                </div>
                                <h4 className="mb-3 font-sans text-xl font-semibold text-[rgb(var(--color-text))]">{step.title}</h4>
                                <p className="text-base text-[rgb(var(--color-text-muted))] max-w-xs">{step.text}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Owner Section */}
            <section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="grid grid-cols-1 items-center gap-16 md:grid-cols-2"
                >
                    <motion.div
                        variants={fadeInUp}
                        className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-xl group/owner"
                    >
                        <img
                            className="h-full w-full object-cover transition-transform duration-700 group-hover/owner:scale-105"
                            alt="Madan Mohan Mishra"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvLR3jdxYJOrAIhUGI00WIuVfHFtqPy3-XgSkwQLQHqugGoqmYpqsZecRw6mhaUfUy71UpewC33x5BM_9ICyj2bK9yHfckn5uAn8wV7XSJDDhnFYIU62S9T-904OxYNG9SLYbLW4SgzbCCBitIPaKB3I6pIaJVlnuZ3nYLzgkmSV4cr70WEfsaxWHNJ-bOPvkjSfn5-8XdRuIN2sGao0AKiWPqInpq6OhlEcYVEPHhoNSC5k86ktriB55v4mmYhpg8nW6pefT14Mw"
                            loading="lazy"
                            width="600"
                            height="750"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8 text-white transition-transform duration-500 group-hover/owner:translate-y-[-4px]">
                            <p className="font-sans text-2xl font-semibold">Madan Mohan Mishra</p>
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
                            Founded by Madan Mohan Mishra, Jaya Medical Store was established to elevate the standard of pharmaceutical provision. We view every prescription not merely as a transaction, but as a critical component of your personal health journey.
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
