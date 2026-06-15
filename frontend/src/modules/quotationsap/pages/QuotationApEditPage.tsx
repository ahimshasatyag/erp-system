import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuotationApForm from '../forms/QuotationApForm';
import { useQuotationAp, useUpdateQuotationAp, useConfirmQuotationAp } from '../hooks/useQuotationAp';
import type { QuotationApFormData } from '../validation/quotationApSchema';
import Swal from 'sweetalert2';

const QuotationApEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isViewMode, setIsViewMode] = useState(true);

    const { data: initialData, isLoading, isError } = useQuotationAp(id as string);
    const updateMutation = useUpdateQuotationAp();
    const confirmMutation = useConfirmQuotationAp();

    const handleSubmit = async (data: QuotationApFormData, file: File | null) => {
        if (!id) return;
        
        const formData = new FormData();
        
        formData.append('id_suppliers', data.id_suppliers);
        formData.append('mata_uang', data.mata_uang);
        formData.append('date_po', data.date_po);
        formData.append('id_gudang', data.id_gudang);
        formData.append('id_product_lokasi', data.id_product_lokasi);
        formData.append('_method', 'PUT');
        
        if (data.partner_ref) formData.append('partner_ref', data.partner_ref);
        if (data.notes) formData.append('notes', data.notes);
        if (data.date_schdl) formData.append('date_schdl', data.date_schdl);
        if (file) formData.append('link_file', file);

        data.details.forEach((detail, idx) => {
            formData.append(`details[${idx}][id_product]`, detail.id_product);
            formData.append(`details[${idx}][code_product]`, detail.code_product || '');
            formData.append(`details[${idx}][nm_product]`, detail.nm_product || '');
            formData.append(`details[${idx}][product_deskripsi]`, detail.product_deskripsi || '');
            formData.append(`details[${idx}][qty]`, String(detail.qty));
            formData.append(`details[${idx}][product_price]`, String(detail.product_price));
            formData.append(`details[${idx}][notes]`, detail.notes || '');

            if (detail.options && detail.options.length > 0) {
                detail.options.forEach((opt, optIdx) => {
                    if (opt.checked) {
                        formData.append(`details[${idx}][options][${optIdx}][nm_product_opt]`, opt.nm_product_opt);
                        formData.append(`details[${idx}][options][${optIdx}][harga]`, String(opt.harga));
                    }
                });
            }
        });

        updateMutation.mutate({ id, data: formData as any }, {
            onSuccess: () => {
                setIsViewMode(true);
            }
        });
    };

    const handleConfirm = () => {
        if (!id) return;
        Swal.fire({
            title: 'Konfirmasi',
            text: 'Apakah Anda yakin ingin confirm quotation ini menjadi PO?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Confirm',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                confirmMutation.mutate(id, {
                    onSuccess: () => navigate('/quotationsap')
                });
            }
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (isError || !initialData) {
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="bg-red-50 text-red-500 p-4 rounded text-center">
                    Gagal memuat data Quotation AP.
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen py-2 px-4">
            <div className="flex justify-between items-center mb-4 pt-2">
                <p className="text-2xl font-semibold text-[#3f2a2a] tracking-tight">Detail Quotations AP</p>
                <div className="text-[12px] text-gray-500 font-medium">EMM Master / Quotations AP / Detail</div>
            </div>

            <div className="bg-white rounded shadow-sm border border-gray-200">
                <div className="p-2">
                    <QuotationApForm
                        initialData={initialData}
                        onSubmit={handleSubmit}
                        isSubmitting={updateMutation.isLoading || confirmMutation.isLoading}
                        isEditMode={!isViewMode}
                        isViewMode={isViewMode}
                        onEdit={() => setIsViewMode(false)}
                        onConfirm={handleConfirm}
                        onCancel={() => {
                            if (!isViewMode) {
                                setIsViewMode(true);
                            } else {
                                navigate('/quotationsap');
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default QuotationApEditPage;
