import api from '../../../services/api';

const API_BASE_URL = '/product-sub-category';

export interface ProductSubCategory {
    id_product_sub_kategori: string;
    kode_product_sub_kategori: string;
    nm_product_sub_kategori: string;
    id_product_kategori: string;
    nm_product_kategori?: string;
    type_kategori?: string | null;
    date_create?: string | null;
    date_update?: string | null;
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

export const fetchProductSubCategories = async (params?: any): Promise<PaginatedResponse<ProductSubCategory>> => {
    const response = await api.get(API_BASE_URL, { params });
    return response.data;
};

export const fetchProductSubCategory = async (id: string): Promise<{ data: ProductSubCategory }> => {
    const response = await api.get(`${API_BASE_URL}/${id}`);
    return response.data;
};

export const createProductSubCategory = async (data: Partial<ProductSubCategory>): Promise<any> => {
    const response = await api.post(API_BASE_URL, data);
    return response.data;
};

export const updateProductSubCategory = async (id: string, data: Partial<ProductSubCategory>): Promise<any> => {
    const response = await api.put(`${API_BASE_URL}/${id}`, data);
    return response.data;
};

export const deleteProductSubCategory = async (id: string): Promise<any> => {
    const response = await api.delete(`${API_BASE_URL}/${id}`);
    return response.data;
};

export const getMenuInfo = async (menuId: string) => {
    const { data } = await api.get(`/menus/${menuId}`);
    return data;
};

// Fetch categories for the select dropdown
export const fetchCategoriesOptions = async () => {
    // Calling the category API without pagination to get all options.
    // Ensure the backend endpoint /product-category can handle fetching all if needed,
    // or set a high per_page value.
    const response = await api.get('/product-category', { params: { per_page: 1000 } });
    return response.data;
};
