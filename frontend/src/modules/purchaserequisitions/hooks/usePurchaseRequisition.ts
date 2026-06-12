import { useState, useCallback, useEffect } from 'react';
import { getPurchaseRequisitions } from '../api/purchaseRequisitionApi';

export interface PurchaseRequisition {
    id_pr: number | string;
    code_pr: string;
    username: string;
    date_request: string;
    date_deadline: string;
    status_pr: string;
}

interface Meta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export const usePurchaseRequisition = () => {
    const [purchaseRequisitions, setPurchaseRequisitions] = useState<PurchaseRequisition[]>([]);
    const [meta, setMeta] = useState<Meta | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [params, setParams] = useState({ page: 1, per_page: 10, search: '' });

    const fetchPurchaseRequisitions = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getPurchaseRequisitions(params);
            
            // Adjust based on your API response structure
            if (response.data && response.pagination) {
                 setPurchaseRequisitions(response.data);
                 setMeta({
                     current_page: response.pagination.current_page,
                     last_page: response.pagination.total_pages,
                     per_page: response.pagination.per_page,
                     total: response.pagination.total
                 });
            } else if (response.data && response.data.data) {
                setPurchaseRequisitions(response.data.data);
                setMeta({
                    current_page: response.data.current_page,
                    last_page: response.data.last_page,
                    per_page: response.data.per_page,
                    total: response.data.total
                });
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch purchase requisitions');
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchPurchaseRequisitions();
    }, [fetchPurchaseRequisitions]);

    const updateParams = (newParams: Partial<typeof params>) => {
        setParams(prev => ({ ...prev, ...newParams }));
    };

    return { purchaseRequisitions, meta, loading, error, updateParams, refetch: fetchPurchaseRequisitions };
};
