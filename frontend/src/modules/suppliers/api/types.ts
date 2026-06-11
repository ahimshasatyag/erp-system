export interface SupplierContact {
    id?: number;
    id_suppliers?: string;
    nm_suppliers_contact: string;
    suppliers_contact_posisi?: string;
    suppliers_contact_phone?: string;
    suppliers_contact_email?: string;
}

export interface Supplier {
    id_suppliers: string;
    nm_suppliers: string;
    suppliers_mobile?: string;
    suppliers_email?: string;
    suppliers_address?: string;
    suppliers_phone?: string;
    suppliers_fax?: string;
    suppliers_website?: string;
    suppliers_logo?: string;
    id_mata_uang?: string;
    date_create?: string;
    date_update?: string;
    contacts?: SupplierContact[];
}

export interface SupplierListResponse {
    data: Supplier[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export interface SupplierRequestPayload {
    id_suppliers?: string;
    nm_suppliers: string;
    suppliers_mobile?: string;
    suppliers_email?: string;
    suppliers_address?: string;
    suppliers_phone?: string;
    suppliers_fax?: string;
    suppliers_website?: string;
    id_mata_uang?: string;
    contacts?: SupplierContact[];
    file?: File | null;
}
