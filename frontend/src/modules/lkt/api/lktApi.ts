import api from "../../../services/api";

// Fetch & Mutation functions for LKT Module

export async function getLkts(params: {
    search?: string;
    start_date?: string;
    end_date?: string;
    all?: boolean;
    page?: number;
    status?: string;
}) {
    const { data } = await api.get('/lkt', { params });
    return data;
}

export async function getMenuInfo(menuId: string) {
    const { data } = await api.get(`/menus/${menuId}`);
    return data;
}

export async function getLktDetail(lktCode: string) {
    const { data } = await api.get(`/lkt/${lktCode.replace(/\//g, ".")}`);
    return data; // Assumes Laravel wraps response with details (visits, parts, etc)
}

export async function getCstDetailForLkt(cstCode: string) {
    const { data } = await api.get(`/cst/${cstCode.replace(/\//g, ".")}`);
    return data;
}

export async function createLkt(formData: FormData) {
    const { data } = await api.post('/lkt', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data;
}

export async function updateLkt(lktCode: string, formData: FormData) {
    // Laravel PUT request with multipart/form-data can be simulated using POST with _method=PUT
    formData.append('_method', 'PUT');
    const { data } = await api.post(`/lkt/${lktCode.replace(/\//g, ".")}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data;
}

export async function confirmLkt(lktCode: string, cstCode: string) {
    const { data } = await api.post('/lkt/confirm', { lkt_code: lktCode, cst_code: cstCode });
    return data;
}

export async function closeLkt(lktCode: string) {
    const { data } = await api.post('/lkt/close', { lkt_code: lktCode });
    return data;
}

export async function cancelLkt(lktCode: string) {
    const { data } = await api.post('/lkt/cancel', { lkt_code: lktCode });
    return data;
}

export async function saveVisit(formData: FormData) {
    const { data } = await api.post('/lkt/visit', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data;
}

export async function getVisitDetail(subCode: string) {
    const { data } = await api.get(`/lkt/visit/${subCode}`);
    return data;
}

export async function updateVisit(subCode: string, formData: FormData) {
    const { data } = await api.post(`/lkt/visit/${subCode}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data;
}

export async function savePart(payload: {
    lkt_code: string;
    add_part_name: string;
    add_qty_part: number;
    add_harga_es: number;
}) {
    const { data } = await api.post('/lkt/part', payload);
    return data;
}

export async function savePartVisit(payload: {
    lkt_code: string;
    id_visit: string;
    add_part_name: string;
    add_qty_part: number;
    add_harga_es: number;
}) {
    const { data } = await api.post('/lkt/part-visit', payload);
    return data;
}
