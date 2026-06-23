import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Seo from '../components/Seo';
import ProductCard from '../components/ProductCard';
import Icon from '../components/Icons';
import { productBrands, productCategories, products } from '../data/products';

const sortOptions = [
    { value: 'popular', label: 'Popularity' },
    { value: 'price-low', label: 'Price: Low → High' },
    { value: 'price-high', label: 'Price: High → Low' },
    { value: 'newest', label: 'Newest First' },
];

export default function Products() {
    const [searchParams] = useSearchParams();
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState(searchParams.get('category') || 'All');
    const [brand, setBrand] = useState('All');
    const [sortBy, setSortBy] = useState('popular');
    const [priceCap, setPriceCap] = useState(3000);
    const [rxOnly, setRxOnly] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const perPage = 8;

    // Simulated API Loading State
    useEffect(() => {
        setLoading(true);
        const timer = window.setTimeout(() => setLoading(false), 800);
        return () => window.clearTimeout(timer);
    }, [searchParams, category, brand, priceCap, rxOnly, search, sortBy, currentPage]);

    useEffect(() => {
        setCategory(searchParams.get('category') || 'All');
        setCurrentPage(1);
    }, [searchParams]);

    const filteredProducts = useMemo(() => {
        const query = search.trim().toLowerCase();

        const result = products
            .filter((product) => (category === 'All' ? true : product.category === category))
            .filter((product) => (brand === 'All' ? true : product.brand === brand))
            .filter((product) => (rxOnly ? product.requiresPrescription : true))
            .filter((product) => product.price <= priceCap)
            .filter((product) => {
                if (!query) return true;
                return [product.name, product.brand, product.description, product.category]
                    .join(' ')
                    .toLowerCase()
                    .includes(query);
            });

        switch (sortBy) {
            case 'price-low':
                return result.sort((left, right) => left.price - right.price);
            case 'price-high':
                return result.sort((left, right) => right.price - left.price);
            case 'newest':
                return result.sort((left, right) => right.id - left.id);
            default:
                return result;
        }
    }, [brand, category, priceCap, search, rxOnly, sortBy]);

    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / perPage));
    const pageItems = filteredProducts.slice((currentPage - 1) * perPage, currentPage * perPage);

    const resetFilters = () => {
        setSearch('');
        setCategory('All');
        setBrand('All');
        setSortBy('popular');
        setPriceCap(3000);
        setRxOnly(false);
        setCurrentPage(1);
    };

    return (
        <>
            <Seo
                title="Products"
                description="Browse medicines, vitamins, baby care, personal care, diabetic care, and surgical supplies at Jaya Medical Store."
            />

            {/* Hero header */}
            <section className="bg-lofi border-b border-border relative overflow-hidden">
                <div className="absolute inset-0 bg-bg/70 dark:bg-bg/85 backdrop-blur-[40px] z-0" />
                <div className="mx-auto max-w-7xl px-4 py-12 md:py-20 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
                    >
                        <div className="max-w-2xl">
                            <span className="kicker flex items-center gap-2">
                                <Icon name="Pill" className="h-4 w-4" /> Our Products
                            </span>
                            <h1 className="display-heading !mb-2">
                                Browse our <span className="text-primary italic font-normal">curated</span> collection
                            </h1>
                            <p className="text-lg text-text-muted mt-4">
                                Filter by category, brand, prescription requirement, or price. Find exactly what you need with calm, clear navigation.
                            </p>
                        </div>

                        {/* Product count badge */}
                        <div className="glass-card px-6 py-3 flex items-center gap-3">
                            <div className="bg-primary/20 p-2 rounded-lg">
                                <Icon name="PackageSearch" className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-text-muted font-medium">Showing</p>
                                <p className="text-lg font-bold text-text">{filteredProducts.length} items</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Main content */}
            <section className="mx-auto max-w-7xl px-4 py-12 md:py-20">
                <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
                    
                    {/* ─── Filters sidebar ─── */}
                    <motion.aside
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="glass-card p-5 h-fit sticky top-24"
                    >
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                            <div className="flex items-center gap-2">
                                <Icon name="Filter" className="h-4 w-4 text-primary" />
                                <h2 className="font-serif text-lg font-semibold text-text">Filters</h2>
                            </div>
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="text-[11px] font-semibold uppercase tracking-wider text-primary hover:text-primary-dark transition-colors"
                            >
                                Reset
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Search */}
                            <label className="block space-y-1.5">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Search</span>
                                <div className="flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2 transition-colors focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20">
                                    <Icon name="Search" className="h-3.5 w-3.5 text-text-muted" />
                                    <input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search..."
                                        className="w-full bg-transparent text-[13px] text-text outline-none placeholder:text-text-muted"
                                    />
                                </div>
                            </label>

                            {/* Category */}
                            <label className="block space-y-1.5">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Category</span>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-[13px] text-text outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20 appearance-none"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1em' }}
                                >
                                    {productCategories.map((option) => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </label>

                            {/* Brand */}
                            <label className="block space-y-1.5">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Brand</span>
                                <select
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-[13px] text-text outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20 appearance-none"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1em' }}
                                >
                                    <option value="All">All Brands</option>
                                    {productBrands.map((option) => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </label>

                            {/* Price range */}
                            <label className="block space-y-1.5">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Price Range</span>
                                <div className="rounded-lg border border-border bg-bg p-3">
                                    <input
                                        type="range"
                                        min="50"
                                        max="3000"
                                        step="1"
                                        value={priceCap}
                                        onChange={(e) => setPriceCap(Number(e.target.value))}
                                        className="w-full accent-primary h-1.5 bg-border rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="mt-3 flex items-center justify-between text-[11px] text-text-muted">
                                        <span>₹50</span>
                                        <span className="font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">Up to ₹{priceCap}</span>
                                    </div>
                                </div>
                            </label>

                            {/* Sort By */}
                            <label className="block space-y-1.5">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Sort By</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-[13px] text-text outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20 appearance-none"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1em' }}
                                >
                                    {sortOptions.map((option) => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </label>

                            {/* Rx only */}
                            <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-bg px-3 py-3 text-[13px] font-medium text-text transition-colors hover:border-primary mt-2">
                                <input
                                    type="checkbox"
                                    checked={rxOnly}
                                    onChange={(e) => setRxOnly(e.target.checked)}
                                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                                />
                                Prescription required
                            </label>
                        </div>
                    </motion.aside>

                    {/* ─── Product grid ─── */}
                    <div className="space-y-10 min-h-[600px]">
                        <AnimatePresence mode="wait">
                            {loading ? (
                                <motion.div
                                    key="skeleton"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
                                >
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i} className="glass-card h-[420px] animate-pulse overflow-hidden flex flex-col">
                                            <div className="h-48 bg-border/50" />
                                            <div className="p-5 space-y-4 flex-grow flex flex-col justify-between">
                                                <div>
                                                    <div className="h-3 w-16 bg-border rounded-full mb-3" />
                                                    <div className="h-5 w-3/4 bg-border/80 rounded-full mb-2" />
                                                    <div className="h-4 w-1/2 bg-border/60 rounded-full" />
                                                </div>
                                                <div className="flex justify-between items-end">
                                                    <div className="h-6 w-20 bg-border/80 rounded-full" />
                                                    <div className="h-6 w-16 bg-border/40 rounded-full" />
                                                </div>
                                                <div className="h-12 w-full bg-border/50 rounded-xl" />
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            ) : pageItems.length ? (
                                <motion.div
                                    key="content"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
                                >
                                    {pageItems.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="glass-card flex flex-col items-center justify-center py-20 px-8 text-center"
                                >
                                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-bg border border-border shadow-inner text-primary mb-6">
                                        <Icon name="PackageSearch" className="h-10 w-10 opacity-50" />
                                    </div>
                                    <h2 className="font-serif text-3xl font-semibold text-text mb-3">
                                        No products found
                                    </h2>
                                    <p className="max-w-md text-base text-text-muted mb-8">
                                        We couldn't find anything matching your filters. Try adjusting your search criteria or resetting the filters.
                                    </p>
                                    <button onClick={resetFilters} className="glass-button-primary">
                                        <Icon name="RefreshCw" className="h-4 w-4" />
                                        Clear All Filters
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Pagination */}
                        {!loading && totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 pt-8 border-t border-border">
                                <button 
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="glass-button p-2 text-text-muted disabled:opacity-30"
                                >
                                    <Icon name="ChevronLeft" className="w-5 h-5" />
                                </button>
                                
                                <div className="flex gap-2 bg-surface p-1 rounded-full border border-border shadow-sm">
                                    {Array.from({ length: totalPages }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`w-10 h-10 rounded-full text-sm font-semibold transition-all duration-200 flex items-center justify-center ${
                                                i + 1 === currentPage
                                                    ? 'bg-primary text-white shadow-md'
                                                    : 'text-text-muted hover:bg-bg hover:text-text'
                                            }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>

                                <button 
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="glass-button p-2 text-text-muted disabled:opacity-30"
                                >
                                    <Icon name="ChevronRight" className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}