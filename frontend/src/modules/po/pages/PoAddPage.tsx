import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { PoForm } from '../forms/PoForm';
import type { PoFormData } from '../validation/poSchema';
import { createPo } from '../api';
import Swal from 'sweetalert2';

export const PoAddPage: React.FC = () => {
    const navigate = useNavigate();
    
    const createMutation = useMutation({
        mutationFn: (data: FormData | PoFormData) => createPo(data),
        onSuccess: () => {
            Swal.fire('Success', 'PO created successfully', 'success');
            navigate('/po');
        },
        onError: (error: any) => {
            Swal.fire('Error', error?.response?.data?.message || 'Failed to create PO', 'error');
        }
    });

    const handleSubmit = (data: PoFormData, file: File | null) => {
        if (file) {
            const formData = new FormData();
            formData.append('id_suppliers', data.id_suppliers);
            if (data.partner_ref) formData.append('partner_ref', data.partner_ref);
            if (data.mata_uang) formData.append('mata_uang', data.mata_uang);
            formData.append('id_gudang', data.id_gudang);
            formData.append('date_po', data.date_po);
            if (data.date_schdl) formData.append('date_schdl', data.date_schdl);
            if (data.id_product_lokasi) formData.append('id_product_lokasi', data.id_product_lokasi);
            if (data.notes) formData.append('notes', data.notes);
            
            data.details.forEach((detail, index) => {
                formData.append(`details[${index}][id_product]`, detail.id_product);
                formData.append(`details[${index}][qty]`, detail.qty.toString());
                formData.append(`details[${index}][product_price]`, detail.product_price.toString());
                if (detail.notes) formData.append(`details[${index}][notes]`, detail.notes);
            });
            formData.append('file', file);
            createMutation.mutate(formData);
        } else {
            createMutation.mutate(data);
        }
    };

    return (
        <div className="w-full min-h-screen py-2 px-4">
            <div className="flex justify-between items-center mb-4 pt-2">
                <p className="text-2xl font-semibold text-[#3f2a2a] tracking-tight">Tambah Purchase Order</p>
                <div className="text-[12px] text-gray-500 font-medium">EMM Master / PO / Tambah</div>
            </div>

            <div className="bg-white rounded shadow-sm border border-gray-200">
                <div className="p-2">
                    <PoForm
                        onSubmit={handleSubmit}
                        isSubmitting={createMutation.isLoading}
                        onCancel={() => navigate('/po')}
                    />
                </div>
            </div>
        </div>
    );
};
