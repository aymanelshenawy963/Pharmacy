import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, MessageCircle } from 'lucide-react';
import Seo from '../components/Seo';
import { storeInfo } from '../data/store';

const DEFAULT_ERRORS = {
    failed: 'Your card was declined. Please try a different payment method or contact your bank.',
    requires_action: 'Additional authentication is required. Please try again.',
    requires_confirmation: 'Payment requires confirmation. Please try again.',
    processing: 'Your payment is still processing. Please check your account orders.',
};

export default function PaymentFailed() {
    const [searchParams] = useSearchParams();
    const error = searchParams.get('error');
    const redirectStatus = searchParams.get('redirect_status');

    const displayMessage = error || DEFAULT_ERRORS[redirectStatus] || 'We could not process your payment. Your order has not been placed.';

    return (
        <>
            <Seo title="Payment Failed" description="Your payment could not be processed." />

            <section className="min-h-[calc(100vh-72px)] bg-surface relative flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-surface max-w-md w-full p-10 sm:p-12 text-center relative z-10 rounded-2xl border border-border shadow-sm"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
                        className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-100 text-red-500 dark:bg-red-900/20 mb-6"
                    >
                        <XCircle className="h-10 w-10" />
                    </motion.div>

                    <h1 className="font-sans text-3xl font-semibold text-text mb-3">
                        Payment Failed
                    </h1>
                    <p className="text-text-muted mb-6 leading-relaxed">
                        {displayMessage}
                    </p>

                    <div className="space-y-3">
                        <Link
                            to="/checkout"
                            className="glass-button-primary w-full py-3 justify-center"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Try Again
                        </Link>

                        <a
                            href={storeInfo.whatsapp}
                            target="_blank"
                            rel="noreferrer"
                            className="glass-button w-full py-3 justify-center text-[rgb(var(--color-text))]"
                        >
                            <MessageCircle className="h-5 w-5 mr-2" />
                            Contact Support
                        </a>
                    </div>
                </motion.div>
            </section>
        </>
    );
}
