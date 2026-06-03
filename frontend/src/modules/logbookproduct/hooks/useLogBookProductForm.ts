import { useState, useEffect } from 'react';
import { logBookProductApi } from '../api/logBookProductApi';
import { validateLogBookProduct } from '../validation/logBookProductSchema';
import type { ValidationErrors } from '../validation/logBookProductSchema';

export const useLogBookProductForm = (initialId?: number) => {
    const [formData, setFormData] = useState<LogBookProduct>({
        id_product: '',
        id_type_kerusakan: '',
        date_log_book: new Date().toISOString().split('T')[0],
        masalah: '',
        solusi: '',
        catatan: ''
    });
    
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (initialId) {
            const fetchInitialData = async () => {
                setIsLoading(true);
                try {
                    const response = await logBookProductApi.getById(initialId);
                    setFormData(response.data);
                } catch (error) {
                    console.error("Failed to fetch log book details", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchInitialData();
        }
    }, [initialId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when typing
        if (errors[name as keyof ValidationErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const submitForm = async (onSuccess: () => void) => {
        const validationErrors = validateLogBookProduct(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            if (initialId) {
                await logBookProductApi.update(initialId, formData);
            } else {
                await logBookProductApi.create(formData);
            }
            onSuccess();
        } catch (error) {
            console.error("Failed to submit form", error);
            // Handle global form errors here if needed
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        errors,
        isSubmitting,
        isLoading,
        handleChange,
        submitForm,
        setFormData // useful if using custom editors like react-quill
    };
};
