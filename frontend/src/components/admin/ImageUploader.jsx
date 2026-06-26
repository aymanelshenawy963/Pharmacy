import { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

export default function ImageUploader({ files, onChange, maxFiles = 5, error }) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e) => {
            e.preventDefault();
            setIsDragging(false);
            const dropped = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
            if (dropped.length > 0) {
                const remaining = maxFiles - files.length;
                onChange([...files, ...dropped.slice(0, remaining)]);
            }
        },
        [files, maxFiles, onChange]
    );

    const handleFileSelect = (e) => {
        const selected = Array.from(e.target.files).filter((f) => f.type.startsWith('image/'));
        if (selected.length > 0) {
            const remaining = maxFiles - files.length;
            onChange([...files, ...selected.slice(0, remaining)]);
        }
    };

    const removeFile = (index) => {
        onChange(files.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col gap-2">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors ${
                    isDragging
                        ? 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/5'
                        : 'border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary))]/50'
                }`}
            >
                <Upload className="h-8 w-8 text-[rgb(var(--color-text-muted))]" />
                <p className="mt-2 text-sm text-[rgb(var(--color-text-muted))]">
                    Drag & drop images here, or{' '}
                    <label className="cursor-pointer font-medium text-[rgb(var(--color-primary))] hover:underline">
                        browse
                        <input type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
                    </label>
                </p>
                <p className="mt-1 text-xs text-[rgb(var(--color-text-muted))]">
                    {files.length}/{maxFiles} files selected
                </p>
            </div>

            {files.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {files.map((file, index) => {
                        const url = typeof file === 'string' ? file : URL.createObjectURL(file);
                        return (
                            <div key={index} className="group relative h-20 w-20 overflow-hidden rounded-xl border border-[rgb(var(--color-border))]">
                                <img src={url} alt="" className="h-full w-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {error && <span className="text-xs font-medium text-red-500">{error}</span>}
        </div>
    );
}
