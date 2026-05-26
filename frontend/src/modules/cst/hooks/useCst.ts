import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type UpdateCstValues } from "../validation/cstSchema";
import * as cstApi from "../api/cstApi";

export function useGetCsts(params: {
    search?: string;
    start_date?: string;
    end_date?: string;
    all?: boolean;
    page?: number;
}) {
    return useQuery({
        queryKey: ["csts", params],
        queryFn: () => cstApi.getCsts(params)
    });
}

export function useGetMenuInfo(menuId: string) {
    return useQuery({
        queryKey: ["menu", menuId],
        queryFn: () => cstApi.getMenuInfo(menuId),
        enabled: !!menuId
    });
}

export function useGetCstDetail(cstCode: string) {
    return useQuery({
        queryKey: ["cst", cstCode],
        queryFn: () => cstApi.getCstDetail(cstCode),
        enabled: !!cstCode
    });
}

export function useUpdateCst() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ cstCode, payload }: { cstCode: string; payload: UpdateCstValues }) =>
            cstApi.updateCst(cstCode, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["csts"] });
            queryClient.invalidateQueries({ queryKey: ["cst"] });
        }
    });
}

export function useCloseCst() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (cstCode: string) => cstApi.closeCst(cstCode),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["csts"] });
            queryClient.invalidateQueries({ queryKey: ["cst"] });
        }
    });
}

export function useCancelCst() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (cstCode: string) => cstApi.cancelCst(cstCode),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["csts"] });
            queryClient.invalidateQueries({ queryKey: ["cst"] });
        }
    });
}
