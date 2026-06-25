import { authStorage } from './authStorage';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5223';

let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(token) {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
}

function addRefreshSubscriber(cb) {
    refreshSubscribers.push(cb);
}

async function refreshTokenRequest() {
    const token = authStorage.getToken();
    const refreshToken = authStorage.getRefreshToken();

    if (!token || !refreshToken) throw new Error('No tokens available');

    const response = await fetch(`${BASE_URL}/Auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, refreshToken }),
    });

    if (!response.ok) {
        authStorage.clear();
        throw new Error('Refresh token failed');
    }

    const data = await response.json();
    authStorage.setAuth(data);
    return data.token;
}

async function handleResponse(response) {
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    let body;
    try {
        body = isJson ? await response.json() : await response.text();
    } catch {
        body = null;
    }

    if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        
        if (body) {
            if (typeof body === 'string') {
                errorMessage = body;
            } else if (body.message) {
                errorMessage = body.message;
            } else if (body.title && body.errors) {
                // ASP.NET ValidationProblemDetails
                const firstErrorKey = Object.keys(body.errors)[0];
                if (firstErrorKey && body.errors[firstErrorKey].length > 0) {
                    errorMessage = body.errors[firstErrorKey][0];
                } else {
                    errorMessage = body.title;
                }
            } else if (body.title) {
                errorMessage = body.title;
            }
        }

        const error = new Error(errorMessage);
        error.status = response.status;
        error.body = body;
        error.validationErrors = body?.errors || null;
        throw error;
    }

    return body;
}

export async function apiRequest(endpoint, options = {}, isRetry = false) {
    const url = `${BASE_URL}${endpoint}`;

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const token = authStorage.getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = { ...options, headers };

    const response = await fetch(url, config);

    // Handle 401 — try to refresh token (but not if we're already in refresh flow)
    if (response.status === 401 && !isRetry && authStorage.getRefreshToken()) {
        if (isRefreshing) {
            // Queue until refresh completes
            return new Promise((resolve, reject) => {
                addRefreshSubscriber(async (newToken) => {
                    try {
                        const retryHeaders = { ...headers, Authorization: `Bearer ${newToken}` };
                        const retryResponse = await fetch(url, { ...config, headers: retryHeaders });
                        resolve(handleResponse(retryResponse));
                    } catch (err) {
                        reject(err);
                    }
                });
            });
        }

        isRefreshing = true;
        try {
            const newToken = await refreshTokenRequest();
            isRefreshing = false;
            onRefreshed(newToken);

            // Retry original request with new token
            const retryHeaders = { ...headers, Authorization: `Bearer ${newToken}` };
            const retryResponse = await fetch(url, { ...config, headers: retryHeaders });
            return handleResponse(retryResponse);
        } catch (refreshError) {
            isRefreshing = false;
            refreshSubscribers = [];
            authStorage.clear();
            // Redirect to login
            window.location.href = '/login';
            throw refreshError;
        }
    }

    return handleResponse(response);
}

export async function apiGet(endpoint, params = {}) {
    const searchParams = new URLSearchParams(params).toString();
    const url = searchParams ? `${endpoint}?${searchParams}` : endpoint;
    return apiRequest(url, { method: 'GET' });
}

export async function apiPost(endpoint, body) {
    return apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
    });
}

export async function apiPut(endpoint, body) {
    return apiRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(body),
    });
}
