import { motion } from 'framer-motion';
import Icon from '../Icons';

const PAYMENT_METHODS = [
    {
        id: 'card',
        label: 'Pay with Visa / Card',
        description: 'Secure online payment via Stripe',
        icon: 'CreditCard',
    },
    {
        id: 'cod',
        label: 'Cash on Delivery',
        description: 'Pay in cash when your order arrives',
        icon: 'Banknote',
    },
];

export default function PaymentMethodSelector({ paymentMethod, onSelect }) {
    return (
        <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
            <h2 className="font-sans text-lg font-semibold text-text mb-4 flex items-center gap-2">
                <Icon name="Wallet" className="h-5 w-5 text-primary" />
                Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PAYMENT_METHODS.map((method) => {
                    const isSelected = paymentMethod === method.id;
                    return (
                        <motion.button
                            key={method.id}
                            type="button"
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelect(method.id)}
                            className={[
                                'relative flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                                isSelected
                                    ? 'border-primary bg-primary/5 shadow-sm'
                                    : 'border-border bg-bg-subtle hover:border-primary/40 hover:bg-surface',
                            ].join(' ')}
                        >
                            {/* Icon bubble */}
                            <div
                                className={[
                                    'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-200',
                                    isSelected
                                        ? 'bg-primary text-white'
                                        : 'bg-border text-text-muted',
                                ].join(' ')}
                            >
                                <Icon name={method.icon} className="h-5 w-5" />
                            </div>

                            {/* Labels */}
                            <div className="flex-1 min-w-0">
                                <p
                                    className={[
                                        'font-medium text-sm transition-colors duration-200',
                                        isSelected ? 'text-primary' : 'text-text',
                                    ].join(' ')}
                                >
                                    {method.label}
                                </p>
                                <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                                    {method.description}
                                </p>
                            </div>

                            {/* Selected indicator */}
                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white"
                                >
                                    <Icon name="Check" className="h-3 w-3" />
                                </motion.div>
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* COD notice */}
            {paymentMethod === 'cod' && (
                <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-xs text-text-muted bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-lg px-4 py-2.5 flex items-start gap-2"
                >
                    <Icon name="Info" className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    Your order will be placed immediately. Please have the exact amount ready upon delivery.
                </motion.p>
            )}
        </div>
    );
}
