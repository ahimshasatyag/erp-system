import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../services/api";
import { type StoreCsrValues, type UpdateCsrValues } from "../validation/csrSchema";

export function useGetCsrs(params: { search?: string; start_date?: string; end_date?: string; all?: boolean; status?: string; page?: number }) {
    return useQuery({
        queryKey: ["csrs", params],
        queryFn: async () => {
            const { data } = await api.get(`/csr`, {
                params
            });
            return data;
        },
    });
}

export function useGetMenuInfo(menuId: string) {
    return useQuery({
        queryKey: ["menu", menuId],
        queryFn: async () => {
            const { data } = await api.get(`/menus/${menuId}`);
            return data;
        },
        enabled: !!menuId,
    });
}

export function useGetCsrDetail(csrCode: string) {
    return useQuery({
        queryKey: ["csr", csrCode],
        queryFn: async () => {
            const { data } = await api.get(`/csr/${csrCode.replace(/\//g, ".")}`);
            return data.data; // Assumes Laravel Resource wraps in 'data'
        },
        enabled: !!csrCode,
    });
}

export function useCreateCsr() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: StoreCsrValues) => {
            const formData = new FormData();
            Object.entries(payload).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, value as string | Blob);
                }
            });

            const { data } = await api.post(`/csr`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["csrs"] });
        }
    });
}

export function useUpdateCsr() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ csrCode, payload }: { csrCode: string, payload: UpdateCsrValues }) => {
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
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["csrs"] });
            queryClient.invalidateQueries({ queryKey: ["csr"] });
        }
    });
}

export function useConfirmCsr() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ csrCode, customer, product }: { csrCode: string, customer: string, product: string }) => {
            const { data } = await api.post(`/csr/confirm`, {
                csr_code: csrCode,
                customer: customer,
                product: product
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["csrs"] });
            queryClient.invalidateQueries({ queryKey: ["csr"] });
        }
    });
}

export function useCancelCsr() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ csrCode, customer, product, memo }: { csrCode: string, customer: string, product: string, memo: string }) => {
            const { data } = await api.post(`/csr/cancel`, {
                csr_code: csrCode,
                customer: customer,
                product: product,
                memo: memo
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["csrs"] });
            queryClient.invalidateQueries({ queryKey: ["csr"] });
        }
    });
}
