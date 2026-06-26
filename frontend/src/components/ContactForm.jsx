import { useState } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
import { contactSubjects } from '../data/products';
import Icon from './Icons';

const initialForm = {
    name: '',
    email: '',
    phone: '',
    subject: contactSubjects[0],
    message: '',
};

const emailConfigured =
    import.meta.env.VITE_EMAILJS_SERVICE_ID &&
    import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE &&
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export default function ContactForm() {
    const [form, setForm] = useState(initialForm);
    const [sending, setSending] = useState(false);

    const onChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSending(true);
        try {
            if (emailConfigured) {
                await emailjs.send(
                    import.meta.env.VITE_EMAILJS_SERVICE_ID,
                    import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE,
                    form,
                    { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY },
                );
            }
            toast.success('Message sent successfully.');
            setForm(initialForm);
            event.currentTarget.reset();
        } catch (error) {
            console.error(error);
            toast.error('Message could not be sent. Please try again.');
        } finally {
            setSending(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="glass-card space-y-5 p-6">
            <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[rgb(var(--color-primary))]">Contact form</p>
                <h2 className="mt-2 font-serif text-2xl font-bold text-[rgb(var(--color-text))]">Send a message to the store</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5 text-sm font-medium text-[rgb(var(--color-text))]">
                    Name
                    <input
                        name="name"
                        value={form.name}
                        onChange={onChange}
                        required
                        className="glass-input"
                    />
                </label>
                <label className="space-y-1.5 text-sm font-medium text-[rgb(var(--color-text))]">
                    Email
                    <input
                        name="email"
                        value={form.email}
                        onChange={onChange}
                        type="email"
                        required
                        className="glass-input"
                    />
                </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5 text-sm font-medium text-[rgb(var(--color-text))]">
                    Phone
                    <input
                        name="phone"
                        value={form.phone}
                        onChange={onChange}
                        type="tel"
                        required
                        className="glass-input"
                    />
                </label>
                <label className="space-y-1.5 text-sm font-medium text-[rgb(var(--color-text))]">
                    Subject
                    <select
                        name="subject"
                        value={form.subject}
                        onChange={onChange}
                        className="glass-input"
                    >
                        {contactSubjects.map((subject) => (
                            <option key={subject} value={subject}>
                                {subject}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <label className="space-y-1.5 text-sm font-medium text-[rgb(var(--color-text))]">
                Message
                <textarea
                    name="message"
                    value={form.message}
                    onChange={onChange}
                    rows="5"
                    required
                    className="glass-input resize-none"
                />
            </label>

            <motion.button
                type="submit"
                disabled={sending}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="glass-button-primary w-full !py-3"
            >
                {sending ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                    <>
                        Submit message
                        <Icon name="Send" className="h-4 w-4" />
                    </>
                )}
            </motion.button>
        </form>
    );
}
