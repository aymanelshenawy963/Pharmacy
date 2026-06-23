import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../components/Icons';
import Seo from '../components/Seo';

const trustBadges = [
    { title: 'Licensed Pharmacy', icon: 'ShieldCheck' },
    { title: '100% Genuine Medicines', icon: 'BadgeCheck' },
    { title: 'Same-Day Delivery', icon: 'Truck' },
    { title: 'Expert Consultation', icon: 'Stethoscope' },
];

const collectionCards = [
    {
        title: 'Medicines',
        description: 'Comprehensive pharmaceutical care, sourced strictly from certified global manufacturers.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD49expR2znvOL7qB6D50TlQBdUgtizsNudzj-6pxZGO_xZrwBSXCI1tLClB139tPjeUY_6-RSdQsD2yhhpf6tFZUFPtMIZcmQ3iUjYJeTAecFa620xx8QxFyaHHsMNNf3AonnjuGpd0y77rbEOkY7l7F50mTmls8pk6ZxEDa7fE9AnmeJB696HS79j8t4SKKfVK3E9iARcmCICR6Wg7twzL2tpHP2awMzcL4kiuvmSHTqft11KiDbtkgPbSfVIqFLIWaG7FLo1xN4',
        large: true,
    },
    {
        title: 'Vitamins',
        description: 'Daily nutritional support.',
        image: import.meta.env.BASE_URL + 'images/vitamins.webp',
    },
    {
        title: 'Personal Care',
        description: 'Premium hygiene essentials.',
        image: import.meta.env.BASE_URL + 'images/personalcare.webp',
    },
    {
        title: 'Baby Care',
        description: 'Gentle pediatric solutions.',
        image: import.meta.env.BASE_URL + 'images/babycare.webp',
    },
    {
        title: 'Diabetic Care',
        description: 'Monitoring and management.',
        image: import.meta.env.BASE_URL + 'images/diabeticcare.webp',
    },
    {
        title: 'Cough & Cold',
        description: 'Relief for coughs, colds, and respiratory discomfort.',
        image: import.meta.env.BASE_URL + 'images/coughandcold.webp',
    },
];

