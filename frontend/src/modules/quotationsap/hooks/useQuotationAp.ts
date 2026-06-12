import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getQuotationAps,
    getQuotationAp,
    createQuotationAp,
    updateQuotationAp,
    confirmQuotationAp,
    cancelQuotationAp,
    getMataUangDefault,
    getProductDetail,
    getLokasi
} from '../api/quotationApApi';
import Swal from 'sweetalert2';

export const useQuotationAps = (params?: Record<string, any>) => {
    return useQuery({
        queryKey: ['quotation-aps', params],
        queryFn: () => getQuotationAps(params),
        keepPreviousData: true,
    });
};

export const useQuotationAp = (id: string | number) => {
    return useQuery({
        queryKey: ['quotation-ap', id],
        queryFn: () => getQuotationAp(id),
        enabled: !!id,
    });
};

export const useCreateQuotationAp = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createQuotationAp,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quotation-aps'] });
            Swal.fire('Berhasil', 'Quotation AP berhasil dibuat', 'success');
        },
        onError: (error: any) => {
            Swal.fire('Error', error?.response?.data?.message || 'Gagal membuat Quotation AP', 'error');
        },
    });
};

export const useUpdateQuotationAp = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string | number; data: FormData }) => updateQuotationAp(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['quotation-aps'] });
            queryClient.invalidateQueries({ queryKey: ['quotation-ap', variables.id] });
            Swal.fire('Berhasil', 'Quotation AP berhasil diperbarui', 'success');
        },
        onError: (error: any) => {
            Swal.fire('Error', error?.response?.data?.message || 'Gagal memperbarui Quotation AP', 'error');
        },
    });
};

export const useConfirmQuotationAp = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: confirmQuotationAp,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quotation-aps'] });
            Swal.fire('Berhasil', 'Quotation AP berhasil dikonfirmasi ke PO', 'success');
        },
        onError: (error: any) => {
            Swal.fire('Error', error?.response?.data?.message || 'Gagal mengkonfirmasi Quotation', 'error');
        },
    });
};

export const useCancelQuotationAp = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: cancelQuotationAp,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quotation-aps'] });
            Swal.fire('Berhasil', 'Quotation AP berhasil dibatalkan', 'success');
        },
        onError: (error: any) => {
            Swal.fire('Error', error?.response?.data?.message || 'Gagal membatalkan Quotation', 'error');
        },
    });
};

// Helper hooks
export const useMataUangDefault = (id_supplier: string) => {
    return useQuery({
        queryKey: ['mata-uang-default', id_supplier],
        queryFn: () => getMataUangDefault(id_supplier),
        enabled: !!id_supplier,
    });
};

export const useProductDetail = (id_product: string) => {
    return useQuery({
        queryKey: ['product-detail', id_product],
        queryFn: () => getProductDetail(id_product),
        enabled: !!id_product,
    });
};

export const useLokasi = (id_gudang: string) => {
    return useQuery({
        queryKey: ['lokasi', id_gudang],
        queryFn: () => getLokasi(id_gudang),
        enabled: !!id_gudang,
    });
};
