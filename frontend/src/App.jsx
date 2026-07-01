import { lazy, Suspense, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Outlet, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import PageLoader from './components/PageLoader';
import AuthHeader from './components/AuthHeader';
import ErrorBoundary from './components/ErrorBoundary';
import RouteErrorBoundary from './components/RouteErrorBoundary';

const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Prescription = lazy(() => import('./pages/Prescription'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const FAQ = lazy(() => import('./pages/FAQ'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./pages/TermsConditions'));
const CancelOrder = lazy(() => import('./pages/CancelOrder'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Auth Pages
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const ConfirmEmail = lazy(() => import('./pages/ConfirmEmail'));
const ResendConfirmationEmail = lazy(() => import('./pages/ResendConfirmationEmail'));
const CheckEmail = lazy(() => import('./pages/CheckEmail'));

// Admin Pages
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));
const AdminRoles = lazy(() => import('./pages/admin/Roles'));
const AdminCategories = lazy(() => import('./pages/admin/Categories'));
const AdminProducts = lazy(() => import('./pages/admin/Products'));
const ProfileSettings = lazy(() => import('./pages/account/ProfileSettings'));
const SecuritySettings = lazy(() => import('./pages/account/SecuritySettings'));
const Orders = lazy(() => import('./pages/account/Orders'));
const OrderDetail = lazy(() => import('./pages/account/OrderDetail'));

import ProtectedRoute from './routes/ProtectedRoute';
import AdminProtectedRoute from './routes/AdminProtectedRoute';
import AccountProtectedRoute from './routes/AccountProtectedRoute';
import GuestRoute from './routes/GuestRoute';

const pageTransition = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
};

function ScrollToTop() {
    const location = useLocation();
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [location.pathname]);
    return null;
}

// ── Full site layout (with Navbar + Footer) ───────────────────────────────────
function Layout() {
    const location = useLocation();
    return (
        <div className="min-h-screen bg-hero-gradient text-slate-900">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg"
            >
                Skip to content
            </a>
            <ScrollToTop />
            <Navbar />
            <FloatingWhatsApp />
            <BackToTop />
            <main id="main-content">
                <ErrorBoundary>
                    <Suspense fallback={<PageLoader />}>
                        <RouteErrorBoundary>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={location.pathname}
                                    {...pageTransition}
                                >
                                    <Outlet />
                                </motion.div>
                            </AnimatePresence>
                        </RouteErrorBoundary>
                    </Suspense>
                </ErrorBoundary>
            </main>
            <Footer />
        </div>
    );
}

// ── Auth layout (clean — no Navbar, no Footer) ────────────────────────────────
function AuthLayout() {
    const location = useLocation();
    return (
        <div className="min-h-screen bg-[rgb(var(--color-bg))] text-[rgb(var(--color-text))]">
            <ScrollToTop />
            <AuthHeader />
            <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </Suspense>
            </ErrorBoundary>
        </div>
    );
}

// ── Admin layout (sidebar + header) ───────────────────────────────────────────
function AdminLayoutWrapper() {
    return (
        <Suspense fallback={<PageLoader />}>
            <AdminLayout />
        </Suspense>
    );
}

export default function App() {
    return (
        <Routes>
            {/* ── Main site routes (Navbar + Footer) ── */}
            <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="products" element={<Products />} />
                <Route path="products/:id" element={<ProductDetail />} />
                <Route path="contact" element={<Contact />} />
                <Route path="about" element={<About />} />
                <Route path="faq" element={<FAQ />} />
                <Route path="privacy-policy" element={<PrivacyPolicy />} />
                <Route path="terms-conditions" element={<TermsConditions />} />
                <Route path="cancel-order" element={<CancelOrder />} />

                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="cart" element={<Cart />} />
                    <Route path="checkout" element={<Checkout />} />
                    <Route path="prescription" element={<Prescription />} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Route>

            {/* ── Auth routes (no Navbar, no Footer) ── */}
            <Route element={<GuestRoute />}>
                <Route element={<AuthLayout />}>
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="forgot-password" element={<ForgotPassword />} />
                    <Route path="reset-password" element={<ResetPassword />} />
                    <Route path="confirm-email" element={<ConfirmEmail />} />
                    <Route path="resend-confirmation" element={<ResendConfirmationEmail />} />
                    <Route path="check-email" element={<CheckEmail />} />
                </Route>
            </Route>

            {/* ── Admin routes (AdminLayout with sidebar) ── */}
            <Route element={<AdminProtectedRoute />}>
                <Route path="admin" element={<AdminLayoutWrapper />}>
                    <Route index element={<AdminProducts />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="roles" element={<AdminRoles />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="products" element={<AdminProducts />} />
                </Route>
            </Route>

            {/* ── Account routes (AdminLayout with sidebar) ── */}
            <Route element={<AccountProtectedRoute />}>
                <Route path="account" element={<AdminLayoutWrapper />}>
                    <Route path="profile" element={<ProfileSettings />} />
                    <Route path="security" element={<SecuritySettings />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="orders/:id" element={<OrderDetail />} />
                </Route>
            </Route>
        </Routes>
    );
}
