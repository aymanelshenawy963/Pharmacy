import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Seo from '../components/Seo';
import ProductCard from '../components/ProductCard';
import Icon from '../components/Icons';
import { useDebounce } from '../hooks/useDebounce';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { parseApiError } from '../utils/apiErrorHandler';
import toast from 'react-hot-toast';

const sortOptions = [
    { value: '', label: 'Default' },
    { value: 'priceasc', label: 'Price: Low → High' },
    { value: 'pricedesc', label: 'Price: High → Low' },
    { value: 'nameasc', label: 'Name: A → Z' },
    { value: 'namedesc', label: 'Name: Z → A' },
];

const staggerGrid = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.06 }
    }
};

const gridItem = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
    }
};

function normalizeProduct(p) {
    return {
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.newPrice,
        mrp: p.oldPrice,
        category: p.categoryName,
        image: p.photos?.[0] || null,
        requiresPrescription: p.requiresPrescription,
    };
}

export default function Products() {
    const [searchParams] = useSearchParams();
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState(searchParams.get('category') || 'All');
    const [sortBy, setSortBy] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [products, setProducts] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [categories, setCategories] = useState([]);

    const debouncedSearch = useDebounce(search, 400);
    const perPage = 6;
    const categoriesRef = useRef(categories);
    categoriesRef.current = categories;

    // Fetch categories on mount
    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            try {
                const data = await categoryService.getAll();
                if (!controller.signal.aborted) setCategories(Array.isArray(data) ? data : []);
            } catch {
                // Categories will be empty; filter dropdown shows only "All"
            }
        })();
        return () => controller.abort();
    }, []);

    // Fetch products when filters change
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = { PageSize: perPage, PageNumber: currentPage };
            if (debouncedSearch.trim()) params.Search = debouncedSearch.trim();
            if (category !== 'All') {
                const match = categoriesRef.current.find(
                    (c) => c.name.toLowerCase() === category.toLowerCase(),
                );
                if (match) params.CategoryId = match.id;
            }
            if (sortBy) params.Sort = sortBy;

            const data = await productService.getAll(params);

            const items = (data.data || []).map(normalizeProduct);
            setProducts(items);
            setTotalCount(data.totalCount ?? items.length);
            setTotalPages(data.totalPages ?? 1);
        } catch (err) {
            const msgs = parseApiError(err);
            setError(msgs.join(' '));
            setProducts([]);
            setTotalCount(0);
            setTotalPages(1);
            toast.error(msgs.join(' '));
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, category, sortBy, currentPage]);

    useEffect(() => {
        const controller = new AbortController();
        fetchProducts();
        return () => controller.abort();
    }, [fetchProducts]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, category, sortBy]);

    // Sync category from URL params
    useEffect(() => {
        setCategory(searchParams.get('category') || 'All');
    }, [searchParams]);

    const resetFilters = () => {
        setSearch('');
        setCategory('All');
        setSortBy('');
        setCurrentPage(1);
    };

    return (
        <>
            <Seo
                title="Products"
                description="Browse medicines, vitamins, and wellness essentials at Jaya Medical Store."
            />

            {/* Hero header */}
            <section className="bg-bg-subtle border-b border-border relative overflow-hidden">
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
                                Browse our <span className="text-primary">curated</span> collection
                            </h1>
                            <p className="text-lg text-text-muted mt-4">
                                Filter by category, search by name, or sort to find exactly what you need.
                            </p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                            className="bg-surface px-6 py-3 flex items-center gap-3 rounded-2xl border border-border shadow-sm"
                        >
                            <div className="bg-primary/20 p-2 rounded-lg">
                                <Icon name="PackageSearch" className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-text-muted font-medium">Showing</p>
                                <p className="text-lg font-bold text-text">{totalCount} items</p>
                            </div>
                        </motion.div>
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
                        className="bg-surface p-5 h-fit sticky top-24 rounded-2xl border border-border shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                            <div className="flex items-center gap-2">
                                <Icon name="Filter" className="h-4 w-4 text-primary" />
                                <h2 className="font-sans text-lg font-semibold text-text">Filters</h2>
                            </div>
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="text-[11px] font-semibold uppercase tracking-wider text-primary hover:text-primary-dark transition-all duration-200 hover:underline"
                            >
                                Reset
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Search */}
                            <label className="block space-y-1.5">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Search</span>
                                <div className="flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2 transition-all duration-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 focus-within:shadow-sm">
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
                                    className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-[13px] text-text outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:shadow-sm appearance-none cursor-pointer hover:border-primary/40"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1em' }}
                                >
                                    <option value="All">All Categories</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>
                            </label>

                            {/* Sort By */}
                            <label className="block space-y-1.5">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Sort By</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-[13px] text-text outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:shadow-sm appearance-none cursor-pointer hover:border-primary/40"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1em' }}
                                >
                                    {sortOptions.map((option) => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
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
                                    transition={{ duration: 0.3 }}
                                    className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                                >
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.08, duration: 0.4 }}
                                            className="bg-surface h-[420px] animate-pulse overflow-hidden flex flex-col rounded-2xl border border-border shadow-sm"
                                        >
                                            <div className="h-48 bg-gradient-to-r from-border/40 via-border/60 to-border/40 animate-shimmer" />
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
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : error ? (
                                <motion.div
                                    key="error"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4 }}
                                    className="bg-surface flex flex-col items-center justify-center py-20 px-8 text-center rounded-2xl border border-border shadow-sm"
                                >
                                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-50 border border-red-200 text-red-500 mb-6">
                                        <Icon name="AlertTriangle" className="h-10 w-10" />
                                    </div>
                                    <h2 className="font-sans text-3xl font-semibold text-text mb-3">
                                        Something went wrong
                                    </h2>
                                    <p className="max-w-md text-base text-text-muted mb-8">
                                        {error}
                                    </p>
                                    <button onClick={fetchProducts} className="glass-button-primary">
                                        <Icon name="RefreshCw" className="h-4 w-4" />
                                        Try Again
                                    </button>
                                </motion.div>
                            ) : products.length ? (
                                <motion.div
                                    key="content"
                                    variants={staggerGrid}
                                    initial="hidden"
                                    animate="visible"
                                    className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                                >
                                    {products.map((product) => (
                                        <motion.div key={product.id} variants={gridItem}>
                                            <ProductCard product={product} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                    className="bg-surface flex flex-col items-center justify-center py-20 px-8 text-center rounded-2xl border border-border shadow-sm"
                                >
                                    <motion.div
                                        animate={{ y: [0, -8, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                        className="flex h-24 w-24 items-center justify-center rounded-full bg-bg border border-border shadow-inner text-primary mb-6"
                                    >
                                        <Icon name="PackageSearch" className="h-10 w-10 opacity-50" />
                                    </motion.div>
                                    <h2 className="font-sans text-3xl font-semibold text-text mb-3">
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
                        {!loading && !error && totalPages > 1 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex items-center justify-center gap-2 pt-8 border-t border-border"
                            >
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="glass-button p-2 text-text-muted disabled:opacity-30 transition-all duration-200 hover:scale-105"
                                >
                                    <Icon name="ChevronLeft" className="w-5 h-5" />
                                </button>

                                <div className="flex gap-1.5 bg-surface p-1.5 rounded-full border border-border shadow-sm">
                                    {Array.from({ length: totalPages }).map((_, i) => (
                                        <motion.button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            whileTap={{ scale: 0.92 }}
                                            className={`relative w-10 h-10 rounded-full text-sm font-semibold transition-all duration-300 flex items-center justify-center ${
                                                i + 1 === currentPage
                                                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                                                    : 'text-text-muted hover:bg-bg hover:text-text'
                                            }`}
                                        >
                                            {i + 1}
                                        </motion.button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="glass-button p-2 text-text-muted disabled:opacity-30 transition-all duration-200 hover:scale-105"
                                >
                                    <Icon name="ChevronRight" className="w-5 h-5" />
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
