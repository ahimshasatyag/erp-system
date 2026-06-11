import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    fetchSuppliers,
    fetchSupplier,
    createSupplier,
    updateSupplier,
    deleteSupplier
} from '../api/supplierApi';
import type { SupplierRequestPayload } from '../api/types';

export const useSuppliers = (params?: any) => {
    return useQuery({
        queryKey: ['suppliers', params],
        queryFn: () => fetchSuppliers(params),
        placeholderData: (previousData) => previousData,
    });
};

export const useSupplier = (id: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['supplier', id],
        queryFn: () => fetchSupplier(id),
        enabled: !!id && enabled,
    });
};

export const useCreateSupplier = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SupplierRequestPayload) => createSupplier(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['suppliers'] });
        },
    });
};

export const useUpdateSupplier = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: SupplierRequestPayload }) => updateSupplier(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['suppliers'] });
            queryClient.invalidateQueries({ queryKey: ['supplier', variables.id] });
        },
    });
};

export const useDeleteSupplier = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteSupplier(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['suppliers'] });
        },
    });
};
