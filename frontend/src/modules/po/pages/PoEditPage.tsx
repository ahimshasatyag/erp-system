import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { PoForm } from '../forms/PoForm';
import { updatePo, confirmPo } from '../api';
import type { PoFormData } from '../validation/poSchema';
import { usePoDetail } from '../hooks/usePoData';
import Swal from 'sweetalert2';

export const PoEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isEditMode, setIsEditMode] = useState(false);
    
    const { data: initialData, isLoading, refetch } = usePoDetail(id);

    const updateMutation = useMutation({
        mutationFn: (data: FormData | PoFormData) => updatePo(id!, data),
        onSuccess: () => {
            Swal.fire('Success', 'PO updated successfully', 'success');
            setIsEditMode(false);
            refetch();
        },
        onError: (error: any) => {
            Swal.fire('Error', error?.response?.data?.message || 'Failed to update PO', 'error');
        }
    });

    const confirmMutation = useMutation({
        mutationFn: () => confirmPo(id!),
        onSuccess: () => {
            Swal.fire('Success', 'PO confirmed successfully', 'success');
            refetch();
        },
        onError: (error: any) => {
            Swal.fire('Error', error?.response?.data?.message || 'Failed to confirm PO', 'error');
        }
    });

    const handleSubmit = (data: PoFormData, file: File | null) => {
        if (file) {
            const formData = new FormData();
            formData.append('_method', 'PUT'); // Required for Laravel PUT with FormData
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
            updateMutation.mutate(formData);
        } else {
            updateMutation.mutate(data);
        }
    };

    const handleConfirm = () => {
        Swal.fire({
            title: 'Confirm Quotation?',
            text: 'Anda tidak dapat mengubah data ini lagi ketika sudah di confirm!',
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Ya, Confirm!',
            cancelButtonText: 'Tidak, batalkan!',
        }).then((result) => {
            if (result.isConfirmed) {
                confirmMutation.mutate();
            }
        });
    };

    if (isLoading) return <div className="p-4 text-[13px]">Loading...</div>;

    const isViewMode = !isEditMode;

    return (
        <div className="w-full min-h-screen py-2 px-4">
            <div className="flex justify-between items-center mb-4 pt-2">
                <div className="flex items-center gap-4">
                    <p className="text-2xl font-semibold text-[#3f2a2a] tracking-tight">
                        {isEditMode ? 'Edit Purchase Order' : 'Detail Purchase Order'}
                    </p>
                    {isViewMode && initialData?.status_po && (
                        <span className={`px-2 py-1 rounded text-[13px] font-semibold ${initialData.status_po === 'DRAFT PO' ? 'bg-gray-200 text-gray-700' : 'bg-green-100 text-green-700'}`}>
                            {initialData.status_po}
                        </span>
                    )}
                </div>
                <div className="text-[12px] text-gray-500 font-medium">EMM Master / PO / {isEditMode ? 'Edit' : 'Detail'}</div>
            </div>

            <div className="bg-white rounded shadow-sm border border-gray-200">
                <div className="p-2">
                    <PoForm
                        initialData={initialData}
                        onSubmit={handleSubmit}
                        isSubmitting={updateMutation.isLoading || confirmMutation.isLoading}
                        isViewMode={isViewMode}
                        onEdit={() => setIsEditMode(true)}
                        onCancel={() => {
                            if (isEditMode) {
                                setIsEditMode(false);
                            } else {
                                navigate('/po');
                            }
                        }}
                        onConfirm={handleConfirm}
                    />
                </div>
            </div>
        </div>
    );
};
