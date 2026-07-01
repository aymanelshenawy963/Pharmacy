export default function StockIndicator({ stock }) {
    let color, bg, label;
    if (stock <= 0) {
        color = 'text-red-500';
        bg = 'bg-red-500/10';
        label = 'Out of Stock';
    } else if (stock <= 10) {
        color = 'text-amber-500';
        bg = 'bg-amber-500/10';
        label = 'Low Stock';
    } else {
        color = 'text-emerald-500';
        bg = 'bg-emerald-500/10';
        label = 'In Stock';
    }
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${bg} ${color}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
            {stock} ({label})
        </span>
    );
}
