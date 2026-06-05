import api from '../../../services/api';

const API_BASE_URL = '/products';

// You can add proper interfaces based on your backend response
export interface Product {
    id_product: string;
    code_product: string;
    nm_product: string;
    product_deskripsi?: string;
    product_refference?: string;
    link_brosur?: string | null;
    link_foto?: string | null;
    flag_active: string;
    category?: { id: string; name: string };
    sub_category?: { id: string; name: string };
    unit?: { id: string; name: string };
    brand?: { id: string; name: string };
    options?: { id_product_price_opt: number; nm_product_opt: string }[];
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

export const fetchProducts = async (params?: any): Promise<PaginatedResponse<Product>> => {
    const response = await api.get(API_BASE_URL, { params });
    return response.data;
};

export const fetchProduct = async (id: string): Promise<{ data: Product }> => {
    const response = await api.get(`${API_BASE_URL}/${id}`);
    return response.data;
};

export const getMenuInfo = async (menuId: string) => {
    const { data } = await api.get(`/menus/${menuId}`);
    return data;
};

export const createProduct = async (formData: FormData): Promise<any> => {
    const response = await api.post(API_BASE_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const updateProduct = async (id: string, formData: FormData): Promise<any> => {
    formData.append('_method', 'PUT');
    const response = await api.post(`${API_BASE_URL}/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const searchBrand = async (query: string): Promise<any[]> => {
    const response = await api.get(`${API_BASE_URL}/cari-brand`, { params: { cari: query } });
    return response.data;
};

export const createBrand = async (brandName: string): Promise<any> => {
    const response = await api.post(`${API_BASE_URL}/simpan-brand`, { new_id_product_brand: brandName });
    return response.data;
};

export const fetchSubCategories = async (categoryId: string): Promise<any[]> => {
    const response = await api.post(`${API_BASE_URL}/data-sub-kategori`, { id_product_kategori: categoryId });
    return response.data;
};

export const changeProductStatus = async (productIds: string[], status: string): Promise<any> => {
    const response = await api.post(`${API_BASE_URL}/ganti-status`, { 
        id_product: productIds.join('|'), 
        status 
    });
    return response.data;
};
