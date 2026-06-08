import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductSubCategoryForm from '../forms/ProductSubCategoryForm';
import { createProductSubCategory } from '../api/productSubCategoryApi';
import type { ProductSubCategoryFormData } from '../validation/productSubCategorySchema';

const ProductSubCategoryCreatePage: React.FC = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (data: ProductSubCategoryFormData) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await createProductSubCategory(data);
            navigate('/productsubcategory');
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to create sub category');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full min-h-screen py-2 px-6">
            <div className="flex justify-between items-center mb-6 pt-2">
                <p className="text-[32px] font-normal text-[#3f2a2a] tracking-tight">Tambah Subcategory</p>
                <div className="text-[13px] text-gray-500 font-medium">EMM Service / Subcategory</div>
            </div>

            <div className="bg-white rounded shadow-sm border border-gray-200">
                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded text-[13px]">
                            {error}
                        </div>
                    )}

                    <ProductSubCategoryForm
                        onSubmit={handleSubmit}
                        onCancel={() => navigate('/productsubcategory')}
                        isSubmitting={isSubmitting}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductSubCategoryCreatePage;
