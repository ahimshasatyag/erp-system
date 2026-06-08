import api from '../../../services/api';

const API_BASE_URL = '/product-category';

export interface ProductCategory {
    id_product_kategori: string;
    kode_product_kategori: string;
    nm_product_kategori: string;
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

export const fetchProductCategories = async (params?: any): Promise<PaginatedResponse<ProductCategory>> => {
    const response = await api.get(API_BASE_URL, { params });
    return response.data;
};

export const getMenuInfo = async (menuId: string) => {
    const { data } = await api.get(`/menus/${menuId}`);
    return data;
};

export const fetchProductCategory = async (id: string): Promise<{ data: ProductCategory }> => {
    const response = await api.get(`${API_BASE_URL}/${id}`);
    return response.data;
};

export const createProductCategory = async (data: Partial<ProductCategory>): Promise<any> => {
    const response = await api.post(API_BASE_URL, data);
    return response.data;
};

export const updateProductCategory = async (id: string, data: Partial<ProductCategory>): Promise<any> => {
    // Form URL Encoded or JSON depending on backend
    const response = await api.put(`${API_BASE_URL}/${id}`, data);
    return response.data;
};

export const deleteProductCategory = async (id: string): Promise<any> => {
    const response = await api.delete(`${API_BASE_URL}/${id}`);
    return response.data;
};
