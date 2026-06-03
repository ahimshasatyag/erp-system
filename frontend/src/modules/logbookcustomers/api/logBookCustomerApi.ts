import api from '../../../services/api';

export interface LogBookCustomerData {
    id_log_book?: string;
    id_customers: string;
    nm_customers?: string;
    date_log_book: string;
    masalah: string;
    solusi: string;
    catatan: string;
    username?: string;
    nm_users?: string;
    status_log_book?: string;
    date_create?: string;
    date_update?: string;
}

export const logBookCustomerApi = {
    getAll: async (params?: { search?: string; start_date?: string; end_date?: string; all?: boolean; page?: number }) => {
        const response = await api.get('/log-book-customers', { params });
        return response.data;
    },
    
    getById: async (id: string) => {
        const response = await api.get(`/log-book-customers/${id}`);
        return response.data;
    },

    create: async (data: any) => {
        const response = await api.post('/log-book-customers', data);
        return response.data;
    },

    update: async (id: string, data: any) => {
        const response = await api.put(`/log-book-customers/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/log-book-customers/${id}`);
        return response.data;
    },

    getFormData: async () => {
        const response = await api.get('/log-book-customers/form-data');
        return response.data;
    }
};
