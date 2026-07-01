import toast from 'react-hot-toast';
import { parseApiError } from './apiErrorHandler';

const notify = {
    success(message, options = {}) {
        return toast.success(message, {
            duration: 3500,
            ...options,
        });
    },

    error(message, options = {}) {
        return toast.error(message, {
            duration: 4500,
            ...options,
        });
    },

    errorFromApi(error, fallbackMessage, options = {}) {
        const messages = parseApiError(error, fallbackMessage);
        if (messages.length > 0) {
            return toast.error(messages.join(' '), {
                duration: 4500,
                ...options,
            });
        }
        return null;
    },

    loading(message = 'Loading...', options = {}) {
        return toast.loading(message, {
            duration: Infinity,
            ...options,
        });
    },

    dismiss(toastId) {
        return toast.dismiss(toastId);
    },

    warning(message, options = {}) {
        return toast(message, {
            duration: 5000,
            icon: '⚠️',
            ...options,
        });
    },

    info(message, options = {}) {
        return toast(message, {
            duration: 3500,
            icon: 'ℹ️',
            ...options,
        });
    },

    promise(promise, messages, options = {}) {
        return toast.promise(promise, messages, {
            success: {
                duration: 3500,
            },
            error: {
                duration: 4500,
            },
            ...options,
        });
    },
};

export default notify;
