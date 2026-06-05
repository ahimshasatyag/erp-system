import { useState, useEffect, useCallback } from 'react';
import { fetchProducts, changeProductStatus } from '../api/productApi';
import type { Product } from '../api/productApi';

interface UseProductsReturn {
    products: Product[];
    meta: any;
    loading: boolean;
    error: string | null;
    updateParams: (newParams: Record<string, any>) => void;
    toggleStatus: (productIds: string[], status: string) => Promise<boolean>;
    refresh: () => Promise<void>;
    fetchAllMatching: () => Promise<Product[]>;
}

export const useProducts = (initialParams: Record<string, any> = {}): UseProductsReturn => {
    const [products, setProducts] = useState<Product[]>([]);
    const [meta, setMeta] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [params, setParams] = useState<Record<string, any>>(initialParams);

    const loadProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchProducts(params);
            setProducts(data.data || []);
            setMeta(data.meta || {});
        } catch (err: any) {
            setError(err.message || 'Failed to load products');
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    const updateParams = (newParams: Record<string, any>) => {
        setParams(prev => ({ ...prev, ...newParams }));
    };

    const toggleStatus = async (productIds: string[], status: string): Promise<boolean> => {
        try {
            await changeProductStatus(productIds, status);
            await loadProducts();
            return true;
        } catch (err: any) {
            setError(err.message || 'Failed to change status');
            return false;
        }
    };

    const fetchAllMatching = async (): Promise<Product[]> => {
        setLoading(true);
        try {
            const data = await fetchProducts({ ...params, length: 100000 });
            return data.data || [];
        } catch (err: any) {
            setError(err.message || 'Failed to fetch all products');
            return [];
        } finally {
            setLoading(false);
        }
    };

    return {
        products,
        meta,
        loading,
        error,
        updateParams,
        toggleStatus,
        refresh: loadProducts,
        fetchAllMatching
    };
};
