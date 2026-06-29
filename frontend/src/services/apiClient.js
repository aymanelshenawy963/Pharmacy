import { authStorage } from './authStorage';
import { BASE_URL, sleep } from '../config/api';

const MAX_429_RETRIES = 3;
const RETRY_BASE_DELAY = 2000;
const REQUEST_TIMEOUT = 30000;
const MAX_NETWORK_RETRIES = 1;

const STATUS_MESSAGES = {
    400: 'Please check the information you entered.',
    401: 'Incorrect email or password.',
    403: "You don't have permission to perform this action.",
    404: 'The requested resource was not found.',
    409: 'An account with this information already exists.',
    429: 'Too many requests. Please try again later.',
    500: 'Something went wrong. Please try again later.',
    502: 'Server is temporarily unavailable. Please try again later.',
    503: 'Service is currently unavailable. Please try again later.',
};

let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(token) {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
}

function addRefreshSubscriber(cb) {
    refreshSubscribers.push(cb);
}

function mergeAbortSignals(userSignal, timeoutSignal) {
    const controller = new AbortController();

    if (userSignal.aborted) controller.abort();
    else userSignal.addEventListener('abort', () => controller.abort(), { once: true });

    if (timeoutSignal.aborted) controller.abort();
    else timeoutSignal.addEventListener('abort', () => controller.abort(), { once: true });

    return controller.signal;
}

function fetchWithTimeout(url, options, timeout = REQUEST_TIMEOUT) {
    const controller = new AbortController();
    const signal = options.signal
        ? mergeAbortSignals(options.signal, controller.signal)
        : controller.signal;

    const timeoutId = setTimeout(() => controller.abort(), timeout);

    return fetch(url, { ...options, signal }).finally(() => clearTimeout(timeoutId));
}

async function refreshTokenRequest() {
    const token = authStorage.getToken();
    const refreshToken = authStorage.getRefreshToken();

    if (!token || !refreshToken) throw new Error('No tokens available');

    const response = await fetchWithTimeout(`${BASE_URL}/Auth/refresh-token`, {
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
        let errorMessage = STATUS_MESSAGES[response.status] || `HTTP ${response.status}`;

        if (body) {
            if (typeof body === 'string') {
                errorMessage = body;
            } else if (body.message) {
                errorMessage = body.message;
            } else if (body.title && body.errors) {
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

async function doRefreshAndRetry(url, config, headers, retryFn) {
    if (isRefreshing) {
        return new Promise((resolve, reject) => {
            addRefreshSubscriber(async (newToken) => {
                try {
                    const retryHeaders = { ...headers, Authorization: `Bearer ${newToken}` };
                    const retryResponse = await retryFn(url, { ...config, headers: retryHeaders });
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

        const retryHeaders = { ...headers, Authorization: `Bearer ${newToken}` };
        const retryResponse = await retryFn(url, { ...config, headers: retryHeaders });
        return handleResponse(retryResponse);
    } catch (refreshError) {
        isRefreshing = false;
        refreshSubscribers = [];
        authStorage.clear();
        window.location.href = '/login';
        throw refreshError;
    }
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

    let response;
    try {
        response = await fetchWithTimeout(url, config);
    } catch (err) {
        if (err.name === 'AbortError') {
            const error = new Error('Request timed out. Please try again.');
            error.status = 0;
            error.body = null;
            error.validationErrors = null;
            throw error;
        }
        const error = new Error('Unable to connect to the server. Please check your internet connection.');
        error.status = 0;
        error.body = null;
        error.validationErrors = null;
        throw error;
    }

    if (response.status === 429) {
        for (let attempt = 1; attempt <= MAX_429_RETRIES; attempt++) {
            await sleep(RETRY_BASE_DELAY * attempt);
            try {
                response = await fetchWithTimeout(url, config);
            } catch {
                break;
            }
            if (response.status !== 429) break;
        }
    }

    if (response.status === 401 && !isRetry && authStorage.getRefreshToken()) {
        return doRefreshAndRetry(url, config, headers, (u, c) => fetchWithTimeout(u, c));
    }

    return handleResponse(response);
}

async function apiRequestWithNetworkRetry(endpoint, options = {}, isRetry = false) {
    for (let attempt = 0; attempt <= MAX_NETWORK_RETRIES; attempt++) {
        try {
            return await apiRequest(endpoint, options, isRetry);
        } catch (err) {
            if (err.status === 0 && attempt < MAX_NETWORK_RETRIES) {
                await sleep(1000 * (attempt + 1));
                continue;
            }
            throw err;
        }
    }
}

export async function apiGet(endpoint, params = {}) {
    const filtered = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    );
    const searchParams = new URLSearchParams(filtered).toString();
    const url = searchParams ? `${endpoint}?${searchParams}` : endpoint;
    return apiRequestWithNetworkRetry(url, { method: 'GET' });
}

export async function apiPost(endpoint, body) {
    return apiRequestWithNetworkRetry(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
    });
}

export async function apiPut(endpoint, body) {
    return apiRequestWithNetworkRetry(endpoint, {
        method: 'PUT',
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });
}

export async function apiFormData(endpoint, method, formData) {
    const url = `${BASE_URL}${endpoint}`;

    const headers = {};
    const token = authStorage.getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    let response;
    try {
        response = await fetchWithTimeout(url, { method, headers, body: formData });
    } catch (err) {
        if (err.name === 'AbortError') {
            const error = new Error('Request timed out. Please try again.');
            error.status = 0;
            error.body = null;
            error.validationErrors = null;
            throw error;
        }
        const error = new Error('Unable to connect to the server. Please check your internet connection.');
        error.status = 0;
        error.body = null;
        error.validationErrors = null;
        throw error;
    }

    if (response.status === 429) {
        for (let attempt = 1; attempt <= MAX_429_RETRIES; attempt++) {
            await sleep(RETRY_BASE_DELAY * attempt);
            try {
                response = await fetchWithTimeout(url, { method, headers, body: formData });
            } catch {
                break;
            }
            if (response.status !== 429) break;
        }
    }

    if (response.status === 401 && authStorage.getRefreshToken()) {
        return doRefreshAndRetry(
            url,
            { method, body: formData },
            headers,
            (u, c) => fetchWithTimeout(u, c),
        );
    }

    return handleResponse(response);
}

export { BASE_URL };
