const CURRENCY_LOCALE = 'en-EG';
const CURRENCY_CODE = 'EGP';

export function formatPrice(value) {
    const num = Number(value);
    if (!Number.isFinite(num)) return `${CURRENCY_CODE} 0`;
    return new Intl.NumberFormat(CURRENCY_LOCALE, {
        style: 'currency',
        currency: CURRENCY_CODE,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(num);
}
