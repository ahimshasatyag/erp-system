import api from '../../../services/api';

const API_BASE_URL = '/customer-contacts';

export interface CustomerContact {
    id_customers_contact: number;
    id_customers: number;
    nm_customers_contact: string;
    customers_contact_posisi?: string;
    customers_contact_phone?: string;
    customers_contact_mobile?: string;
    customers_contact_email?: string;
    customers_contact_address?: string;
    customer?: { id_customers: number; nm_customers: string };
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

export const fetchCustomerContacts = async (params?: any): Promise<PaginatedResponse<CustomerContact>> => {
    const response = await api.get(API_BASE_URL, { params });
    return response.data;
};

export const fetchCustomerContact = async (id: string | number): Promise<{ data: CustomerContact }> => {
    const response = await api.get(`${API_BASE_URL}/${id}`);
    return response.data;
};

export const createCustomerContact = async (data: any): Promise<any> => {
    const response = await api.post(API_BASE_URL, data);
    return response.data;
};

export const updateCustomerContact = async (id: string | number, data: any): Promise<any> => {
    const response = await api.put(`${API_BASE_URL}/${id}`, data);
    return response.data;
};

export const deleteCustomerContact = async (id: string | number): Promise<any> => {
    const response = await api.delete(`${API_BASE_URL}/${id}`);
    return response.data;
};

export const fetchCustomersData = async (): Promise<any> => {
    const response = await api.get(`${API_BASE_URL}/data-customers`);
    return response.data;
};
