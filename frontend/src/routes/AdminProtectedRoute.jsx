import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/admin/LoadingSpinner';

export default function AdminProtectedRoute() {
    const { user, isAuthenticated, isLoadingAuth } = useAuth();
    const location = useLocation();

    if (isLoadingAuth) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[rgb(var(--color-bg))]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!user?.roles?.includes('Admin')) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
