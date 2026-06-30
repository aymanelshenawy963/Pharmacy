import { PLACEHOLDER_IMG_SM } from '../../constants/ui';
import { formatPrice } from '../../utils/currency';
import SummaryRow from '../SummaryRow';

export default function OrderSummary({ items, subtotal, deliveryPrice, total }) {
    return (
        <div className="bg-surface p-6 md:p-8 rounded-2xl border border-border shadow-sm">
            <h2 className="font-sans text-2xl font-semibold text-text mb-6 border-b border-border pb-6">
                Order Summary
            </h2>

            {/* Items */}
            <div className="space-y-4 mb-6">
                {items.map((item, index) => (
                    <div key={item.id ?? `checkout-item-${index}`} className="flex items-center gap-3">
                        <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-bg border border-border">
                            <img
                                src={item.image || PLACEHOLDER_IMG_SM}
                                alt={item.name}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text line-clamp-1">{item.name}</p>
                            <p className="text-xs text-text-muted">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold text-text">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                ))}
            </div>

            {/* Summary rows */}
            <div className="space-y-3 text-sm border-t border-border pt-4">
                <SummaryRow label="Subtotal" value={formatPrice(subtotal)} />
                <SummaryRow
                    label="Delivery"
                    value={deliveryPrice === 0 ? 'Free' : formatPrice(deliveryPrice)}
                />
                <div className="border-t border-border pt-3 mt-3">
                    <div className="flex items-center justify-between">
                        <span className="text-base font-semibold text-text">Total</span>
                        <span className="font-sans text-2xl font-bold text-text">{formatPrice(total)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
