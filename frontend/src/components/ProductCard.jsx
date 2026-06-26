import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import Icon from './Icons';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const discount = Math.max(0, Math.round(((product.mrp - product.price) / product.mrp) * 100));

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(product);
        toast.success(
            <div className="flex items-center gap-2">
                <div className="bg-[rgb(var(--color-primary))]/15 p-1 rounded-lg">
                    <img src={product.image} alt="" className="w-6 h-6 object-cover rounded-md" />
                </div>
                <span className="text-sm font-medium">Added to cart</span>
            </div>
        );
    };

    return (
        <motion.article
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="h-full"
        >
            <div className="glass-card glass-card-hover group flex flex-col h-full overflow-hidden">
                <Link to={`/products/${product.id}`} className="flex flex-col flex-grow">
                    {/* Image Section */}
                    <div className="relative overflow-hidden bg-[rgb(var(--color-bg-subtle))] aspect-square sm:aspect-[4/3] flex-shrink-0">
                        <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Badges */}
                        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                            {discount > 0 && (
                                <motion.span
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="rounded-lg bg-[rgb(var(--color-primary))] px-2.5 py-1 text-xs font-bold text-white shadow-md"
                                >
                                    {discount}% OFF
                                </motion.span>
                            )}
                            {product.requiresPrescription && (
                                <span className="rounded-lg bg-[rgb(var(--color-secondary))] px-2.5 py-1 text-xs font-bold text-white shadow-md">
                                    Rx
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
                        <h3 className="font-serif text-base font-semibold leading-tight text-[rgb(var(--color-text))] mb-1.5 line-clamp-2">
                            {product.name}
                        </h3>
                        <p className="text-xs text-[rgb(var(--color-text-muted))] line-clamp-2 mb-3 flex-grow">
                            {product.description}
                        </p>

                        {/* Price */}
                        <div className="flex items-end justify-between gap-2 mt-auto">
                            <div>
                                <p className="text-xl font-bold text-[rgb(var(--color-text))]">&rupee;{product.price}</p>
                                {discount > 0 && (
                                    <p className="text-[11px] text-[rgb(var(--color-text-muted))]">
                                        MRP <span className="line-through">&rupee;{product.mrp}</span>
                                    </p>
                                )}
                            </div>
                            <span className="rounded-lg bg-[rgb(var(--color-bg-subtle))] border border-[rgb(var(--color-border))] px-2 py-0.5 text-[10px] font-medium text-[rgb(var(--color-text-muted))]">
                                {product.brand}
                            </span>
                        </div>
                    </div>
                </Link>

                {/* Add to cart */}
                <div className="p-3 pt-0">
                    <motion.button
                        type="button"
                        onClick={handleAddToCart}
                        whileTap={{ scale: 0.97 }}
                        className="w-full glass-button-primary !rounded-xl !py-2.5 !text-sm justify-center"
                    >
                        <Icon name="ShoppingCart" className="h-3.5 w-3.5" />
                        Add to Cart
                    </motion.button>
                </div>
            </div>
        </motion.article>
    );
}
