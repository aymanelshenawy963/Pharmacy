import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import Icon from '../Icons';

export default function CheckoutForm({ onProcessingChange }) {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsLoading(true);
        onProcessingChange?.(true);
        setMessage(null);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}${import.meta.env.BASE_URL}payment/success`,
            },
        });

        if (error) {
            if (error.type === 'card_error' || error.type === 'validation_error') {
                setMessage(error.message);
            } else {
                setMessage('An unexpected error occurred. Please try again.');
            }
        }

        setIsLoading(false);
        onProcessingChange?.(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement
                options={{
                    layout: 'tabs',
                }}
            />

            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-900/10"
                >
                    <Icon name="AlertCircle" className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                    <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
                </motion.div>
            )}

            <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading || !stripe || !elements}
                className="glass-button-primary w-full py-4 text-base justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <>
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Processing Payment...
                    </>
                ) : (
                    <>
                        <Icon name="Lock" className="h-5 w-5 mr-2" />
                        Pay Now
                    </>
                )}
            </motion.button>
        </form>
    );
}
