import { useState, useEffect } from 'react';
import { logBookProductApi } from '../api/logBookProductApi';
import type { LogBookProduct } from '../api/logBookProductApi';

export const useLogBookProducts = () => {
    const [logBooks, setLogBooks] = useState<LogBookProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLogBooks = async () => {
        try {
            setLoading(true);
            const response = await logBookProductApi.getAll();
            // Assuming response data structure is { data: [...] } from Laravel Resource
            setLogBooks(response.data || []);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch');
        } finally {
            setLoading(false);
        }
    };

    const deleteLogBook = async (id: number) => {
        try {
            await logBookProductApi.delete(id);
            fetchLogBooks(); // Refresh list after delete
            return true;
        } catch (err: any) {
            setError(err.message || 'Failed to delete');
            return false;
        }
    };

    useEffect(() => {
        fetchLogBooks();
    }, []);

    return { logBooks, loading, error, deleteLogBook, refetch: fetchLogBooks };
};
