import api from '../../../services/api';

const API_BASE_URL = '/product-price';

export interface ProductPrice {
    id_product: string;
    code_product: string;
    nm_product: string;
    nm_product_brand?: string;
    product_price: number;
    product_price_agent?: number;
    product_price_tampil: string;
    product_price_agent_tampil: string;
    kurs_bank: number;
    kurs_bank_tampil: string;
    estimation_idr: string;
    waktu?: string;
    is_new_price: boolean;
    aksi?: string;
    flag_active: string | number;
    delivery_term?: string;
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

export const fetchProductPrices = async (params?: any): Promise<PaginatedResponse<ProductPrice>> => {
    const response = await api.get(API_BASE_URL, { params });
    return response.data;
};

export const fetchProductPrice = async (id: string): Promise<any> => {
    const response = await api.get(`${API_BASE_URL}/${id}`);
    return response.data;
};

export const createProductPrices = async (data: { items: any[] }): Promise<any> => {
    const response = await api.post(API_BASE_URL, data);
    return response.data;
};

export const updateProductPrice = async (id: string, data: any): Promise<any> => {
    const response = await api.put(`${API_BASE_URL}/${id}`, data);
    return response.data;
};

export const deleteProductPrice = async (id: string): Promise<any> => {
    const response = await api.delete(`${API_BASE_URL}/${id}`);
    return response.data;
};

export const fetchAvailableProducts = async (): Promise<any[]> => {
    const response = await api.get(`${API_BASE_URL}/available-products`);
    return response.data;
};

export const fetchDetailBarang = async (id_product: string): Promise<any> => {
    const response = await api.post(`${API_BASE_URL}/detail-barang`, { id_product });
    return response.data;
};

export const uploadExcel = async (formData: FormData): Promise<any> => {
    const response = await api.post(`${API_BASE_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const getMenuInfo = async (menuId: string) => {
    const response = await api.get(`/menus/${menuId}`);
    return response.data;
};
