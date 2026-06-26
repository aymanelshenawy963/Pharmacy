import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { authService } from '../services/authService';
import { authStorage } from '../services/authStorage';
import { getUserRoles } from '../utils/jwt';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const stored = authStorage.getUser();
        if (stored) {
            const token = authStorage.getToken();
            const roles = token ? getUserRoles(token) : [];
            return { ...stored, roles };
        }
        return null;
    });
    const [isAuthenticated, setIsAuthenticated] = useState(() => authStorage.isAuthenticated());
    const [isLoadingAuth, setIsLoadingAuth] = useState(false);
    const refreshTimerRef = useRef(null);

    const clearAuthState = useCallback(() => {
        authStorage.clear();
        setUser(null);
        setIsAuthenticated(false);
        if (refreshTimerRef.current) {
            clearTimeout(refreshTimerRef.current);
        }
    }, []);

    const scheduleTokenRefresh = useCallback((expiresIn) => {
        if (refreshTimerRef.current) {
            clearTimeout(refreshTimerRef.current);
        }

        const refreshAt = Math.max((expiresIn - 60) * 1000, expiresIn * 0.8 * 1000);

        refreshTimerRef.current = setTimeout(async () => {
            try {
                const token = authStorage.getToken();
                const refreshToken = authStorage.getRefreshToken();
                if (!token || !refreshToken) {
                    clearAuthState();
                    return;
                }
                const data = await authService.refreshToken(token, refreshToken);
                authStorage.setAuth(data);
                const roles = getUserRoles(data.token);
                setUser({
                    id: data.id,
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    roles,
                });
                scheduleTokenRefresh(data.expiresIn);
            } catch {
                clearAuthState();
            }
        }, refreshAt);
    }, [clearAuthState]);

    useEffect(() => {
        const expiresIn = authStorage.getExpiresIn();
        if (isAuthenticated && expiresIn) {
            scheduleTokenRefresh(expiresIn);
        }
        return () => {
            if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const login = useCallback(async (email, password) => {
        setIsLoadingAuth(true);
        try {
            const data = await authService.login(email, password);
            authStorage.setAuth(data);
            const roles = getUserRoles(data.token);
            const userData = {
                id: data.id,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                roles,
            };
            setUser(userData);
            setIsAuthenticated(true);
            scheduleTokenRefresh(data.expiresIn);
            return { success: true, data };
        } catch (err) {
            return { success: false, error: err };
        } finally {
            setIsLoadingAuth(false);
        }
    }, [scheduleTokenRefresh]);

    const logout = useCallback(async () => {
        setIsLoadingAuth(true);
        try {
            await authService.revokeRefreshToken();
        } finally {
            clearAuthState();
            setIsLoadingAuth(false);
        }
    }, [clearAuthState]);

    const value = {
        user,
        isAuthenticated,
        isLoadingAuth,
        login,
        logout,
        clearAuthState,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider');
    }
    return context;
}
