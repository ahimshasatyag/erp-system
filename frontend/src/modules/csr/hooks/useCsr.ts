import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type StoreCsrValues, type UpdateCsrValues } from "../validation/csrSchema";
import * as csrApi from "../api/csrApi";

// React Query Hooks for CSR Module wrapping axios direct API calls

export function useGetCsrs(params: {
    search?: string;
    start_date?: string;
    end_date?: string;
    all?: boolean;
    status?: string;
    page?: number;
}) {
    return useQuery({
        queryKey: ["csrs", params],
        queryFn: () => csrApi.getCsrs(params)
    });
}

export function useGetMenuInfo(menuId: string) {
    return useQuery({
        queryKey: ["menu", menuId],
        queryFn: () => csrApi.getMenuInfo(menuId),
        enabled: !!menuId
    });
}

export function useGetCsrDetail(csrCode: string) {
    return useQuery({
        queryKey: ["csr", csrCode],
        queryFn: () => csrApi.getCsrDetail(csrCode),
        enabled: !!csrCode
    });
}

export function useCreateCsr() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: StoreCsrValues) => csrApi.createCsr(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["csrs"] });
        }
    });
}

export function useUpdateCsr() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ csrCode, payload }: { csrCode: string; payload: UpdateCsrValues }) =>
            csrApi.updateCsr(csrCode, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["csrs"] });
            queryClient.invalidateQueries({ queryKey: ["csr"] });
        }
    });
}

export function useConfirmCsr() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ csrCode, customer, product }: { csrCode: string; customer: string; product: string }) =>
            csrApi.confirmCsr(csrCode, customer, product),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["csrs"] });
            queryClient.invalidateQueries({ queryKey: ["csr"] });
        }
    });
}

export function useCancelCsr() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ csrCode, customer, product, memo }: { csrCode: string; customer: string; product: string; memo: string }) =>
            csrApi.cancelCsr(csrCode, customer, product, memo),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["csrs"] });
            queryClient.invalidateQueries({ queryKey: ["csr"] });
        }
    });
}

export function useGetCsrFormData() {
    return useQuery({
        queryKey: ["csrFormData"],
        queryFn: () => csrApi.getCsrFormData(),
        staleTime: 5 * 60 * 1000
    });
}

export function useIsiOtomatis() {
    return useMutation({
        mutationFn: (barcode: string) => csrApi.getBarcodeData(barcode)
    });
}

export function useAddNewCst() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (csrCode: string) => csrApi.addNewCst(csrCode),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["csr"] });
        }
    });
}
