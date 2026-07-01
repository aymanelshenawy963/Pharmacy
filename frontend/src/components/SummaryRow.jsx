export default function SummaryRow({ label, value, valueClass = 'text-text' }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-text-muted">{label}</span>
            <span className={`font-medium ${valueClass}`}>{value}</span>
        </div>
    );
}
