import { useState, useCallback, useEffect } from 'react';
import { fetchCustomerContacts, deleteCustomerContact } from '../api/customerContactApi';
import type { CustomerContact } from '../api/customerContactApi';
import { showAlert } from '../../../components/SweetAlert';

export const useCustomerContacts = () => {
    const [contacts, setContacts] = useState<CustomerContact[]>([]);
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
        search: '',
        sort_by: 'id_customers_contact',
        sort_dir: 'desc'
    });

    const loadContacts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            // Map our params to what the API expects
            const apiParams = {
                ...params,
                'search.value': params.search
            };
            const response = await fetchCustomerContacts(apiParams);
            setContacts(response.data);
            if (response.meta) {
                setMeta(response.meta);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to fetch customer contacts');
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        loadContacts();
    }, [loadContacts]);

    const updateParams = (newParams: any) => {
        setParams((prev: any) => ({ ...prev, ...newParams }));
    };

    const removeContact = async (id: number) => {
        return new Promise<boolean>((resolve) => {
            showAlert.confirm(
                'Konfirmasi Hapus',
                'Apakah anda yakin ingin menghapus data ini?',
                async () => {
                    try {
                        await deleteCustomerContact(id);
                        showAlert.success('Berhasil', 'Data berhasil dihapus');
                        await loadContacts();
                        resolve(true);
                    } catch (err: any) {
                        showAlert.error('Error', err.response?.data?.message || 'Gagal menghapus data');
                        resolve(false);
                    }
                }
            );
        });
    };

    return { 
        contacts, 
        loading, 
        error, 
        meta,
        params,
        updateParams,
        loadContacts, 
        removeContact 
    };
};
