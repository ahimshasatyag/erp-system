import api from "../../../services/api";
import { type UpdateCstValues } from "../validation/cstSchema";

// API Fetch & Mutation Functions for CST Module

export async function getCsts(params: {
    search?: string;
    start_date?: string;
    end_date?: string;
    all?: boolean;
    page?: number;
}) {
    const { data } = await api.get('/cst', { params });
    return data;
}

export async function getMenuInfo(menuId: string) {
    const { data } = await api.get(`/menus/${menuId}`);
    return data;
}

export async function getCstDetail(cstCode: string) {
    const { data } = await api.get(`/cst/${cstCode.replace(/\//g, ".")}`);
    return data.data; // Assumes Laravel wraps in 'data'
}

export async function updateCst(cstCode: string, payload: UpdateCstValues) {
    const { data } = await api.put(`/cst/${cstCode.replace(/\//g, ".")}`, payload);
    return data;
}

export async function closeCst(cstCode: string) {
    const { data } = await api.post('/cst/close', {
        cst_code: cstCode
    });
    return data;
}

export async function cancelCst(cstCode: string) {
    const { data } = await api.post('/cst/cancel', {
        cst_code: cstCode
    });
    return data;
}
