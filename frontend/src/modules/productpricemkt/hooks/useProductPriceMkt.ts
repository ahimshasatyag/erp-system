import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    fetchProductPriceMktList, 
    fetchProductPriceMktDetail, 
    addToCart, 
    fetchProductPriceMktPdf 
} from '../api/productPriceMktApi';
import { showAlert } from '../../../components/SweetAlert'; // Fix import path

export const useProductPriceMktList = () => {
    return useQuery({
        queryKey: ['productPriceMktList'],
        queryFn: fetchProductPriceMktList,
    });
};

export const useProductPriceMktDetail = (id: string | null) => {
    return useQuery({
        queryKey: ['productPriceMktDetail', id],
        queryFn: () => fetchProductPriceMktDetail(id as string),
        enabled: !!id,
    });
};

export const useProductPriceMktPdf = (id: string | null) => {
    return useQuery({
        queryKey: ['productPriceMktPdf', id],
        queryFn: () => fetchProductPriceMktPdf(id as string),
        enabled: !!id,
    });
};

export const useAddToCart = () => {
    return useMutation({
        mutationFn: (id_product: string) => addToCart(id_product),
        onSuccess: () => {
            showAlert.success('Berhasil!', 'Barang Berhasil Masuk Keranjang !');
        },
        onError: () => {
            showAlert.error('Maaf', 'Terjadi kesalahan saat menambahkan ke keranjang');
        }
    });
};
