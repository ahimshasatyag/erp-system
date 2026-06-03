import api from '../../../services/api';

export interface SerialNumberDetail {
    code_product: string;
    nm_product: string;
    product_deskripsi: string;
    customer: string;
    customer_address: string;
    provinsi: string;
    kabupaten: string;
    customer_phone: string;
    customer_mobile: string;
    do_code: string;
    waranty_start: string;
    waranty_time: string;
    waranty_end: string;
    waranty_end_raw: string | null;
}

export interface SerialNumberHistory {
    cst_code: string;
    cst_date: string;
    catatan_kerusakan: string;
    total_realisasi: string | number;
    laporan_akhir: string;
    teknisi: string;
    id_afs_lkt?: number;
}

export interface CekSerialNumberResponse {
    status: boolean;
    data: SerialNumberDetail[];
    history: SerialNumberHistory[];
    message?: string;
}

export const getSerialNumberDetail = async (barcode: string): Promise<CekSerialNumberResponse> => {
    const response = await api.get(`/cekserialnumber/${barcode}`);
    return response.data;
};
