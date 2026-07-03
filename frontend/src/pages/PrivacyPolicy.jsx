import { motion } from 'framer-motion';
import Seo from '../components/Seo';
import { staggerContainer, staggerItem } from '../constants/animations';

export default function PrivacyPolicy() {
    return (
        <>
            <Seo title="Privacy Policy" description="Privacy Policy for Medical Store." />

            <main className="bg-surface min-h-[calc(100vh-72px)] relative overflow-hidden">
                <div className="mx-auto max-w-[1000px] px-5 py-16 sm:px-6 md:px-16 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <span className="kicker">Legal</span>
                        <h1 className="display-heading !mb-4 tracking-tight">
                            Privacy Policy
                        </h1>
                        <p className="text-base text-text-muted">
                            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
                        className="mt-12 bg-surface p-8 md:p-12 rounded-2xl border border-border shadow-sm"
                    >
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            className="space-y-10"
                        >
                            <motion.section variants={staggerItem} className="space-y-4">
                                <h2 className="font-sans text-2xl font-semibold text-text">1. Information We Collect</h2>
                                <p className="text-base leading-relaxed text-text-muted">
                                    At Medical Store, we collect information that you provide directly to us when you create an account, place an order, or contact us for support. This includes your name, email address, phone number, and shipping address.
                                </p>
                            </motion.section>

                            <motion.section variants={staggerItem} className="space-y-4">
                                <h2 className="font-sans text-2xl font-semibold text-text">2. How We Use Your Information</h2>
                                <p className="text-base leading-relaxed text-text-muted">
                                    We use the information we collect to fulfill your orders, provide customer support, communicate with you about your order status via SMS or WhatsApp, and ensure compliance with pharmacy laws regarding medications. We do not sell or rent your personal information to third parties.
                                </p>
                            </motion.section>

                            <motion.section variants={staggerItem} className="space-y-4">
                                <h2 className="font-sans text-2xl font-semibold text-text">3. Data Security and Confidentiality</h2>
                                <p className="text-base leading-relaxed text-text-muted">
                                    We take the security of your medical and personal data seriously. Data is stored securely and is only accessed by our licensed pharmacists for the purpose of order verification and fulfillment. We implement standard security measures to protect against unauthorized access or data breaches.
                                </p>
                            </motion.section>

                            <motion.section variants={staggerItem} className="space-y-4">
                                <h2 className="font-sans text-2xl font-semibold text-text">4. Third-Party Services</h2>
                                <p className="text-base leading-relaxed text-text-muted">
                                    We may share your delivery address and phone number with our trusted delivery partners strictly for the purpose of delivering your orders. We ensure our partners adhere to strict confidentiality agreements.
                                </p>
                            </motion.section>

                            <motion.section variants={staggerItem} className="space-y-4">
                                <h2 className="font-sans text-2xl font-semibold text-text">5. Contact Us</h2>
                                <p className="text-base leading-relaxed text-text-muted">
                                    If you have any questions about this Privacy Policy, please contact us at support@jayamedicalstore.in or call our support line.
                                </p>
                            </motion.section>
                        </motion.div>
                    </motion.div>
                </div>
            </main>
        </>
    );
}
