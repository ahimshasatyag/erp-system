import React from 'react';
import { useNavigate } from 'react-router-dom';
import QuotationApForm from '../forms/QuotationApForm';
import { useCreateQuotationAp } from '../hooks/useQuotationAp';
import type { QuotationApFormData } from '../validation/quotationApSchema';

const QuotationApAddPage: React.FC = () => {
    const navigate = useNavigate();
    const createMutation = useCreateQuotationAp();

    const handleSubmit = async (data: QuotationApFormData, file: File | null) => {
        // Convert to FormData
        const formData = new FormData();
        
        formData.append('id_suppliers', data.id_suppliers);
        formData.append('mata_uang', data.mata_uang);
        formData.append('date_po', data.date_po);
        formData.append('id_gudang', data.id_gudang);
        formData.append('id_product_lokasi', data.id_product_lokasi);
        
        if (data.partner_ref) formData.append('partner_ref', data.partner_ref);
        if (data.notes) formData.append('notes', data.notes);
        if (data.date_schdl) formData.append('date_schdl', data.date_schdl);
        if (file) formData.append('link_file', file);

        // Append details
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

        createMutation.mutate(formData as any, {
            onSuccess: () => navigate('/quotationsap')
        });
    };

    return (
        <div className="w-full min-h-screen py-2 px-4">
            <div className="flex justify-between items-center mb-4 pt-2">
                <p className="text-2xl font-semibold text-[#3f2a2a] tracking-tight">Tambah Quotations AP</p>
                <div className="text-[12px] text-gray-500 font-medium">EMM Master / Quotations AP / Tambah</div>
            </div>

            <div className="bg-white rounded shadow-sm border border-gray-200">
                <div className="p-2">
                    <QuotationApForm
                        onSubmit={handleSubmit}
                        isSubmitting={createMutation.isLoading}
                        onCancel={() => navigate('/quotationsap')}
                    />
                </div>
            </div>
        </div>
    );
};

export default QuotationApAddPage;
