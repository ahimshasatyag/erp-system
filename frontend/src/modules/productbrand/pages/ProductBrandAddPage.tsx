import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductBrandForm from '../forms/ProductBrandForm';
import { createProductBrand } from '../api/productBrandApi';
import type { ProductBrandFormData } from '../validation/productBrandSchema';
import { showAlert } from '../../../components/SweetAlert';

const ProductBrandAddPage: React.FC = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (data: ProductBrandFormData) => {
        setIsSubmitting(true);
        try {
            const response = await createProductBrand(data);
            if (response.success) {
                showAlert.success('Berhasil', 'Brand berhasil ditambahkan');
                navigate('/productbrand');
            } else {
                showAlert.error('Gagal', response.message || 'Gagal menambahkan Brand');
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
                <p className="text-[32px] font-normal text-[#3f2a2a] tracking-tight">Tambah Brand</p>
                <div className="text-[13px] text-gray-500 font-medium">EMM Service / Brand / Tambah</div>
            </div>

            <div className="bg-white rounded shadow-sm border border-gray-200">
                <div className="p-6">
                    <ProductBrandForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
                </div>
            </div>
        </div>
    );
};

export default ProductBrandAddPage;
