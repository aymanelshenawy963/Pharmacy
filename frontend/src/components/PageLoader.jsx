export default function PageLoader() {
    return (
        <div className="min-h-[60vh] px-4 py-24">
            <div className="mx-auto flex max-w-5xl flex-col gap-6 animate-pulse">
                <div className="h-5 w-36 rounded-full skeleton" />
                <div className="h-20 w-full rounded-2xl skeleton" />
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="h-52 rounded-2xl skeleton" />
                    <div className="h-52 rounded-2xl skeleton" />
                    <div className="h-52 rounded-2xl skeleton" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="h-40 rounded-2xl skeleton" />
                    <div className="h-40 rounded-2xl skeleton" />
                </div>
            </div>
        </div>
    );
}
