import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import notify from '../utils/notifications';
import Icon from './Icons';

const initialForm = {
    patient_name: '',
    phone: '',
    address: '',
    notes: '',
};

const emailConfigured =
    import.meta.env.VITE_EMAILJS_SERVICE_ID &&
    import.meta.env.VITE_EMAILJS_PRESCRIPTION_TEMPLATE &&
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, type: 'spring', stiffness: 260, damping: 24 } }),
};

export default function PrescriptionUpload() {
    const [form, setForm] = useState(initialForm);
    const [file, setFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [sending, setSending] = useState(false);

    const onChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const setPrescriptionFile = (event) => {
        const selected = event.target.files?.[0];
        if (selected) {
            setFile(selected);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setDragActive(false);
        const droppedFile = event.dataTransfer.files?.[0];
        if (droppedFile) {
            setFile(droppedFile);
        }
    };

    const removeFile = () => setFile(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            notify.error('Please add a prescription file.');
            return;
        }

        setSending(true);
        try {
            if (emailConfigured) {
                await emailjs.send(
                    import.meta.env.VITE_EMAILJS_SERVICE_ID,
                    import.meta.env.VITE_EMAILJS_PRESCRIPTION_TEMPLATE,
                    {
                        ...form,
                        file_name: file.name,
                    },
                    { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY },
                );
            }

            notify.success('Prescription submitted successfully.');
            setForm(initialForm);
            setFile(null);
            event.currentTarget.reset();
        } catch (error) {
            console.error(error);
            notify.error('Prescription submission failed. Please try again.');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="glass-card p-7 sm:p-9">
            {/* Header */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                    visible: { transition: { staggerChildren: 0.08 } },
                }}
                className="mb-8"
            >
                <motion.span variants={fadeUp} custom={0} className="kicker">
                    <Icon name="ClipboardList" className="h-3.5 w-3.5" />
                    Prescription Form
                </motion.span>
                <motion.h2 variants={fadeUp} custom={1} className="display-heading text-3xl sm:text-4xl !mb-3">
                    Share securely
                </motion.h2>
                <motion.p variants={fadeUp} custom={2} className="text-sm leading-relaxed text-text-muted">
                    Upload a JPG, PNG, or PDF and provide details so the pharmacy can prepare your order with care.
                </motion.p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* File drop zone */}
                <motion.div
                    onDragOver={(event) => {
                        event.preventDefault();
                        setDragActive(true);
                    }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={handleDrop}
                    animate={dragActive ? { scale: 1.01, borderColor: 'rgb(var(--color-primary))' } : { scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`group relative rounded-2xl border-2 border-dashed p-8 transition-colors duration-300 ${
                        dragActive
                            ? 'border-primary bg-primary/5'
                            : file
                              ? 'border-primary/30 bg-primary/5'
                              : 'border-border bg-bg-subtle hover:border-primary/30'
                    }`}
                >
                    {!file ? (
                        <label className="flex cursor-pointer flex-col items-center justify-center gap-4 text-center">
                            <motion.span
                                animate={dragActive ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                                className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20"
                            >
                                <Icon name="Upload" className="h-7 w-7" />
                            </motion.span>
                            <div>
                                <span className="text-base font-medium text-text">
                                    Drop your prescription here
                                </span>
                                <span className="mt-1 block text-sm text-text-muted">
                                    or <span className="font-medium text-primary hover:underline underline-offset-2">browse files</span> to upload
                                </span>
                            </div>
                            <div className="flex gap-2">
                                {['JPG', 'PNG', 'PDF'].map((fmt, i) => (
                                    <motion.span
                                        key={fmt}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3 + i * 0.08, type: 'spring', stiffness: 300, damping: 20 }}
                                        className="rounded-lg border border-border bg-bg px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-text-muted shadow-sm"
                                    >
                                        {fmt}
                                    </motion.span>
                                ))}
                            </div>
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                className="hidden"
                                onChange={setPrescriptionFile}
                            />
                        </label>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className="flex items-center justify-between gap-4"
                        >
                            <div className="flex items-center gap-4">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20"
                                >
                                    <Icon name="FileText" className="h-6 w-6" />
                                </motion.div>
                                <div>
                                    <p className="text-sm font-medium text-text line-clamp-1">{file.name}</p>
                                    <p className="text-xs text-text-muted mt-0.5">
                                        {(file.size / 1024).toFixed(1)} KB · Ready to upload
                                    </p>
                                </div>
                            </div>
                            <motion.button
                                type="button"
                                onClick={removeFile}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-bg border border-border text-text-muted transition-colors duration-200 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-500"
                            >
                                <Icon name="X" className="h-4 w-4" />
                            </motion.button>
                        </motion.div>
                    )}
                </motion.div>

                {/* Name & Phone */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
                    }}
                    className="grid gap-5 sm:grid-cols-2"
                >
                    <motion.label variants={fadeUp} custom={0} className="block space-y-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Patient Name</span>
                        <input
                            name="patient_name"
                            value={form.patient_name}
                            onChange={onChange}
                            required
                            placeholder="Full name"
                            className="glass-input"
                        />
                    </motion.label>
                    <motion.label variants={fadeUp} custom={1} className="block space-y-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Phone Number</span>
                        <input
                            name="phone"
                            value={form.phone}
                            onChange={onChange}
                            required
                            type="tel"
                            placeholder="+91 XXXXX XXXXX"
                            className="glass-input"
                        />
                    </motion.label>
                </motion.div>

                {/* Address */}
                <motion.label
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    custom={4}
                    className="block space-y-2"
                >
                    <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Delivery Address</span>
                    <textarea
                        name="address"
                        value={form.address}
                        onChange={onChange}
                        rows="3"
                        required
                        placeholder="House no., street, locality, city, pincode"
                        className="glass-input resize-none"
                    />
                </motion.label>

                {/* Notes */}
                <motion.label
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    custom={5}
                    className="block space-y-2"
                >
                    <span className="text-xs font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
                        Notes
                        <span className="text-[10px] text-text-muted/60">(optional)</span>
                    </span>
                    <textarea
                        name="notes"
                        value={form.notes}
                        onChange={onChange}
                        rows="3"
                        placeholder="Mention dosage timing, brand preference, or any delivery note."
                        className="glass-input resize-none"
                    />
                </motion.label>

                {/* Submit button */}
                <motion.button
                    type="submit"
                    disabled={sending}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    custom={6}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="glass-button-primary w-full sm:w-auto px-10 py-4 justify-center mt-2"
                >
                    {sending ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                        <>
                            Submit Prescription
                            <Icon name="ArrowRight" className="ml-2 h-4 w-4" />
                        </>
                    )}
                </motion.button>
            </form>
        </div>
    );
}
