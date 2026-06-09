import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCategoryForm from '../forms/ProductCategoryForm';
import { createProductCategory } from '../api/productCategoryApi';
import type { ProductCategoryFormData } from '../validation/productCategorySchema';
import { showAlert } from '../../../components/SweetAlert';

const ProductCategoryAddPage: React.FC = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (data: ProductCategoryFormData) => {
        setIsSubmitting(true);
        try {
            const response = await createProductCategory(data);
            if (response.success) {
                showAlert.success('Berhasil', 'Product Category berhasil ditambahkan');
                navigate('/productcategory');
            } else {
                showAlert.error('Gagal', response.message || 'Gagal menambahkan Product Category');
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
                <p className="text-[32px] font-normal text-[#3f2a2a] tracking-tight">Tambah Category</p>
                <div className="text-[13px] text-gray-500 font-medium">EMM Service / Category / Tambah</div>
            </div>

            <div className="bg-white rounded shadow-sm border border-gray-200">
                <div className="p-6">
                    <ProductCategoryForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
                </div>
            </div>
        </div>
    );
};

export default ProductCategoryAddPage;
