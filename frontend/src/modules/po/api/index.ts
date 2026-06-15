import api from '../../../services/api';
import type { PoFormData } from '../validation/poSchema';

export const getPos = async (page = 1, perPage = 10, search = '', status = 'ALL') => {
    const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
        search,
        status,
    });
    const { data } = await api.get(`/po?${params}`);
    return data;
};

export const getPoById = async (id: string) => {
    const { data } = await api.get(`/po/${id}`);
    return data;
};

export const createPo = async (payload: FormData | PoFormData) => {
    const isFormData = payload instanceof FormData;
    const { data } = await api.post(`/po`, payload, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    return data;
};

export const updatePo = async (id: string, payload: FormData | PoFormData) => {
    const isFormData = payload instanceof FormData;
    const { data } = await api.post(`/po/${id}`, payload, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    return data;
};

export const confirmPo = async (id: string) => {
    const { data } = await api.post(`/po/confirm`, { id_po: id });
    return data;
};

export const getPoMasterData = async () => {
    const { data } = await api.get(`/po/master-data`);
    return data;
};
