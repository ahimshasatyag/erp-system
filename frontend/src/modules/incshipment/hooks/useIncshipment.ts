import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { incshipmentApi } from '../api/incshipmentApi';
import Swal from 'sweetalert2';

export const useIncShipments = (page = 1, perPage = 10, search = '', status = 'ALL') => {
  return useQuery({
    queryKey: ['incshipments', page, perPage, search, status],
    queryFn: () => incshipmentApi.getIncShipments(page, perPage, search, status),
  });
};

export const useIncShipment = (id: number) => {
  return useQuery({
    queryKey: ['incshipment', id],
    queryFn: () => incshipmentApi.getIncShipmentById(id),
    enabled: !!id,
  });
};

export const useReceiveIncShipment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, dataBarang }: { id: number; dataBarang: { id_dtl: number }[] }) => 
      incshipmentApi.receiveIncShipment(id, dataBarang),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['incshipment', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['incshipments'] });
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: data.message || 'Berhasil receive incoming shipment',
      });
    },
    onError: (error: any) => {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: error?.response?.data?.message || 'Gagal receive incoming shipment',
      });
    }
  });
};

export const useAssignSn = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => incshipmentApi.assignSn(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['incshipment', id] });
      queryClient.invalidateQueries({ queryKey: ['incshipments'] });
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: data.message || 'Berhasil assign serial number',
      });
    },
    onError: (error: any) => {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: error?.response?.data?.message || 'Gagal assign serial number',
      });
    }
  });
};

export const usePrintBarcode = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => incshipmentApi.printBarcode(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['incshipment', id] });
      queryClient.invalidateQueries({ queryKey: ['incshipments'] });
    },
    onError: (error: any) => {
      console.error(error?.response?.data?.message || 'Gagal update status print barcode');
    }
  });
};
