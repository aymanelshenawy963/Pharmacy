export function decodeJwtPayload(token) {
    try {
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
}

export function getUserRoles(token) {
    const payload = decodeJwtPayload(token);
    if (!payload) return [];

    // ASP.NET Identity puts roles in claim types like "role", "http://schemas.microsoft.com/ws/2008/06/identity/claims/role", or "roles"
    const roleClaim =
        payload.role ||
        payload.roles ||
        payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    if (Array.isArray(roleClaim)) return roleClaim;
    if (typeof roleClaim === 'string') return [roleClaim];
    return [];
}
