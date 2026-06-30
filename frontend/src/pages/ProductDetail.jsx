import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Seo from '../components/Seo';
import Reveal from '../components/Reveal';
import Icon from '../components/Icons';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';
import notify from '../utils/notifications';
import { normalizeProduct } from '../utils/normalizeProduct';
import { PLACEHOLDER_IMG, calculateDiscount } from '../constants/ui';
import { staggerInfo, infoItem } from '../constants/animations';
import { ROUTES } from '../constants/routes';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadProduct = async (signal) => {
        setLoading(true);
        setError(null);
        setProduct(null);
        setRelatedProducts([]);

        try {
            const data = await productService.getById(id);
            if (signal?.aborted) return;
            const normalized = normalizeProduct(data);
            setProduct(normalized);

            if (normalized.categoryId) {
                try {
                    const related = await productService.getAll({
                        CategoryId: normalized.categoryId,
                        PageSize: 6,
                        PageNumber: 1,
                    });
                    if (!signal?.aborted) {
                        const items = (related.data || [])
                            .map(normalizeProduct)
                            .filter((p) => p.id !== normalized.id)
                            .slice(0, 4);
                        setRelatedProducts(items);
                    }
                } catch {
                    // Related products are non-critical
                }
            }
        } catch (err) {
            if (!signal?.aborted) {
                if (err.status === 404) {
                    setError('not_found');
                } else {
                    notify.errorFromApi(err);
                    setError('error');
                }
            }
        } finally {
            if (!signal?.aborted) setLoading(false);
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        loadProduct(controller.signal);
        return () => controller.abort();
    }, [id]);

    const handleRetry = () => loadProduct();

    const handleAddToCart = async () => {
        if (!product) return;
        const added = await addToCart(product, quantity);
        if (added) {
            notify.success(`${quantity} × ${product.name} added to cart.`);
        }
    };

    if (loading) {
        return (
            <>
                <Seo title="Loading..." description="Loading product details." />
                <div className="border-b border-border bg-bg/50 backdrop-blur-md">
                    <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 text-sm text-text-muted sm:px-6 lg:px-8">
                        <div className="h-4 w-16 bg-border rounded-full animate-pulse" />
                        <div className="h-4 w-4 bg-border rounded-full animate-pulse" />
                        <div className="h-4 w-32 bg-border rounded-full animate-pulse" />
                    </div>
                </div>
                <section className="bg-surface min-h-[calc(100vh-72px)]">
                    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
                        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
                            <div className="bg-bg-subtle aspect-[4/3] rounded-2xl animate-pulse" />
                            <div className="space-y-6">
                                <div className="h-4 w-24 bg-border rounded-full animate-pulse" />
                                <div className="h-10 w-3/4 bg-border rounded-full animate-pulse" />
                                <div className="h-6 w-1/2 bg-border/60 rounded-full animate-pulse" />
                                <div className="h-40 bg-border/30 rounded-2xl animate-pulse" />
                            </div>
                        </div>
                    </div>
                </section>
            </>
        );
    }

    if (error === 'not_found' || (!loading && !product)) {
        return (
            <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 min-h-[60vh] flex flex-col justify-center">
                <Seo title="Product not found" description="The requested product could not be found." />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto w-full max-w-2xl bg-surface p-12 text-center rounded-2xl border border-border shadow-sm"
                >
                    <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20"
                    >
                        <Icon name="PackageSearch" className="h-10 w-10" />
                    </motion.div>
                    <h1 className="mt-6 font-sans text-3xl font-semibold text-text">Product not found</h1>
                    <p className="mt-3 text-base text-text-muted">This product is not in our catalog.</p>
                    <button
                        type="button"
                        onClick={() => navigate(ROUTES.PRODUCTS)}
                        className="glass-button-primary mt-8 inline-flex items-center"
                    >
                        <Icon name="ArrowRight" className="mr-2 h-4 w-4 rotate-180" />
                        Back to Products
                    </button>
                </motion.div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 min-h-[60vh] flex flex-col justify-center">
                <Seo title="Error" description="Failed to load product." />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mx-auto w-full max-w-2xl bg-surface p-12 text-center rounded-2xl border border-border shadow-sm"
                >
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50 text-red-500 border border-red-200">
                        <Icon name="AlertTriangle" className="h-10 w-10" />
                    </div>
                    <h1 className="mt-6 font-sans text-3xl font-semibold text-text">Something went wrong</h1>
                    <p className="mt-3 text-base text-text-muted">Failed to load product details.</p>
                    <button
                        type="button"
                        onClick={handleRetry}
                        className="glass-button-primary mt-8 inline-flex items-center"
                    >
                        <Icon name="RefreshCw" className="mr-2 h-4 w-4" />
                        Try Again
                    </button>
                </motion.div>
            </section>
        );
    }

    const image = product.image || PLACEHOLDER_IMG;
    const price = product.price ?? 0;
    const mrp = product.mrp ?? 0;
    const discount = calculateDiscount(price, mrp);

    return (
        <>
            <Seo
                title={product.name}
                description={`${product.name} — pricing and details.`}
            />

            {/* Breadcrumb */}
            <div className="border-b border-border bg-bg/50 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 text-sm text-text-muted sm:px-6 lg:px-8">
                    <Link to={ROUTES.PRODUCTS} className="transition-colors hover:text-primary">Products</Link>
                    <Icon name="ChevronRight" className="h-3.5 w-3.5" />
                    {product.category && (
                        <>
                            <Link
                                to={`/products?category=${encodeURIComponent(product.category)}`}
                                className="transition-colors hover:text-primary"
                            >
                                {product.category}
                            </Link>
                            <Icon name="ChevronRight" className="h-3.5 w-3.5" />
                        </>
                    )}
                    <span className="text-text font-semibold">{product.name}</span>
                </div>
            </div>

            {/* Main product section */}
            <section className="bg-surface relative overflow-hidden min-h-[calc(100vh-72px)]">
                <div className="absolute top-0 right-0 w-1/2 h-[600px] bg-primary/5 blur-[120px] pointer-events-none" />

                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 relative z-10">
                    <Reveal className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-16">
                        {/* Image */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            whileHover={{ scale: 1.01 }}
                            className="bg-surface overflow-hidden group cursor-zoom-in rounded-2xl border border-border shadow-sm"
                        >
                            <div className="relative bg-bg-subtle aspect-[4/3] w-full overflow-hidden">
                                <img
                                    src={image}
                                    alt={product.name}
                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="absolute left-5 top-5 flex flex-col gap-2">
                                    {discount > 0 && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-bold tracking-widest text-white shadow-lg backdrop-blur-md"
                                        >
                                            {discount}% OFF
                                        </motion.span>
                                    )}
                                    {product.requiresPrescription && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 }}
                                            className="rounded-lg bg-tertiary px-3 py-1.5 text-xs font-bold tracking-widest text-white shadow-lg backdrop-blur-md flex items-center gap-1.5"
                                        >
                                            <Icon name="ShieldCheck" className="w-3.5 h-3.5" />
                                            Rx Required
                                        </motion.span>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Details */}
                        <motion.div
                            variants={staggerInfo}
                            initial="hidden"
                            animate="visible"
                            className="space-y-8"
                        >
                            <motion.div variants={infoItem}>
                                {product.category && (
                                    <span className="kicker !mb-3">
                                        {product.category}
                                    </span>
                                )}
                                <h1 className="display-heading text-4xl sm:text-5xl !mb-2 text-balance">
                                    {product.name}
                                </h1>
                            </motion.div>

                            <motion.div variants={infoItem} className="bg-surface p-8 rounded-2xl border border-border shadow-sm">
                                <div className="flex flex-wrap items-end justify-between gap-6">
                                    <div>
                                        <div className="flex items-baseline gap-3">
                                            <motion.p
                                                key={price}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="font-sans text-4xl font-bold text-text"
                                            >
                                                {formatPrice(price)}
                                            </motion.p>
                                            {discount > 0 && (
                                                <p className="text-lg font-medium text-text-muted line-through">{formatPrice(mrp)}</p>
                                            )}
                                        </div>
                                        <p className="mt-1 text-sm text-text-muted">
                                            Inclusive of all taxes
                                        </p>
                                        {product.stock > 0 && (
                                            <p className="mt-1 text-xs text-green-600 font-medium">
                                                In stock ({product.stock} available)
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center rounded-xl border border-border bg-bg p-1 shadow-sm">
                                        <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            type="button"
                                            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                                            className="flex h-10 w-10 items-center justify-center rounded-lg text-text-muted transition-all duration-200 hover:bg-bg-subtle hover:text-text active:bg-primary/10"
                                            aria-label="Decrease quantity"
                                        >
                                            <Icon name="Minus" className="h-4 w-4" />
                                        </motion.button>
                                        <motion.span
                                            key={quantity}
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ duration: 0.2 }}
                                            className="w-12 text-center text-base font-bold text-text"
                                        >
                                            {quantity}
                                        </motion.span>
                                        <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            type="button"
                                            onClick={() => setQuantity((current) => current + 1)}
                                            className="flex h-10 w-10 items-center justify-center rounded-lg text-text-muted transition-all duration-200 hover:bg-bg-subtle hover:text-text active:bg-primary/10"
                                            aria-label="Increase quantity"
                                        >
                                            <Icon name="Plus" className="h-4 w-4" />
                                        </motion.button>
                                    </div>
                                </div>

                                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="button"
                                        onClick={handleAddToCart}
                                        className="glass-button-primary flex-1 justify-center py-4 text-base"
                                    >
                                        <Icon name="ShoppingCart" className="h-5 w-5 mr-2" />
                                        Add to Cart
                                    </motion.button>
                                    {product.requiresPrescription && (
                                        <Link
                                            to={ROUTES.PRESCRIPTION}
                                            className="glass-button flex-1 justify-center py-4 text-base"
                                        >
                                            <Icon name="Upload" className="h-5 w-5 mr-2" />
                                            Upload Rx
                                        </Link>
                                    )}
                                </div>
                            </motion.div>

                            {product.requiresPrescription && (
                                <motion.div
                                    variants={infoItem}
                                    className="flex items-start gap-4 rounded-2xl border border-tertiary/20 bg-tertiary/5 p-5"
                                >
                                    <Icon name="ShieldCheck" className="mt-0.5 h-6 w-6 shrink-0 text-tertiary" />
                                    <p className="text-sm leading-relaxed text-text-muted">
                                        <strong className="text-text">Prescription Required.</strong> This medicine requires a valid prescription before dispatch. Upload your prescription and our pharmacy will review it carefully.
                                    </p>
                                </motion.div>
                            )}

                            {product.description && (
                                <motion.div variants={infoItem} className="bg-surface p-7 rounded-2xl border border-border shadow-sm">
                                    <h3 className="font-sans text-lg font-semibold text-text mb-3 flex items-center gap-2">
                                        <Icon name="FileText" className="h-5 w-5 text-primary" />
                                        Description
                                    </h3>
                                    <p className="text-base leading-relaxed text-text-muted">
                                        {product.description}
                                    </p>
                                </motion.div>
                            )}
                        </motion.div>
                    </Reveal>
                </div>
            </section>

            {/* Related products */}
            {relatedProducts.length > 0 && (
                <section className="bg-bg py-16 sm:py-24 border-t border-border">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <Reveal className="space-y-10">
                            <div className="flex items-end justify-between gap-6">
                                <div>
                                    <span className="kicker">Related</span>
                                    <h2 className="display-heading text-3xl sm:text-4xl !mb-0">
                                        More from {product.category}
                                    </h2>
                                </div>
                                <Link
                                    to={`/products?category=${encodeURIComponent(product.category)}`}
                                    className="hidden items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary transition-opacity hover:opacity-70 md:inline-flex"
                                >
                                    View All
                                    <Icon name="ArrowRight" className="h-4 w-4" />
                                </Link>
                            </div>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {relatedProducts.map((item) => (
                                    <ProductCard key={item.id} product={item} />
                                ))}
                            </div>
                        </Reveal>
                    </div>
                </section>
            )}
        </>
    );
}
