import { useState, useCallback, useEffect } from 'react';
import { 
    fetchProductBrands, 
    deleteProductBrand
} from '../api/productBrandApi';
import type { ProductBrand } from '../api/productBrandApi';
import { showAlert } from '../../../components/SweetAlert';

export const useProductBrand = () => {
    const [brands, setBrands] = useState<ProductBrand[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [meta, setMeta] = useState({
        total: 0,
        per_page: 10,
        current_page: 1,
        last_page: 1
    });

    const [params, setParams] = useState<any>({
        page: 1,
        per_page: 10,
        search: ''
    });

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetchProductBrands(params);
            setBrands(response.data);
            if (response.meta) {
                setMeta(response.meta);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const updateParams = (newParams: any) => {
        setParams((prev: any) => ({ ...prev, ...newParams }));
    };

    const handleDelete = async (id: string) => {
        return new Promise<boolean>((resolve) => {
            showAlert.confirm(
                'Konfirmasi Hapus',
                'Apakah anda yakin ingin menghapus data ini?',
                async () => {
                    try {
                        const res = await deleteProductBrand(id);
                        if (res.success) {
                            showAlert.success('Berhasil', 'Data berhasil dihapus');
                            await loadData();
                            resolve(true);
                        } else {
                            showAlert.error('Gagal', res.message || 'Gagal menghapus data');
                            resolve(false);
                        }
                    } catch (err: any) {
                        showAlert.error('Error', err.response?.data?.message || 'Terjadi kesalahan saat menghapus data');
                        resolve(false);
                    }
                }
            );
        });
    };

    return {
        brands,
        loading,
        error,
        meta,
        params,
        updateParams,
        loadData,
        handleDelete
    };
};
