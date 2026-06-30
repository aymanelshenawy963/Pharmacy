import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { parseZodError } from '../utils/validation';

export function useAuthForm({ initialValues, schema, onSubmit }) {
    const [formData, setFormData] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState(null);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
        setServerError(null);
    }, [errors]);

    const setFieldError = useCallback((field, message) => {
        setErrors((prev) => ({ ...prev, [field]: message }));
    }, []);

    const validate = useCallback(() => {
        if (!schema) return true;
        const result = schema.safeParse(formData);
        if (result.success) {
            setErrors({});
            return true;
        }
        const fieldErrors = parseZodError(result.error);
        setErrors(fieldErrors);
        toast.error('Please fix the errors below');
        return false;
    }, [schema, formData]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setServerError(null);
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            await onSubmit(formData);
        } catch (err) {
            if (err.status === 400 && err.validationErrors) {
                const apiErrors = {};
                Object.keys(err.validationErrors).forEach((key) => {
                    const fieldName = key.charAt(0).toLowerCase() + key.slice(1);
                    apiErrors[fieldName] = err.validationErrors[key][0];
                });
                setErrors((prev) => ({ ...prev, ...apiErrors }));
            }
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, validate, onSubmit]);

    const resetForm = useCallback(() => {
        setFormData(initialValues);
        setErrors({});
        setServerError(null);
    }, [initialValues]);

    return {
        formData,
        setFormData,
        errors,
        setErrors,
        isSubmitting,
        setIsSubmitting,
        serverError,
        setServerError,
        handleChange,
        setFieldError,
        handleSubmit,
        resetForm,
    };
}
