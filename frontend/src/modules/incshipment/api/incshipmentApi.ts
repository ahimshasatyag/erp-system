import api from '../../../services/api';

export interface IncShipmentData {
  id_incoming: number;
  code: string;
  id_po: number;
  code_po: string;
  id_suppliers: number;
  nm_suppliers: string;
  date_receive: string | null;
  status_incoming: string;
  date_create: string;
  f_assign_barcode: number;
  f_print_barcode: number;
  f_ok_receive: number;
  details?: IncShipmentDetailData[];
}

export interface IncShipmentDetailData {
  id_dtl: number;
  id_product: number;
  code_product: string;
  nm_product: string;
  nm_product_satuan: string;
  qty: number;
  sn: string | null;
  status: string;
  qty_terima: number;
  id_product_lokasi_source: number;
  lokasi_source: string | null;
  id_product_lokasi_destination: number;
  lokasi_destination: string | null;
}

export const incshipmentApi = {
  getIncShipments: async (page = 1, perPage = 10, search = '', status = 'ALL') => {
    const response = await api.get('/incshipment', {
      params: { page, per_page: perPage, search, status }
    });
    return response.data;
  },

  getIncShipmentById: async (id: number): Promise<{ data: IncShipmentData }> => {
    const response = await api.get(`/incshipment/${id}`);
    return response.data;
  },

  receiveIncShipment: async (id: number, dataBarang: { id_dtl: number }[]) => {
    const response = await api.post(`/incshipment/${id}/receive`, { data_barang: dataBarang });
    return response.data;
  },

  assignSn: async (id: number) => {
    const response = await api.post(`/incshipment/${id}/assign-sn`);
    return response.data;
  },

  printBarcode: async (id: number) => {
    const response = await api.post(`/incshipment/${id}/print-barcode`);
    return response.data;
  }
};
