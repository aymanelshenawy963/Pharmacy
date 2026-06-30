import { useState, useCallback } from 'react';

export function useFormSubmission({ onSuccess, onError } = {}) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const submit = useCallback(async (fn) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const result = await fn();
            onSuccess?.(result);
            return result;
        } catch (err) {
            const message = err.message || 'Something went wrong';
            setError(message);
            onError?.(err);
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    }, [onSuccess, onError]);

    const reset = useCallback(() => {
        setError(null);
        setIsSubmitting(false);
    }, []);

    return { isSubmitting, error, submit, reset };
}
