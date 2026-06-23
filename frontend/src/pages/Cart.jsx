import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Seo from '../components/Seo';
import Icon from '../components/Icons';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function Cart() {
    const { items, setItemQuantity, removeFromCart, clearCart, subtotal } = useCart();

    const deliveryCharge = subtotal > 999 || subtotal === 0 ? 0 : 49;
    const taxes = Math.round(subtotal * 0.05);
    const [promoCode, setPromoCode] = useState('JAYA10');
    const discount = promoCode === 'JAYA10' ? Math.round(subtotal * 0.1) : 0;
    const total = Math.max(0, subtotal + deliveryCharge + taxes - discount);

    const applyPromo = () => {
        if (promoCode.trim().toUpperCase() === 'JAYA10') {
            toast.success('Promo code applied.');
        } else {
            toast.error('Promo code not recognized.');
        }
    };

    if (!items.length) {
        return (
            <>
                <Seo title="Cart" description="Review the items in your pharmacy cart." />
                <section className="min-h-[calc(100vh-72px)] bg-lofi relative flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-bg/80 dark:bg-bg/90 backdrop-blur-[50px] z-0" />
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card max-w-md w-full p-12 text-center relative z-10"
                    >
                        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
                            <Icon name="ShoppingCart" className="h-10 w-10" />
                        </div>
                        <h1 className="font-serif text-3xl font-semibold text-text mb-3">Your cart is empty</h1>
                        <p className="text-text-muted mb-8 leading-relaxed">
                            Browse our curated collection of medicines and wellness essentials to start your order.
                        </p>
                        <Link to="/products" className="glass-button-primary w-full py-3">
                            Browse Products
                        </Link>
                    </motion.div>
                </section>
            </>
        );
    }

    return (
        <>
            <Seo title="Cart" description="Review items, apply a promo code, and proceed to checkout." />
            
            <div className="min-h-[calc(100vh-72px)] bg-surface relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-96 bg-primary/10 blur-[100px] pointer-events-none" />
                
                <div className="mx-auto max-w-7xl px-4 py-12 md:py-20 lg:px-8 relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-10"
                    >
                        <span className="kicker">Checkout</span>
                        <h1 className="display-heading !mb-2">Review your order</h1>
                    </motion.div>

                    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] xl:grid-cols-[1.2fr_0.8fr]">
                        <div className="space-y-4">
                            <AnimatePresence mode="popLayout">
                                {items.map((item) => (
                                    <motion.div 
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.3 }}
                                        key={item.id} 
                                        className="glass-card flex flex-col gap-6 p-5 sm:flex-row relative group"
                                    >
                                        <div className="relative h-40 w-full sm:h-32 sm:w-32 flex-shrink-0 overflow-hidden rounded-2xl bg-bg">
                                            <img src={item.image} alt={item.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        </div>
                                        
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">{item.category}</p>
                                                    <h2 className="font-serif text-xl font-medium text-text line-clamp-1">{item.name}</h2>
                                                    <p className="text-sm text-text-muted mt-1">{item.brand}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        removeFromCart(item.id);
                                                        toast.success(`${item.name} removed`);
                                                    }}
                                                    className="p-2 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                                                    aria-label="Remove item"
                                                >
                                                    <Icon name="Trash2" className="h-5 w-5" />
                                                </button>
                                            </div>
                                            
                                            <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                                                <div>
                                                    <p className="text-xl font-bold text-text">₹{item.price}</p>
                                                    <p className="text-xs text-text-muted mt-0.5">MRP ₹{item.mrp}</p>
                                                </div>
                                                
                                                <div className="flex items-center rounded-xl border border-border bg-bg/50 p-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => setItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                        className="p-1.5 hover:bg-surface rounded-lg transition-colors text-text-muted hover:text-text"
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <Icon name="Minus" className="h-4 w-4" />
                                                    </button>
                                                    <span className="w-10 text-center text-sm font-semibold text-text">{item.quantity}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setItemQuantity(item.id, item.quantity + 1)}
                                                        className="p-1.5 hover:bg-surface rounded-lg transition-colors text-text-muted hover:text-text"
                                                        aria-label="Increase quantity"
                                                    >
                                                        <Icon name="Plus" className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-6 lg:sticky lg:top-28 h-fit"
                        >
                            <div className="glass-card p-6 md:p-8">
                                <div className="flex items-center justify-between border-b border-border pb-6 mb-6">
                                    <h2 className="font-serif text-2xl font-semibold text-text">Order summary</h2>
                                    <button type="button" onClick={clearCart} className="text-sm font-medium text-text-muted hover:text-primary transition-colors">
                                        Clear cart
                                    </button>
                                </div>

                                <div className="space-y-4 text-sm">
                                    <SummaryRow label="Subtotal" value={`₹${subtotal}`} />
                                    <SummaryRow label="Delivery charge" value={deliveryCharge ? `₹${deliveryCharge}` : 'Free'} />
                                    <SummaryRow label="GST (5%)" value={`₹${taxes}`} />
                                    
                                    {discount > 0 && (
                                        <SummaryRow label="Promo discount" value={`-₹${discount}`} valueClass="text-green-500 font-medium" />
                                    )}
                                    
                                    <div className="border-t border-border pt-4 mt-6">
                                        <div className="flex items-center justify-between">
                                            <span className="text-base font-semibold text-text">Total</span>
                                            <span className="font-serif text-3xl font-bold text-text">₹{total}</span>
                                        </div>
                                        <p className="text-xs text-text-muted mt-1 text-right">Inclusive of all taxes</p>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card p-6 md:p-8">
                                <label className="block text-sm font-medium text-text mb-3">
                                    Promo code
                                </label>
                                <div className="flex gap-3">
                                    <input
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                        placeholder="Enter code (e.g. JAYA10)"
                                        className="w-full rounded-xl border border-border bg-bg px-4 py-3 outline-none focus:border-primary transition-colors text-sm placeholder:text-text-muted/60"
                                    />
                                    <button
                                        type="button"
                                        onClick={applyPromo}
                                        className="glass-button-secondary px-6"
                                    >
                                        Apply
                                    </button>
                                </div>

                                <Link
                                    to="/contact"
                                    className="glass-button-primary w-full mt-6 py-4 justify-center"
                                >
                                    Proceed to Checkout
                                    <Icon name="ArrowRight" className="h-4 w-4 ml-1" />
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
}

function SummaryRow({ label, value, valueClass = "text-text" }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-text-muted">{label}</span>
            <span className={`font-medium ${valueClass}`}>{value}</span>
        </div>
    );
}
