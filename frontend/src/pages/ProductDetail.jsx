import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Seo from '../components/Seo';
import Reveal from '../components/Reveal';
import Icon from '../components/Icons';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/productService';
import { reviewService } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';
import notify from '../utils/notifications';
import { normalizeProduct } from '../utils/normalizeProduct';
import { PLACEHOLDER_IMG, calculateDiscount } from '../constants/ui';
import { staggerInfo, infoItem } from '../constants/animations';
import { ROUTES } from '../constants/routes';
import { Star, MessageSquare, Send } from 'lucide-react';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isAuthenticated, user } = useAuth();
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [reviewsError, setReviewsError] = useState(null);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [reviewFormError, setReviewFormError] = useState('');

    const fetchReviews = async (productId) => {
        setReviewsLoading(true);
        setReviewsError(null);
        try {
            const data = await reviewService.getByProduct(productId);
            setReviews(Array.isArray(data) ? data : []);
        } catch (err) {
            setReviewsError('Failed to load reviews');
        } finally {
            setReviewsLoading(false);
        }
    };

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
            fetchReviews(id);

            // Fetch related products: same category first, then fill with top-selling
            try {
                let items = [];
                if (normalized.categoryId) {
                    const related = await productService.getAll({
                        CategoryId: normalized.categoryId,
                        PageSize: 6,
                        PageNumber: 1,
                    });
                    if (!signal?.aborted) {
                        items = (related.data || [])
                            .map(normalizeProduct)
                            .filter((p) => p.id !== normalized.id);
                    }
                }

                // Fill remaining slots with top-selling products if needed
                if (items.length < 8 && !signal?.aborted) {
                    const topSelling = await productService.getAll({
                        TopSelling: true,
                        PageSize: 8,
                        PageNumber: 1,
                    });
                    if (!signal?.aborted) {
                        const existingIds = new Set(items.map((p) => p.id));
                        existingIds.add(normalized.id);
                        const extras = (topSelling.data || [])
                            .map(normalizeProduct)
                            .filter((p) => !existingIds.has(p.id));
                        items = [...items, ...extras];
                    }
                }

                if (!signal?.aborted) {
                    setRelatedProducts(items.slice(0, 8));
                }
            } catch {
                // Related products are non-critical
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

    async function handleReviewSubmit(e) {
        e.preventDefault();
        if (reviewForm.rating === 0) {
            setReviewFormError('Please select a rating.');
            return;
        }
        if (!reviewForm.comment.trim()) {
            setReviewFormError('Please write a comment.');
            return;
        }
        setReviewFormError('');
        setIsSubmittingReview(true);
        try {
            await reviewService.create({
                productId: Number(id),
                rating: reviewForm.rating,
                comment: reviewForm.comment.trim(),
            });
            notify.success('Review submitted successfully!');
            setReviewForm({ rating: 0, comment: '' });
            setHoverRating(0);
            await fetchReviews(id);
        } catch (err) {
            notify.errorFromApi(err, 'Failed to submit review');
        } finally {
            setIsSubmittingReview(false);
        }
    }

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
                <section className="bg-bg min-h-[calc(100vh-72px)]">
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
                                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20">
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
            <section className="bg-bg relative overflow-hidden min-h-[calc(100vh-72px)]">
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
                                            <p className="mt-1 text-xs text-green-600 dark:text-green-400 font-medium">
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
                                </div>
                            </motion.div>

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
                                        {product.category ? `More from ${product.category}` : 'You May Also Like'}
                                    </h2>
                                </div>
                                {product.category && (
                                    <Link
                                        to={`/products?category=${encodeURIComponent(product.category)}`}
                                        className="hidden items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary transition-opacity hover:opacity-70 md:inline-flex"
                                    >
                                        View All
                                        <Icon name="ArrowRight" className="h-4 w-4" />
                                    </Link>
                                )}
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

            {/* Reviews Section */}
            <section className="bg-bg py-16 sm:py-24 border-t border-border">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Reveal className="space-y-10">
                        <div>
                            <span className="kicker">Feedback</span>
                            <h2 className="display-heading text-3xl sm:text-4xl !mb-0">
                                Customer Reviews
                            </h2>
                        </div>

                        {reviewsLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="h-10 w-10 rounded-full bg-border animate-pulse" />
                                            <div className="space-y-2 flex-1">
                                                <div className="h-3 w-24 bg-border rounded-full animate-pulse" />
                                                <div className="h-3 w-16 bg-border/60 rounded-full animate-pulse" />
                                            </div>
                                        </div>
                                        <div className="h-4 w-full bg-border/30 rounded-full animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        ) : reviewsError ? (
                            <div className="bg-surface rounded-2xl border border-border p-8 text-center shadow-sm">
                                <p className="text-sm text-red-500">{reviewsError}</p>
                                <button
                                    onClick={() => fetchReviews(id)}
                                    className="glass-button-secondary !px-4 !py-2 text-sm mt-4 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Retry
                                </button>
                            </div>
                        ) : reviews.length === 0 ? (
                            <div className="bg-surface rounded-2xl border border-border p-8 sm:p-12 text-center shadow-sm">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-bg-subtle ring-1 ring-border">
                                    <MessageSquare className="h-7 w-7 text-text-muted" />
                                </div>
                                <h3 className="mt-4 font-sans text-lg font-bold text-text">
                                    No reviews yet
                                </h3>
                                <p className="mt-2 text-sm text-text-muted">
                                    Be the first to share your thoughts about this product.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {reviews.map((review, idx) => (
                                    <motion.div
                                        key={review.id}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05, duration: 0.3 }}
                                        className="bg-surface rounded-2xl border border-border p-5 sm:p-6 shadow-sm"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                                                    {(review.reviewerName || 'A')[0].toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-text truncate">
                                                        {review.reviewerName}
                                                    </p>
                                                    <p className="text-xs text-text-muted mt-0.5">
                                                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-0.5 flex-shrink-0">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        size={14}
                                                        className={star <= review.rating
                                                            ? 'fill-amber-400 text-amber-400'
                                                            : 'text-border'
                                                        }
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="mt-3 text-sm leading-relaxed text-text-muted">
                                            {review.comment}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* Review Form */}
                        {isAuthenticated && (
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-surface rounded-2xl border border-border p-5 sm:p-6 shadow-sm"
                            >
                                <h3 className="font-sans text-lg font-semibold text-text mb-4 flex items-center gap-2">
                                    <MessageSquare size={18} className="text-primary" />
                                    Write a Review
                                </h3>
                                <form onSubmit={handleReviewSubmit} className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-text mb-2">Rating</p>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => {
                                                        setReviewForm((prev) => ({ ...prev, rating: star }));
                                                        setReviewFormError('');
                                                    }}
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    className="p-0.5 transition-transform duration-150 hover:scale-110 active:scale-90"
                                                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                                                >
                                                    <Star
                                                        size={22}
                                                        className={(hoverRating || reviewForm.rating) >= star
                                                            ? 'fill-amber-400 text-amber-400'
                                                            : 'text-border'
                                                        }
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="review-comment" className="text-sm font-medium text-text mb-1.5 block">
                                            Comment
                                        </label>
                                        <textarea
                                            id="review-comment"
                                            rows={3}
                                            value={reviewForm.comment}
                                            onChange={(e) => {
                                                setReviewForm((prev) => ({ ...prev, comment: e.target.value }));
                                                setReviewFormError('');
                                            }}
                                            placeholder="Share your experience with this product..."
                                            maxLength={1000}
                                            className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-text placeholder:text-text-muted outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none min-h-[80px]"
                                            disabled={isSubmittingReview}
                                        />
                                        <p className="mt-1 text-xs text-text-muted text-right">
                                            {reviewForm.comment.length}/1000
                                        </p>
                                    </div>

                                    {reviewFormError && (
                                        <p className="text-xs font-medium text-red-500">{reviewFormError}</p>
                                    )}

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={isSubmittingReview}
                                            className="glass-button-primary !px-5 !py-2.5 text-sm min-h-[44px] flex items-center gap-2"
                                        >
                                            {isSubmittingReview ? (
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                            ) : (
                                                <Send size={14} />
                                            )}
                                            {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </Reveal>
                </div>
            </section>
        </>
    );
}
