import { useState, useEffect } from 'react';
import { fetchProductSubCategories, deleteProductSubCategory, type ProductSubCategory } from '../api/productSubCategoryApi';

interface UseProductSubCategoryParams {
    page?: number;
    per_page?: number;
    search?: { value: string };
}

export const useProductSubCategory = (initialParams: UseProductSubCategoryParams = { page: 1, per_page: 10, search: { value: '' } }) => {
    const [subCategories, setSubCategories] = useState<ProductSubCategory[]>([]);
    const [meta, setMeta] = useState({ total: 0, current_page: 1, last_page: 1, per_page: 10 });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [params, setParams] = useState<UseProductSubCategoryParams>(initialParams);

    const loadSubCategories = async () => {
        try {
            setLoading(true);
            const queryParams = {
                page: params.page,
                per_page: params.per_page,
                search: params.search?.value || '',
            };
            const response = await fetchProductSubCategories(queryParams);
            setSubCategories(response.data);
            setMeta(response.meta);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch product sub categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSubCategories();
    }, [params]);

    const updateParams = (newParams: Partial<UseProductSubCategoryParams>) => {
        setParams(prev => ({ ...prev, ...newParams }));
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteProductSubCategory(id);
            await loadSubCategories(); // Reload after delete
        } catch (err: any) {
            throw new Error(err.message || 'Failed to delete sub category');
        }
    };

    return { subCategories, meta, loading, error, updateParams, handleDelete };
};
