import { useQuery } from '@tanstack/react-query';
import { getSerialNumberDetail, type CekSerialNumberResponse } from '../api/cekSerialNumberApi';

export const useSerialNumberDetail = (barcode: string) => {
    return useQuery<CekSerialNumberResponse, Error>({
        queryKey: ['cekserialnumber', barcode],
        queryFn: () => getSerialNumberDetail(barcode),
        enabled: !!barcode && barcode.length > 0,
        retry: false,
        refetchOnWindowFocus: false,
    });
};
