import api from '../../../services/api';

const API_BASE_URL = '/customers';

export interface CustomerContact {
    nm_customers_contact: string;
    customers_contact_posisi?: string;
    customers_contact_phone?: string;
    customers_contact_email?: string;
}

export interface Customer {
    id_customers: string;
    code_customers: string;
    nm_customers: string;
    customers_address: string;
    customers_address_invoice: string;
    customers_phone?: string;
    customers_mobile?: string;
    customers_email?: string;
    customers_fax?: string;
    f_company: boolean;
    nama_lengkap?: string;
    nik?: string;
    nib?: string;
    npwp?: string;
    alamat?: string;
    provinsi: string;
    provinsi_name?: string;
    kabupaten: string;
    kabupaten_name?: string;
    is_blacklist: boolean;
    is_external_sales: boolean;
    jumlah_so?: number;
    date_create?: string;
    date_update?: string;
    contacts?: CustomerContact[];
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

export interface Provinsi {
    id: string;
    nama: string;
}

export interface Kabupaten {
    id: string;
    kode_provinsi: string;
    nama_kabupaten: string;
}

export const fetchCustomers = async (params?: any): Promise<PaginatedResponse<Customer>> => {
    const response = await api.get(API_BASE_URL, { params });
    return response.data;
};

export const fetchCustomer = async (id: string): Promise<{ data: Customer }> => {
    const response = await api.get(`${API_BASE_URL}/${id}`);
    return response.data;
};

export const createCustomer = async (data: Partial<Customer>): Promise<any> => {
    const response = await api.post(API_BASE_URL, data);
    return response.data;
};

export const updateCustomer = async (id: string, data: Partial<Customer>): Promise<any> => {
    const response = await api.put(`${API_BASE_URL}/${id}`, data);
    return response.data;
};

export const deleteCustomer = async (id: string): Promise<any> => {
    const response = await api.delete(`${API_BASE_URL}/${id}`);
    return response.data;
};

export const fetchProvinsi = async (): Promise<Provinsi[]> => {
    const response = await api.get(`${API_BASE_URL}/provinsi`);
    return response.data;
};

export const fetchKabupaten = async (kode_provinsi: string): Promise<Kabupaten[]> => {
    const response = await api.post(`${API_BASE_URL}/kabupaten`, { kode_provinsi });
    return response.data;
};
