import { lazy, Suspense, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Outlet, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import PageLoader from './components/PageLoader';

const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Prescription = lazy(() => import('./pages/Prescription'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const FAQ = lazy(() => import('./pages/FAQ'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./pages/TermsConditions'));
const CancelOrder = lazy(() => import('./pages/CancelOrder'));
const NotFound = lazy(() => import('./pages/NotFound'));

function ScrollToTop() {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [location.pathname]);

    return null;
}

function Layout() {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-hero-gradient text-slate-900">
            <ScrollToTop />
            <Navbar />
            <FloatingWhatsApp />
            <BackToTop />
            <main>
                <Suspense fallback={<PageLoader />}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -14 }}
                            transition={{ duration: 0.28, ease: 'easeOut' }}
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}

export default function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="products" element={<Products />} />
                <Route path="products/:id" element={<ProductDetail />} />
                <Route path="cart" element={<Cart />} />
                <Route path="prescription" element={<Prescription />} />
                <Route path="contact" element={<Contact />} />
                <Route path="about" element={<About />} />
                <Route path="faq" element={<FAQ />} />
                <Route path="privacy-policy" element={<PrivacyPolicy />} />
                <Route path="terms-conditions" element={<TermsConditions />} />
                <Route path="cancel-order" element={<CancelOrder />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}