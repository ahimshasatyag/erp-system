import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductUnitForm from '../forms/ProductUnitForm';
import { createProductUnit } from '../api/productUnitApi';
import type { ProductUnitFormData } from '../validation/productUnitSchema';
import { showAlert } from '../../../components/SweetAlert';

const ProductUnitAddPage: React.FC = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (data: ProductUnitFormData) => {
        setIsSubmitting(true);
        try {
            const response = await createProductUnit(data);
            if (response.success) {
                showAlert.success('Berhasil', 'Product Unit berhasil ditambahkan');
                navigate('/productunit');
            } else {
                showAlert.error('Gagal', response.message || 'Gagal menambahkan Product Unit');
            }
        } catch (error: any) {
            showAlert.error('Error', error.response?.data?.message || 'Terjadi kesalahan pada server');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full min-h-screen py-2 px-6">
            <div className="flex justify-between items-center mb-6 pt-2">
                <p className="text-[32px] font-normal text-[#3f2a2a] tracking-tight">Tambah Product Unit</p>
                <div className="text-[13px] text-gray-500 font-medium">EMM Service / Product Unit / Tambah</div>
            </div>

            <div className="bg-white rounded shadow-sm border border-gray-200">
                <div className="p-6">
                    <ProductUnitForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
                </div>
            </div>
        </div>
    );
};

export default ProductUnitAddPage;
