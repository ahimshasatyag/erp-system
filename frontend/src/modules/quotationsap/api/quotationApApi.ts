import api from '../../../services/api';

export const getQuotationAps = async (params?: Record<string, any>) => {
    const response = await api.get('/quotations-ap', { params });
    return response.data;
};

export const getQuotationAp = async (id: string | number) => {
    const response = await api.get(`/quotations-ap/${id}`);
    return response.data;
};

export const createQuotationAp = async (data: FormData) => {
    // Requires FormData because it has link_file
    const response = await api.post('/quotations-ap', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const updateQuotationAp = async (id: string | number, data: FormData) => {
    // Use POST with _method=PUT to handle multipart/form-data correctly in Laravel
    data.append('_method', 'PUT');
    const response = await api.post(`/quotations-ap/${id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const confirmQuotationAp = async (id_po: string | number) => {
    const response = await api.post('/quotations-ap/confirm', { id_po });
    return response.data;
};

export const cancelQuotationAp = async (id_po: string | number) => {
    const response = await api.post('/quotations-ap/cancel', { id_po });
    return response.data;
};

export const getMataUangDefault = async (id_supplier: string) => {
    const response = await api.post('/quotations-ap/get-mata-uang-default', { id_supplier });
    return response.data;
};

export const getProductDetail = async (id_product: string) => {
    const response = await api.post('/quotations-ap/get-product-detail', { id_product });
    return response.data;
};

export const getLokasi = async (id_gudang: string) => {
    const response = await api.post('/quotations-ap/get-lokasi', { id_gudang });
    return response.data;
};
