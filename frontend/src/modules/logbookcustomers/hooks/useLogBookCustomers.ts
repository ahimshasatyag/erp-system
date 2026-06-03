import { useState, useEffect } from 'react';
import { logBookCustomerApi, type LogBookCustomerData } from '../api/logBookCustomerApi';

export const useLogBookCustomers = (params?: any) => {
    const [data, setData] = useState<LogBookCustomerData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchLogBooks = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await logBookCustomerApi.getAll(params);
            setData(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch Log Book Customers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogBooks();
    }, [JSON.stringify(params)]);

    const deleteLogBook = async (id: string) => {
        try {
            await logBookCustomerApi.delete(id);
            await fetchLogBooks();
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete Log Book Customer');
            return false;
        }
    };

    return { logBooks: data, loading, error, fetchLogBooks, deleteLogBook };
};

export const useLogBookCustomerForm = (id?: string) => {
    const [initialData, setInitialData] = useState<any>(null);
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const formData = await logBookCustomerApi.getFormData();
                setCustomers(formData.customers || []);

                if (id) {
                    const detail = await logBookCustomerApi.getById(id);
                    setInitialData(detail.data);
                }
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch form data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const saveLogBook = async (data: any) => {
        setLoading(true);
        setError(null);
        try {
            if (id) {
                await logBookCustomerApi.update(id, data);
            } else {
                await logBookCustomerApi.create(data);
            }
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save Log Book Customer');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { initialData, customers, loading, error, saveLogBook };
};
