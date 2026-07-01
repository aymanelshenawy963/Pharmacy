import Icon from '../Icons';
import { deliveryMethods } from '../../data/store';
import { formatPrice } from '../../utils/currency';

export default function DeliveryMethodSelector({ deliveryMethodId, onSelect }) {
    return (
        <div className="bg-surface p-6 md:p-8 rounded-2xl border border-border shadow-sm">
            <h2 className="font-sans text-xl font-semibold text-text mb-6 flex items-center gap-2">
                <Icon name="Truck" className="h-5 w-5 text-primary" />
                Delivery Method
            </h2>

            <div className="space-y-3">
                {deliveryMethods.map((method) => (
                    <label
                        key={method.id}
                        className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                            deliveryMethodId === method.id
                                ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                                : 'border-border hover:border-primary/30 hover:bg-bg-subtle'
                        }`}
                    >
                        <input
                            type="radio"
                            name="deliveryMethod"
                            value={method.id}
                            checked={deliveryMethodId === method.id}
                            onChange={(e) => onSelect(Number(e.target.value))}
                            className="h-4 w-4 text-primary focus:ring-primary border-border"
                        />
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-text">{method.name}</p>
                                <p className="text-sm font-bold text-text">{formatPrice(method.price)}</p>
                            </div>
                            <p className="text-xs text-text-muted mt-0.5">
                                {method.description} — {method.deliveryTime}
                            </p>
                        </div>
                    </label>
                ))}
            </div>
        </div>
    );
}
