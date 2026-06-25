import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
    const { isAuthenticated, isLoadingAuth } = useAuth();
    const location = useLocation();

    if (isLoadingAuth) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[rgb(var(--color-bg))]">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-[rgb(var(--color-border))] border-t-[rgb(var(--color-primary))]"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
}
