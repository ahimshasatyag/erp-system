import api from '../../../services/api';

const API_BASE_URL = '/product-price-mkt';

// Interfaces
export interface ProductPriceMktOption {
    nm_product_opt: string;
    amount: number;
    kurs: number;
    estimasi: number;
}

export interface ProductPriceMktDetail {
    status: boolean;
    id_product: string;
    code_product: string;
    nm_product: string;
    product_price: number;
    date_create: string;
    status_waktu: 'green' | 'red' | null;
    kurs_bank: number;
    estimasi: number;
    id_product_global: string;
    link_brosur: string | null;
    product_deskripsi: string | null;
    data_options: ProductPriceMktOption[];
}

export interface ProductMktList {
    id_product: string;
    code_product: string;
    nm_product: string;
    product_deskripsi: string | null;
}

// Functions
export const fetchProductPriceMktList = async (): Promise<ProductMktList[]> => {
    const response = await api.get(`${API_BASE_URL}`);
    return response.data.data;
};

export const fetchProductPriceMktDetail = async (id: string): Promise<ProductPriceMktDetail> => {
    const response = await api.get(`${API_BASE_URL}/${id}`);
    return response.data;
};

export const addToCart = async (id_product: string): Promise<any> => {
    const response = await api.post(`${API_BASE_URL}/cart`, { id_product });
    return response.data;
};

export const fetchProductPriceMktPdf = async (id: string): Promise<any> => {
    const response = await api.get(`${API_BASE_URL}/${id}/pdf`);
    return response.data;
};

export const getMenuInfo = async (menuId: string) => {
    const response = await api.get(`${API_BASE_URL}/menu/${menuId}`);
    return response.data;
};
