import { useState } from 'react';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
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
            toast.error('Please add a prescription file.');
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

            toast.success('Prescription submitted successfully.');
            setForm(initialForm);
            setFile(null);
            event.currentTarget.reset();
        } catch (error) {
            console.error(error);
            toast.error('Prescription submission failed. Please try again.');
        } finally {
            setSending(false);
        }
    };

    const inputBaseClass =
        'w-full rounded-xl border border-border bg-bg px-4 py-3.5 text-sm text-text outline-none transition-colors duration-200 placeholder:text-text-muted/50 focus:border-primary focus:ring-1 focus:ring-primary/20';

    return (
        <div className="glass-card p-7 sm:p-9">
            {/* Header */}
            <div className="mb-8">
                <span className="kicker">
                    <Icon name="ClipboardList" className="h-3.5 w-3.5" />
                    Prescription Form
                </span>
                <h2 className="display-heading text-3xl sm:text-4xl !mb-3">
                    Share securely
                </h2>
                <p className="text-sm leading-relaxed text-text-muted">
                    Upload a JPG, PNG, or PDF and provide details so the pharmacy can prepare your order with care.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* File drop zone */}
                <div
                    onDragOver={(event) => {
                        event.preventDefault();
                        setDragActive(true);
                    }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={handleDrop}
                    className={`group relative rounded-2xl border-2 border-dashed p-8 transition-all duration-300 ${
                        dragActive
                            ? 'border-primary bg-primary/5'
                            : file
                              ? 'border-primary/30 bg-primary/5'
                              : 'border-border bg-bg-subtle hover:border-primary/30'
                    }`}
                >
                    {!file ? (
                        <label className="flex cursor-pointer flex-col items-center justify-center gap-4 text-center">
                            <span className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105 border border-primary/20">
                                <Icon name="Upload" className="h-7 w-7" />
                            </span>
                            <div>
                                <span className="text-base font-medium text-text">
                                    Drop your prescription here
                                </span>
                                <span className="mt-1 block text-sm text-text-muted">
                                    or <span className="font-medium text-primary hover:underline underline-offset-2">browse files</span> to upload
                                </span>
                            </div>
                            <div className="flex gap-2">
                                {['JPG', 'PNG', 'PDF'].map((fmt) => (
                                    <span
                                        key={fmt}
                                        className="rounded-lg border border-border bg-bg px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-text-muted shadow-sm"
                                    >
                                        {fmt}
                                    </span>
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
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                                    <Icon name="FileText" className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-text line-clamp-1">{file.name}</p>
                                    <p className="text-xs text-text-muted mt-0.5">
                                        {(file.size / 1024).toFixed(1)} KB · Ready to upload
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={removeFile}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-bg border border-border text-text-muted transition-colors duration-200 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-500"
                            >
                                <Icon name="X" className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Name & Phone */}
                <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block space-y-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Patient Name</span>
                        <input
                            name="patient_name"
                            value={form.patient_name}
                            onChange={onChange}
                            required
                            placeholder="Full name"
                            className={inputBaseClass}
                        />
                    </label>
                    <label className="block space-y-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Phone Number</span>
                        <input
                            name="phone"
                            value={form.phone}
                            onChange={onChange}
                            required
                            type="tel"
                            placeholder="+91 XXXXX XXXXX"
                            className={inputBaseClass}
                        />
                    </label>
                </div>

                {/* Address */}
                <label className="block space-y-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Delivery Address</span>
                    <textarea
                        name="address"
                        value={form.address}
                        onChange={onChange}
                        rows="3"
                        required
                        placeholder="House no., street, locality, city, pincode"
                        className={inputBaseClass + ' resize-none'}
                    />
                </label>

                {/* Notes */}
                <label className="block space-y-2">
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
                        className={inputBaseClass + ' resize-none'}
                    />
                </label>

                {/* Submit button */}
                <button
                    type="submit"
                    disabled={sending}
                    className="glass-button-primary w-full sm:w-auto px-10 py-4 justify-center mt-2"
                >
                    {sending ? (
                        <>
                            <Icon name="RefreshCw" className="h-4 w-4 animate-spin mr-2" />
                            Submitting...
                        </>
                    ) : (
                        <>
                            Submit Prescription
                            <Icon name="ArrowRight" className="ml-2 h-4 w-4" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}