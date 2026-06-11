import api from '../../../services/api';
import type { Supplier, SupplierListResponse, SupplierRequestPayload } from './types';

const API_BASE_URL = '/suppliers';

export const fetchSuppliers = async (params?: any): Promise<SupplierListResponse> => {
    const response = await api.get(API_BASE_URL, { params });
    return response.data;
};

export const fetchSupplier = async (id: string): Promise<{ data: Supplier }> => {
    const response = await api.get(`${API_BASE_URL}/${id}`);
    return response.data;
};

const buildFormData = (data: SupplierRequestPayload): FormData => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
        if (key === 'contacts') {
            (data.contacts || []).forEach((contact: any, index: number) => {
                Object.keys(contact).forEach(cKey => {
                    formData.append(`contacts[${index}][${cKey}]`, contact[cKey] || '');
                });
            });
        } else if (key === 'file') {
            if (data.file instanceof File) {
                formData.append('file', data.file);
            }
        } else {
            const val = (data as any)[key];
            if (val !== undefined && val !== null) {
                formData.append(key, val);
            }
        }
    });
    return formData;
};

export const createSupplier = async (data: SupplierRequestPayload): Promise<any> => {
    const formData = buildFormData(data);
    const response = await api.post(API_BASE_URL, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const updateSupplier = async (id: string, data: SupplierRequestPayload): Promise<any> => {
    const formData = buildFormData(data);
    formData.append('_method', 'PUT'); // Laravel method spoofing for multipart requests
    
    const response = await api.post(`${API_BASE_URL}/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const deleteSupplier = async (id: string): Promise<any> => {
    const response = await api.delete(`${API_BASE_URL}/${id}`);
    return response.data;
};
