import { useCallback, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const dropZoneVariants = {
    idle: { scale: 1 },
    dragging: { scale: 1.02, transition: { type: 'spring', damping: 20, stiffness: 300 } },
};

const previewVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { type: 'spring', damping: 15, stiffness: 400 },
    },
    exit: {
        opacity: 0,
        scale: 0.8,
        transition: { duration: 0.15 },
    },
};

export default function ImageUploader({ files, onChange, maxFiles = 5, error }) {
    const [isDragging, setIsDragging] = useState(false);
    const objectUrlsRef = useRef([]);

    useEffect(() => {
        return () => {
            objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
            objectUrlsRef.current = [];
        };
    }, []);

    const getFileUrl = useCallback((file) => {
        if (typeof file === 'string') return file;
        const url = URL.createObjectURL(file);
        objectUrlsRef.current.push(url);
        return url;
    }, []);

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
        const file = files[index];
        if (typeof file !== 'string') {
            const url = objectUrlsRef.current.find((u) => u === URL.createObjectURL(file));
            if (url) {
                URL.revokeObjectURL(url);
                objectUrlsRef.current = objectUrlsRef.current.filter((u) => u !== url);
            }
        }
        onChange(files.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col gap-3">
            <motion.div
                variants={dropZoneVariants}
                animate={isDragging ? 'dragging' : 'idle'}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-5 sm:p-8 transition-all duration-300 ${
                    isDragging
                        ? 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/5 shadow-lg shadow-[rgb(var(--color-primary))]/10'
                        : 'border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary))]/50 hover:bg-[rgb(var(--color-bg-subtle))]/30'
                }`}
            >
                <motion.div
                    animate={isDragging ? { y: -4, scale: 1.1 } : { y: 0, scale: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                >
                    <Upload className={`h-8 w-8 transition-colors duration-200 ${isDragging ? 'text-[rgb(var(--color-primary))]' : 'text-[rgb(var(--color-text-muted))]'}`} />
                </motion.div>
                <p className="mt-3 text-sm text-[rgb(var(--color-text-muted))]">
                    Drag & drop images here, or{' '}
                    <label className="cursor-pointer font-medium text-[rgb(var(--color-primary))] hover:underline transition-colors">
                        browse
                        <input type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
                    </label>
                </p>
                <p className="mt-1.5 text-xs text-[rgb(var(--color-text-muted))]">
                    {files.length}/{maxFiles} files selected
                </p>
            </motion.div>

            <AnimatePresence>
                {files.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-wrap gap-2"
                    >
                        <AnimatePresence>
                            {files.map((file, index) => {
                                const url = getFileUrl(file);
                                return (
                                    <motion.div
                                        key={index}
                                        variants={previewVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        layout
                                        className="group relative h-20 w-20 overflow-hidden rounded-xl border border-[rgb(var(--color-border))] shadow-sm hover:shadow-md transition-shadow duration-200"
                                    >
                                        <img src={url} alt="" className="h-full w-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/80 hover:scale-110 active:scale-90 sm:opacity-100"
                                            aria-label="Remove image"
                                        >
                                            <X size={12} />
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {error && (
                    <motion.span
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="text-xs font-medium text-red-500"
                    >
                        {error}
                    </motion.span>
                )}
            </AnimatePresence>
        </div>
    );
}
