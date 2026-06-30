import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Seo from '../components/Seo';
import Icon from '../components/Icons';
import useCheckout from '../hooks/useCheckout';
import AddressForm from '../components/checkout/AddressForm';
import DeliveryMethodSelector from '../components/checkout/DeliveryMethodSelector';
import OrderSummary from '../components/checkout/OrderSummary';

export default function Checkout() {
    const {
        items,
        subtotal,
        address,
        errors,
        deliveryMethodId,
        setDeliveryMethodId,
        deliveryPrice,
        total,
        submitting,
        handleChange,
        handleSubmit,
    } = useCheckout();

    if (!items.length) {
        return (
            <>
                <Seo title="Checkout" description="Complete your order." />
                <section className="min-h-[calc(100vh-72px)] bg-bg-subtle relative flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="bg-surface max-w-md w-full p-12 text-center relative z-10 rounded-2xl border border-border shadow-sm"
                    >
                        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
                            <Icon name="ShoppingCart" className="h-10 w-10" />
                        </div>
                        <h1 className="font-sans text-3xl font-semibold text-text mb-3">Your cart is empty</h1>
                        <p className="text-text-muted mb-8 leading-relaxed">
                            Add some products before checking out.
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
            <Seo title="Checkout" description="Complete your order with shipping and delivery details." />

            <div className="min-h-[calc(100vh-72px)] bg-surface relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-96 bg-primary/10 blur-[100px] pointer-events-none" />

                <div className="mx-auto max-w-7xl px-4 py-12 md:py-20 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-10"
                    >
                        <span className="kicker">Checkout</span>
                        <h1 className="display-heading !mb-2">Complete your order</h1>
                    </motion.div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] xl:grid-cols-[1.2fr_0.8fr]">
                            {/* Left column — forms */}
                            <div className="space-y-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <AddressForm
                                        address={address}
                                        errors={errors}
                                        onChange={handleChange}
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <DeliveryMethodSelector
                                        deliveryMethodId={deliveryMethodId}
                                        onSelect={setDeliveryMethodId}
                                    />
                                </motion.div>
                            </div>

                            {/* Right column — order summary */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.15 }}
                                className="space-y-6 lg:sticky lg:top-28 h-fit"
                            >
                                <OrderSummary
                                    items={items}
                                    subtotal={subtotal}
                                    deliveryPrice={deliveryPrice}
                                    total={total}
                                />

                                {/* Place Order */}
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={submitting}
                                    className="glass-button-primary w-full py-4 text-base justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                            Placing Order...
                                        </>
                                    ) : (
                                        <>
                                            <Icon name="CheckCircle" className="h-5 w-5 mr-2" />
                                            Place Order
                                        </>
                                    )}
                                </motion.button>

                                <Link
                                    to="/cart"
                                    className="glass-button w-full py-3 justify-center text-sm"
                                >
                                    <Icon name="ArrowLeft" className="h-4 w-4 mr-1" />
                                    Back to Cart
                                </Link>
                            </motion.div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
