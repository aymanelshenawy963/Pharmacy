import axios from 'axios';
import { authStorage } from './authStorage';
import { BASE_URL } from '../config/api';
import { sleep } from '../utils/sleep';

const MAX_429_RETRIES = 3;
const RETRY_BASE_DELAY = 2000;
const REQUEST_TIMEOUT = 30000;

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

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: REQUEST_TIMEOUT,
    headers: {
        'Content-Type': 'application/json'
    }
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

axiosInstance.interceptors.request.use(
    (config) => {
        const token = authStorage.getToken();
        if (token && !config.headers['Authorization']) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response.data;
    },
    async (error) => {
        const originalRequest = error.config;
        
        if (!error.response) {
            const err = new Error('Unable to connect to the server. Please check your internet connection.');
            err.status = 0;
            return Promise.reject(err);
        }

        const { status, data } = error.response;

        if (status === 429 && (!originalRequest._retryCount || originalRequest._retryCount < MAX_429_RETRIES)) {
            originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
            await sleep(RETRY_BASE_DELAY * originalRequest._retryCount);
            return axiosInstance(originalRequest);
        }

        if (status === 401 && !originalRequest._retry && authStorage.getRefreshToken() && originalRequest.url !== '/Auth/login') {
            if (isRefreshing) {
                return new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return axiosInstance(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const token = authStorage.getToken();
                const refreshToken = authStorage.getRefreshToken();

                const response = await axios.post(`${BASE_URL}/Auth/refresh-token`, { token, refreshToken });
                const { token: newToken } = response.data;
                
                authStorage.setAuth(response.data);
                
                axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
                originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
                
                processQueue(null, newToken);
                return axiosInstance(originalRequest);
            } catch (err) {
                processQueue(err, null);
                authStorage.clear();
                window.location.replace('/login');
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        let errorMessage = STATUS_MESSAGES[status] || `HTTP ${status}`;
        
        if (data) {
            if (typeof data === 'string') {
                errorMessage = data;
            } else if (data.message) {
                errorMessage = data.message;
            } else if (data.title && data.errors) {
                const firstErrorKey = Object.keys(data.errors)[0];
                if (firstErrorKey && data.errors[firstErrorKey].length > 0) {
                    errorMessage = data.errors[firstErrorKey][0];
                } else {
                    errorMessage = data.title;
                }
            } else if (data.title) {
                errorMessage = data.title;
            }
        }

        const customError = new Error(errorMessage);
        customError.status = status;
        customError.body = data;
        customError.validationErrors = data?.errors || null;
        return Promise.reject(customError);
    }
);

export async function apiGet(endpoint, params = {}) {
    const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    );
    return axiosInstance.get(endpoint, { params: filteredParams });
}

export async function apiPost(endpoint, body) {
    return axiosInstance.post(endpoint, body);
}

export async function apiPut(endpoint, body) {
    return axiosInstance.put(endpoint, body);
}

export async function apiDelete(endpoint) {
    return axiosInstance.delete(endpoint);
}

export async function apiFormData(endpoint, method, formData) {
    return axiosInstance({
        method: method.toLowerCase(),
        url: endpoint,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
    });
}

export { BASE_URL };
