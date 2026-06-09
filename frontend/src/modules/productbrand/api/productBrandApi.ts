import api from '../../../services/api';

const API_BASE_URL = '/product-brand';

export interface ProductBrand {
    id_product_brand: string;
    nm_product_brand: string;
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

export const fetchProductBrands = async (params?: any): Promise<PaginatedResponse<ProductBrand>> => {
    const response = await api.get(API_BASE_URL, { params });
    return response.data;
};

export const fetchProductBrand = async (id: string): Promise<{ data: ProductBrand }> => {
    const response = await api.get(`${API_BASE_URL}/${id}`);
    return response.data;
};

export const createProductBrand = async (data: Partial<ProductBrand>): Promise<any> => {
    const response = await api.post(API_BASE_URL, data);
    return response.data;
};

export const updateProductBrand = async (id: string, data: Partial<ProductBrand>): Promise<any> => {
    const response = await api.put(`${API_BASE_URL}/${id}`, data);
    return response.data;
};

export const deleteProductBrand = async (id: string): Promise<any> => {
    const response = await api.delete(`${API_BASE_URL}/${id}`);
    return response.data;
};
