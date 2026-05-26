import api from "../../../services/api";
import { type StoreCsrValues, type UpdateCsrValues } from "../validation/csrSchema";

// API Fetch & Mutation Functions for CSR Module

export async function getCsrs(params: {
    search?: string;
    start_date?: string;
    end_date?: string;
    all?: boolean;
    status?: string;
    page?: number;
}) {
    const { data } = await api.get('/csr', { params });
    return data;
}

export async function getMenuInfo(menuId: string) {
    const { data } = await api.get(`/menus/${menuId}`);
    return data;
}

export async function getCsrDetail(csrCode: string) {
    const { data } = await api.get(`/csr/${csrCode.replace(/\//g, ".")}`);
    return data.data; // Assumes Laravel Resource wraps in 'data'
}

export async function createCsr(payload: StoreCsrValues) {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, value as string | Blob);
        }
    });

    const { data } = await api.post('/csr', formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return data;
}

export async function updateCsr(csrCode: string, payload: UpdateCsrValues) {
    const formData = new FormData();
    formData.append('_method', 'PUT'); // Laravel form method spoofing
    Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, value as string | Blob);
        }
    });

    const { data } = await api.post(`/csr/${csrCode.replace(/\//g, ".")}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return data;
}

export async function confirmCsr(csrCode: string, customer: string, product: string) {
    const { data } = await api.post('/csr/confirm', {
        csr_code: csrCode,
        customer,
        product
    });
    return data;
}

export async function cancelCsr(csrCode: string, customer: string, product: string, memo: string) {
    const { data } = await api.post('/csr/cancel', {
        csr_code: csrCode,
        customer,
        product,
        memo
    });
    return data;
}

export async function getCsrFormData() {
    const { data } = await api.get('/csr-form-data');
    return data;
}

export async function getBarcodeData(barcode: string) {
    const { data } = await api.post('/csr/isi-otomatis', { barcode });
    return data;
}

export async function addNewCst(csrCode: string) {
    const { data } = await api.post('/csr/add-new-cst', { csr_code: csrCode });
    return data;
}
