export interface LogBookProduct {
    id_log_book?: number;
    id_product: number | string;
    id_type_kerusakan: number | string;
    date_log_book: string;
    masalah: string;
    solusi: string;
    catatan: string;
    status_log_book?: string;
    user?: {
        username: string;
        nm_users: string;
    };
    product?: {
        code_product: string;
        nm_product: string;
    };
}

import api from '../../../services/api';

export const logBookProductApi = {
    getAll: async () => {
        const response = await api.get('/log-books');
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get(`/log-books/${id}`);
        return response.data;
    },

    create: async (data: LogBookProduct) => {
        const response = await api.post('/log-books', data);
        return response.data;
    },

    update: async (id: number, data: LogBookProduct) => {
        const response = await api.put(`/log-books/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await api.delete(`/log-books/${id}`);
        return response.data;
    }
};
