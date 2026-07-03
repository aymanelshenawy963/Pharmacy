import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import Seo from '../components/Seo';
import Icon from '../components/Icons';
import stripePromise from '../config/stripe';
import CheckoutForm from '../components/checkout/CheckoutForm';
import LoadingSpinner from '../components/admin/LoadingSpinner';
import { pageVariants, itemVariants } from '../constants/animations';

export default function Payment() {
    const [searchParams] = useSearchParams();
    const clientSecret = searchParams.get('client_secret');
    const [isProcessing, setIsProcessing] = useState(false);

    if (!clientSecret) {
        return (
            <>
                <Seo title="Payment" description="Complete your payment." />
                <section className="min-h-[calc(100vh-72px)] bg-bg-subtle relative flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="bg-surface max-w-md w-full p-12 text-center relative z-10 rounded-2xl border border-border shadow-sm"
                    >
                        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-100 text-red-500 dark:bg-red-900/20 mb-6">
                            <Icon name="AlertCircle" className="h-10 w-10" />
                        </div>
                        <h1 className="font-sans text-3xl font-semibold text-text mb-3">No Payment Session</h1>
                        <p className="text-text-muted mb-8 leading-relaxed">
                            There is no active payment session. Please start from the checkout page.
                        </p>
                        <Link to="/checkout" className="glass-button-primary w-full py-3">
                            Go to Checkout
                        </Link>
                    </motion.div>
                </section>
            </>
        );
    }

    return (
        <>
            <Seo title="Payment" description="Complete your payment securely." />

            <div className="min-h-[calc(100vh-72px)] bg-surface relative overflow-hidden">
                <div className="mx-auto max-w-lg px-4 py-12 md:py-20 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-10 text-center"
                    >
                        <span className="kicker">Secure Payment</span>
                        <h1 className="display-heading !mb-2">Complete Payment</h1>
                        <p className="text-text-muted text-sm">
                            Enter your card details to finalize your order
                        </p>
                    </motion.div>

                    <motion.div
                        variants={pageVariants}
                        initial="hidden"
                        animate="visible"
                        className="bg-surface p-6 md:p-8 rounded-2xl border border-border shadow-sm"
                    >
                        <Elements
                            stripe={stripePromise}
                            options={{
                                clientSecret,
                                appearance: {
                                    theme: 'stripe',
                                    variables: {
                                        colorPrimary: '#0d9488',
                                        colorBackground: 'rgb(var(--color-surface))',
                                        colorText: 'rgb(var(--color-text))',
                                        colorDanger: '#ef4444',
                                        fontFamily: 'Inter, system-ui, sans-serif',
                                        borderRadius: '12px',
                                    },
                                },
                            }}
                        >
                            <CheckoutForm onProcessingChange={setIsProcessing} />
                        </Elements>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        className="mt-6 text-center"
                    >
                        <Link
                            to="/checkout"
                            className="glass-button py-3 justify-center text-sm text-[rgb(var(--color-text))]"
                            disabled={isProcessing}
                        >
                            <Icon name="ArrowLeft" className="h-4 w-4 mr-1" />
                            Back to Checkout
                        </Link>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        className="mt-8 flex items-center justify-center gap-6 text-xs text-text-muted"
                    >
                        <div className="flex items-center gap-1.5">
                            <Icon name="Lock" className="h-3.5 w-3.5" />
                            <span>SSL Encrypted</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Icon name="Shield" className="h-3.5 w-3.5" />
                            <span>Secure by Stripe</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
