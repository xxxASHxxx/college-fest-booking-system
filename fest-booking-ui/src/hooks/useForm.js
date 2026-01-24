import { useState, useCallback } from 'react';
import { validateForm } from '../utils/validators';

export const useForm = (initialValues = {}, validationRules = {}) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle input change
    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setValues((prev) => ({
            ...prev,
            [name]: newValue,
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    }, [errors]);

    // Handle blur
    const handleBlur = useCallback((e) => {
        const { name } = e.target;

        setTouched((prev) => ({
            ...prev,
            [name]: true,
        }));

        // Validate single field
        if (validationRules[name]) {
            const fieldValidation = validateForm(
                { [name]: values[name] },
                { [name]: validationRules[name] }
            );

            if (!fieldValidation.isValid) {
                setErrors((prev) => ({
                    ...prev,
                    ...fieldValidation.errors,
                }));
            }
        }
    }, [values, validationRules]);

    // Validate all fields
    const validate = useCallback(() => {
        const validation = validateForm(values, validationRules);
        setErrors(validation.errors);
        return validation.isValid;
    }, [values, validationRules]);

    // Handle submit
    const handleSubmit = useCallback((onSubmit) => {
        return async (e) => {
            if (e) e.preventDefault();

            setIsSubmitting(true);

            const isValid = validate();

            if (isValid) {
                try {
                    await onSubmit(values);
                } catch (error) {
                    console.error('Form submission error:', error);
                }
            }

            setIsSubmitting(false);
        };
    }, [values, validate]);

    // Reset form
    const reset = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
        setIsSubmitting(false);
    }, [initialValues]);

    // Set field value
    const setFieldValue = useCallback((name, value) => {
        setValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    // Set field error
    const setFieldError = useCallback((name, error) => {
        setErrors((prev) => ({
            ...prev,
            [name]: error,
        }));
    }, []);

    return {
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        validate,
        reset,
        setFieldValue,
        setFieldError,
        setValues,
    };
};
