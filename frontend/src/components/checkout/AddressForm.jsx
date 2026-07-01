import Icon from '../Icons';

const ADDRESS_FIELDS = [
    { key: 'firstName', label: 'First Name', placeholder: 'John', colSpan: 'half' },
    { key: 'lastName', label: 'Last Name', placeholder: 'Doe', colSpan: 'half' },
    { key: 'street', label: 'Street Address', placeholder: '123 Main St', colSpan: 'full' },
    { key: 'city', label: 'City', placeholder: 'Cairo', colSpan: 'half' },
    { key: 'state', label: 'State', placeholder: 'Cairo', colSpan: 'half' },
    { key: 'zipCode', label: 'ZIP Code', placeholder: '12345', colSpan: 'half' },
];

export default function AddressForm({ address, errors, onChange }) {
    return (
        <div className="bg-surface p-6 md:p-8 rounded-2xl border border-border shadow-sm">
            <h2 className="font-sans text-xl font-semibold text-text mb-6 flex items-center gap-2">
                <Icon name="MapPin" className="h-5 w-5 text-primary" />
                Shipping Address
            </h2>

            <div className="grid grid-cols-2 gap-4">
                {ADDRESS_FIELDS.map((field) => (
                    <div
                        key={field.key}
                        className={field.colSpan === 'full' ? 'col-span-2' : 'col-span-1'}
                    >
                        <label className="block text-sm font-medium text-text mb-1.5">
                            {field.label} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={address[field.key]}
                            onChange={(e) => onChange(field.key, e.target.value)}
                            placeholder={field.placeholder}
                            className={`w-full rounded-xl border bg-bg px-4 py-3 outline-none transition-all duration-300 text-sm placeholder:text-text-muted/60 ${
                                errors[field.key]
                                    ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                    : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20'
                            }`}
                        />
                        {errors[field.key] && (
                            <p className="mt-1 text-xs text-red-500">{errors[field.key]}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