const processSteps = [
    {
        title: '1. Search & Select',
        description: 'Browse our curated inventory to find your prescribed or wellness items.',
        icon: 'Search',
    },
    {
        title: '2. Upload Prescription',
        description: 'Securely submit your medical documents for rapid pharmacist verification.',
        icon: 'Upload',
    },
    {
        title: '3. Direct Delivery',
        description: 'Receive your meticulously packaged order swiftly at your doorstep.',
        icon: 'Truck',
    },
];

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function Home() {
    const [newsletterEmail, setNewsletterEmail] = useState('');

    const handleSubscribe = (event) => {
        event.preventDefault();
        toast.success('Newsletter signup submitted.');
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
                <div className="absolute inset-0 z-0" style={{ backgroundColor: '#b2dfde' }}>
                    <div className="absolute right-0 top-0 bottom-0 w-[58%] overflow-hidden">
                        <img
                            className="h-full w-full object-cover object-right bg-transparent mix-blend-normal"
                            alt="Capsules and soft product composition"
                            src={import.meta.env.BASE_URL + 'images/heroimage.webp'}
                        />
                        <div className="pointer-events-none absolute inset-y-0 left-0 w-[18%] bg-gradient-to-r from-[#b2dfde] via-[#b2dfde]/85 to-transparent" />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] bg-gradient-to-b from-transparent via-[#b2dfde]/70 to-[#b2dfde]" />
                    </div>
                </div>

                <div className="relative z-10 mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-10 px-5 py-[60px] md:grid-cols-12 md:px-8 lg:px-16">
                    <div className="flex flex-col items-start gap-9 md:col-span-12 lg:col-span-9">
                        <span className="inline-block rounded-full bg-[#cce8e7] px-3 py-1 text-[12px] font-bold uppercase tracking-[0.08em] text-[#005049]">
                            The Curated Sanctuary
                        </span>
                        <div className="space-y-5">
                            <h1
                                className="max-w-[920px] font-serif text-[68px] font-bold leading-[0.95] text-slate-900 lg:text-[76px]"
                                style={{ letterSpacing: '0.03em', wordSpacing: '0.18em' }}
                            >
                                <span className="block whitespace-nowrap">Your Health,</span>
                                <span className="block whitespace-nowrap italic font-normal" style={{ color: '#00685f' }}>
                                    Our Priority.
                                </span>
                            </h1>
                            <div className="max-w-[920px] text-[19px] leading-[1.6] text-slate-700 lg:text-[20px]">
                                <p>Experience clinical excellence curated for your well-being.</p>
                                <p>We blend rigorous medical standards with a sophisticated approach</p>
                                <p>to personal care, delivering genuine remedies directly to your sanctuary.</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                            <Link
                                to="/products"
                                className="inline-flex min-w-[208px] items-center justify-center gap-2 rounded-full bg-[#fbbf24] px-8 py-4 text-[14px] font-medium tracking-[0.05em] text-slate-950 transition hover:bg-[#fcd34d]"
                            >
                                Browse Products
                                <Icon name="ArrowRight" className="h-4 w-4" />
                            </Link>
                            <Link
                                to="/prescription"
                                className="inline-flex min-w-[230px] items-center justify-center gap-2 rounded-full bg-white/60 backdrop-blur-md border border-white/40 px-8 py-4 text-[14px] font-medium tracking-[0.05em] text-teal-900 transition hover:bg-white/80"
                            >
                                <Icon name="Upload" className="h-4 w-4" />
                                Upload Prescription
                            </Link>
                        </div>

                        <form className="mt-6 w-full md:max-w-none md:mr-[-14%] lg:mr-[-18%]" style={{ minWidth: '100%' }} onSubmit={(e) => e.preventDefault()}>
                            <label htmlFor="hero-search" className="sr-only">Search</label>
                            <div className="flex items-center gap-3 w-full">
                                <input
                                    id="hero-search"
                                    placeholder="🔍  Search for medicines, vitamins, baby care and personal care..."
                                    className="flex-1 min-w-0 bg-white/80 backdrop-blur-md border border-white/40 shadow-sm rounded-full px-6 py-3 text-[15px] outline-none"
                                />
                                <button type="submit" className="rounded-full bg-[#fbbf24] px-6 py-3 text-sm font-medium tracking-[0.05em] text-slate-950 transition hover:bg-[#fcd34d]">
                                    Search
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* Trust Badges */}
            <section className="border-y border-border bg-surface/50 backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="grid grid-cols-2 gap-8 md:grid-cols-4"
                    >
                        {trustBadges.map((badge) => (
                            <motion.div key={badge.title} variants={fadeInUp} className="group flex flex-col items-center gap-4 text-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-bg border border-border shadow-sm text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/10">
                                    <Icon name={badge.icon} className="h-6 w-6" />
                                </div>
                                <h3 className="text-base font-medium text-text">{badge.title}</h3>
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
                        <p className="text-lg text-text-muted">
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
                                <Link to="/products" className="group relative block w-full h-full overflow-hidden rounded-3xl border border-border shadow-lg">
                                    <img
                                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        alt={card.title}
                                        src={card.image}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    <div className="absolute bottom-0 left-0 p-8 md:p-10 w-full">
                                        <h3 className="mb-3 font-serif text-4xl font-semibold text-white">{card.title}</h3>
                                        <p className="max-w-md text-base text-white/80">{card.description}</p>
                                    </div>
                                </Link>
                            </motion.div>
                        ) : (
                            <motion.div variants={fadeInUp} key={card.title} className="md:col-span-4">
                                <Link to="/products" className="group relative flex flex-col justify-end overflow-hidden rounded-3xl border border-border bg-surface p-6 h-full shadow-md hover:shadow-xl transition-all duration-300">
                                    {card.image && (
                                        <>
                                            <img
                                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                                                alt={card.title}
                                                src={card.image}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
                                        </>
                                    )}
                                    <div className="relative z-10">
                                        <div className="mb-4 inline-flex rounded-xl bg-white/20 backdrop-blur-md p-2 text-white">
                                            <Icon name={card.icon || 'Pill'} className="h-6 w-6" />
                                        </div>
                                        <h3 className="font-serif text-2xl font-medium text-white mb-1">{card.title}</h3>
                                        <p className="text-sm text-white/70 line-clamp-2">{card.description}</p>
                                    </div>
                                </Link>
                            </motion.div>
                        )
                    )}
                </motion.div>
            </section>

            {/* Process */}
            <section className="bg-surface border-y border-border py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-lofi opacity-20 blur-[100px] pointer-events-none" />
                
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
                        <p className="text-lg text-text-muted">
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
                        {/* Connecting Line */}
                        <div className="absolute left-1/2 md:left-0 top-0 md:top-10 h-full md:h-px w-px md:w-full -translate-x-1/2 md:translate-x-0 bg-border md:block" />
                        
                        {processSteps.map((step, index) => (
                            <motion.div variants={fadeInUp} key={step.title} className="z-10 flex w-full flex-col items-center bg-surface md:bg-transparent px-4 text-center md:w-1/3 pt-4 md:pt-0">
                                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-bg border border-border shadow-lg text-primary">
                                    <Icon name={step.icon} className="h-8 w-8" />
                                </div>
                                <h4 className="mb-3 font-serif text-2xl font-medium text-text">{step.title}</h4>
                                <p className="text-base text-text-muted max-w-xs">{step.description}</p>
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
                    <motion.div variants={fadeInUp} className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-2xl">
                        <img
                            className="h-full w-full object-cover"
                            alt="Madan Mohan Mishra"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvLR3jdxYJOrAIhUGI00WIuVfHFtqPy3-XgSkwQLQHqugGoqmYpqsZecRw6mhaUfUy71UpewC33x5BM_9ICyj2bK9yHfckn5uAn8wV7XSJDDhnFYIU62S9T-904OxYNG9SLYbLW4SgzbCCBitIPaKB3I6pIaJVlnuZ3nYLzgkmSV4cr70WEfsaxWHNJ-bOPvkjSfn5-8XdRuIN2sGao0AKiWPqInpq6OhlEcYVEPHhoNSC5k86ktriB55v4mmYhpg8nW6pefT14Mw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8 text-white">
                            <p className="font-serif text-2xl font-medium">Madan Mohan Mishra</p>
                            <p className="text-white/80">Founder & Owner</p>
                        </div>
                    </motion.div>

                    <motion.div variants={staggerContainer} className="flex flex-col items-start gap-8">
                        <motion.span variants={fadeInUp} className="kicker">The Visionary</motion.span>
                        <motion.h2 variants={fadeInUp} className="font-serif text-4xl lg:text-5xl leading-tight text-text">
                            &quot;True care requires a synthesis of unyielding precision and profound empathy.&quot;
                        </motion.h2>
                        <motion.div variants={fadeInUp} className="h-1 w-16 bg-primary rounded-full" />
                        <motion.p variants={fadeInUp} className="text-lg text-text-muted leading-relaxed">
                            Founded by Madan Mohan Mishra, Jaya Medical Store was established to elevate the standard of pharmaceutical provision. We view every prescription not merely as a transaction, but as a critical component of your personal health journey, deserving of the utmost respect and rigorous attention to detail.
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
            <section className="bg-lofi py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-bg/80 dark:bg-bg/90 backdrop-blur-[50px] z-0" />
                <div className="mx-auto max-w-3xl px-4 text-center relative z-10">
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="glass-card p-12 md:p-16"
                    >
                        <motion.div variants={fadeInUp} className="inline-flex bg-primary/10 p-4 rounded-full mb-6">
                            <Icon name="Mail" className="h-8 w-8 text-primary" />
                        </motion.div>
                        <motion.h2 variants={fadeInUp} className="display-heading !mb-4">Join The Sanctuary</motion.h2>
                        <motion.p variants={fadeInUp} className="mb-10 text-lg text-text-muted">
                            Subscribe to receive sophisticated insights on wellness, exclusive product curations, and priority medical updates.
                        </motion.p>
                        <motion.form variants={fadeInUp} onSubmit={handleSubscribe} className="mx-auto flex flex-col sm:flex-row gap-4 max-w-lg">
                            <input
                                type="email"
                                required
                                value={newsletterEmail}
                                onChange={(event) => setNewsletterEmail(event.target.value)}
                                placeholder="Enter your email address"
                                className="flex-1 rounded-full border border-border bg-surface px-6 py-4 text-text outline-none focus:border-primary transition-colors shadow-sm"
                            />
                            <button type="submit" className="glass-button-primary py-4 px-8">
                                Subscribe
                            </button>
                        </motion.form>
                    </motion.div>
                </div>
            </section>
        </>
    );
}