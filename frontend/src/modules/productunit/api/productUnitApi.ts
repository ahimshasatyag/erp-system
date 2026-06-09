import api from '../../../services/api';

const API_BASE_URL = '/product-unit';

export interface ProductUnit {
    id_product_satuan: string;
    nm_product_satuan: string;
    date_create?: string;
    date_update?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
    };
}

export const fetchProductUnits = async (params?: any): Promise<PaginatedResponse<ProductUnit>> => {
    const response = await api.get(API_BASE_URL, { params });
    return response.data;
};

export const fetchProductUnit = async (id: string): Promise<{ data: ProductUnit }> => {
    const response = await api.get(`${API_BASE_URL}/${id}`);
    return response.data;
};

export const createProductUnit = async (data: Partial<ProductUnit>): Promise<any> => {
    const response = await api.post(API_BASE_URL, data);
    return response.data;
};

export const updateProductUnit = async (id: string, data: Partial<ProductUnit>): Promise<any> => {
    const response = await api.put(`${API_BASE_URL}/${id}`, data);
    return response.data;
};

export const deleteProductUnit = async (id: string): Promise<any> => {
    const response = await api.delete(`${API_BASE_URL}/${id}`);
    return response.data;
};
