import api from '../../../services/api';

export const getPurchaseRequisitions = async (params?: Record<string, any>) => {
    const response = await api.get('/purchase-requisitions', { params });
    return response.data;
};

export const getPurchaseRequisition = async (id: string | number) => {
    const response = await api.get(`/purchase-requisitions/${id}`);
    return response.data;
};

export const createPurchaseRequisition = async (data: any) => {
    const response = await api.post('/purchase-requisitions', data);
    return response.data;
};

export const updatePurchaseRequisition = async (id: string | number, data: any) => {
    const response = await api.put(`/purchase-requisitions/${id}`, data);
    return response.data;
};

export const deletePurchaseRequisition = async (id: string | number) => {
    const response = await api.delete(`/purchase-requisitions/${id}`);
    return response.data;
};

export const ajukanPurchaseRequisition = async (id: string | number) => {
    const response = await api.post(`/purchase-requisitions/${id}/ajukan`);
    return response.data;
};

export const getDetailBarang = async (id_product: string) => {
    const response = await api.post('/purchase-requisitions/detail-barang', { id_product });
    return response.data;
};

export const getListPr = async (params?: Record<string, any>) => {
    const response = await api.get('/purchase-requisitions/list-pr', { params });
    return response.data;
};

export const generatePoFromPr = async (data_id_pr_dtl: any[]) => {
    const response = await api.post('/purchase-requisitions/simpan-po', { data_id_pr_dtl });
    return response.data;
};
