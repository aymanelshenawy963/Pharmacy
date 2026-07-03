import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';
import notify from '../utils/notifications';
import { PLACEHOLDER_IMG, calculateDiscount } from '../constants/ui';
import Icon from './Icons';

function ProductCard({ product }) {
    const { addToCart } = useCart();
    const price = product.price ?? 0;
    const mrp = product.mrp ?? 0;
    const discount = calculateDiscount(price, mrp);
    const image = product.image || PLACEHOLDER_IMG;
    const stock = product.stock ?? 0;
    const inStock = stock > 0;
    const rating = product.rating ?? null;

    const handleAddToCart = async (e) => {
        e.preventDefault();
        if (!inStock) return;
        const added = await addToCart(product);
        if (added) {
            notify.success(
                <div className="flex items-center gap-2">
                    <div className="bg-[rgb(var(--color-primary))]/15 p-1 rounded-lg">
                        <img src={image} alt="" className="w-6 h-6 object-cover rounded-md" />
                    </div>
                    <span className="text-sm font-medium">Added to cart</span>
                </div>
            );
        }
    };

    return (
        <article className="h-full group">
            <div className="bg-[rgb(var(--color-surface))] rounded-2xl border border-[rgb(var(--color-border))] shadow-sm flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-md hover:shadow-[rgb(var(--color-primary))]/5 hover:border-[rgb(var(--color-primary))]/20 hover:-translate-y-1">
                <Link to={`/products/${product.id}`} className="flex flex-col flex-grow">
                    {/* Image Section */}
                    <div className="relative overflow-hidden bg-[rgb(var(--color-bg-subtle))] aspect-square sm:aspect-[4/3] flex-shrink-0">
                        <img
                            src={image}
                            alt={product.name}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Badges */}
                        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                            {discount > 0 && (
                                <span className="rounded-lg bg-[rgb(var(--color-primary))] px-2.5 py-1 text-xs font-bold text-white shadow-md animate-[scaleIn_0.3s_cubic-bezier(0.16,1,0.3,1)_both]">
                                    {discount}% OFF
                                </span>
                            )}
                            {!inStock && (
                                <span className="rounded-lg bg-red-500 px-2.5 py-1 text-xs font-bold text-white shadow-md">
                                    Out of Stock
                                </span>
                            )}
                        </div>

                        {/* Quick View Button */}
                        <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
                            <span className="glass-button !bg-white/90 dark:!bg-zinc-800/90 !text-[rgb(var(--color-text))] !px-4 !py-2 !rounded-xl shadow-lg text-xs font-medium backdrop-blur-md border border-[rgb(var(--color-border))]">
                                <Icon name="Eye" className="w-3.5 h-3.5" /> Quick View
                            </span>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col flex-grow p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[rgb(var(--color-primary))] mb-1.5">
                            {product.category}
                        </p>
                        <h3 className="font-sans text-base font-semibold leading-tight text-[rgb(var(--color-text))] mb-1.5 line-clamp-2">
                            {product.name}
                        </h3>
                        <p className="text-xs text-[rgb(var(--color-text-muted))] line-clamp-2 mb-3 flex-grow">
                            {product.description}
                        </p>

                        {/* Rating */}
                        {rating != null && (
                            <div className="flex items-center gap-1.5 mb-2">
                                <div className="flex items-center gap-0.5">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Icon
                                            key={i}
                                            name="Star"
                                            className={`w-3.5 h-3.5 ${i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-[11px] font-medium text-[rgb(var(--color-text-muted))]">
                                    {rating}
                                </span>
                            </div>
                        )}

                        {/* Price */}
                        <div className="flex items-end justify-between gap-2 mt-auto">
                            <div>
                                <p className="text-xl font-bold text-[rgb(var(--color-text))]">{formatPrice(price)}</p>
                                {discount > 0 && (
                                    <p className="text-[11px] text-[rgb(var(--color-text-muted))]">
                                        MRP <span className="line-through">{formatPrice(mrp)}</span>
                                    </p>
                                )}
                            </div>
                            {/* Stock status */}
                            {inStock ? (
                                <span className="text-[10px] font-semibold text-green-600 dark:text-green-400">
                                    In Stock
                                </span>
                            ) : (
                                <span className="text-[10px] font-semibold text-red-500 dark:text-red-400">
                                    Out of Stock
                                </span>
                            )}
                        </div>
                    </div>
                </Link>

                {/* Actions */}
                <div className="p-3 pt-0 flex flex-col gap-2">
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={!inStock}
                        className="w-full glass-button-primary !rounded-xl !py-2.5 !text-sm justify-center active:scale-[0.97] transition-transform duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
                    >
                        <Icon name="ShoppingCart" className="h-3.5 w-3.5" />
                        {inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                    <Link
                        to={`/products/${product.id}`}
                        className="w-full glass-button-secondary !rounded-xl !py-2.5 !text-sm justify-center active:scale-[0.97] transition-transform duration-150"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Icon name="Eye" className="h-3.5 w-3.5" />
                        View Details
                    </Link>
                </div>
            </div>
        </article>
    );
}

export default memo(ProductCard);
