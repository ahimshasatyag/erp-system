import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as lktApi from '../api/lktApi';

export function useGetLkts(params: {
    search?: string;
    start_date?: string;
    end_date?: string;
    all?: boolean;
    page?: number;
    status?: string;
}) {
    return useQuery({
        queryKey: ['lkts', params],
        queryFn: () => lktApi.getLkts(params),
    });
}

export function useGetMenuInfo(menuId: string) {
    return useQuery({
        queryKey: ['menuInfo', menuId],
        queryFn: () => lktApi.getMenuInfo(menuId),
        staleTime: 1000 * 60 * 30, // 30 minutes
    });
}

export function useGetLktDetail(lktCode: string) {
    return useQuery({
        queryKey: ['lktDetail', lktCode],
        queryFn: () => lktApi.getLktDetail(lktCode),
        enabled: !!lktCode,
    });
}

export function useGetCstDetailForLkt(cstCode: string) {
    return useQuery({
        queryKey: ['cstDetailForLkt', cstCode],
        queryFn: () => lktApi.getCstDetailForLkt(cstCode),
        enabled: !!cstCode,
    });
}

export function useCreateLkt() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (formData: FormData) => lktApi.createLkt(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lkts'] });
        },
    });
}

export function useUpdateLkt() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ lktCode, formData }: { lktCode: string; formData: FormData }) =>
            lktApi.updateLkt(lktCode, formData),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['lkts'] });
            queryClient.invalidateQueries({ queryKey: ['lktDetail', variables.lktCode] });
        },
    });
}

export function useConfirmLkt() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ lktCode, cstCode }: { lktCode: string; cstCode: string }) =>
            lktApi.confirmLkt(lktCode, cstCode),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['lkts'] });
            queryClient.invalidateQueries({ queryKey: ['lktDetail', variables.lktCode] });
        },
    });
}

export function useCloseLkt() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (lktCode: string) => lktApi.closeLkt(lktCode),
        onSuccess: (_, lktCode) => {
            queryClient.invalidateQueries({ queryKey: ['lkts'] });
            queryClient.invalidateQueries({ queryKey: ['lktDetail', lktCode] });
        },
    });
}

export function useCancelLkt() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (lktCode: string) => lktApi.cancelLkt(lktCode),
        onSuccess: (_, lktCode) => {
            queryClient.invalidateQueries({ queryKey: ['lkts'] });
            queryClient.invalidateQueries({ queryKey: ['lktDetail', lktCode] });
        },
    });
}

export function useSaveVisit() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (formData: FormData) => lktApi.saveVisit(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lkts'] });
        },
    });
}

export function useSavePart() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: {
            lkt_code: string;
            add_part_name: string;
            add_qty_part: number;
            add_harga_es: number;
        }) => lktApi.savePart(payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['lktDetail', variables.lkt_code] });
        },
    });
}

export function useSavePartVisit() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: {
            lkt_code: string;
            id_visit: string;
            add_part_name: string;
            add_qty_part: number;
            add_harga_es: number;
        }) => lktApi.savePartVisit(payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['lktDetail', variables.lkt_code] });
            queryClient.invalidateQueries({ queryKey: ['visitDetail', variables.id_visit] });
        },
    });
}

export function useGetVisitDetail(subCode: string) {
    return useQuery({
        queryKey: ['visitDetail', subCode],
        queryFn: () => lktApi.getVisitDetail(subCode),
        enabled: !!subCode,
    });
}

export function useUpdateVisit() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ subCode, formData }: { subCode: string; formData: FormData }) =>
            lktApi.updateVisit(subCode, formData),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['lkts'] });
            queryClient.invalidateQueries({ queryKey: ['visitDetail', variables.subCode] });
        },
    });
}
