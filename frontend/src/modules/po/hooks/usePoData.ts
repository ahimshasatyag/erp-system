import { useQuery } from '@tanstack/react-query';
import { getPoMasterData, getPoById } from '../api';

export const usePoMasterData = () => {
    return useQuery({
        queryKey: ['poMasterData'],
        queryFn: getPoMasterData,
        staleTime: 5 * 60 * 1000,
    });
};

export const usePoDetail = (id?: string) => {
    return useQuery({
        queryKey: ['poDetail', id],
        queryFn: () => getPoById(id!),
        enabled: !!id,
    });
};
