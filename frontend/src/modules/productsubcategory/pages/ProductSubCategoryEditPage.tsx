import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import ProductSubCategoryForm from '../forms/ProductSubCategoryForm';
import { fetchProductSubCategory, updateProductSubCategory } from '../api/productSubCategoryApi';
import type { ProductSubCategoryFormData } from '../validation/productSubCategorySchema';

const ProductSubCategoryEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [initialData, setInitialData] = useState<ProductSubCategoryFormData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isViewMode = searchParams.get('mode') !== 'edit';

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            try {
                const response = await fetchProductSubCategory(id);
                setInitialData({
                    id_product_kategori: response.data.id_product_kategori,
                    nm_product_sub_kategori: response.data.nm_product_sub_kategori,
                });
            } catch (err: any) {
                setError(err.message || 'Failed to load sub category data');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [id]);

    const handleSubmit = async (data: ProductSubCategoryFormData) => {
        if (!id) return;
        setIsSubmitting(true);
        setError(null);
        try {
            await updateProductSubCategory(id, data);
            navigate('/productsubcategory');
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to update sub category');
            setIsSubmitting(false);
        }
    };

    const handleEditToggle = () => {
        setSearchParams({ mode: 'edit' }, { state: location.state });
    };

    const handleCancel = () => {
        if (isViewMode) {
            navigate('/productsubcategory');
        } else {
            setSearchParams({ mode: 'view' }, { state: location.state });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3b82f6]"></div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen py-2 px-6">
            <div className="flex justify-between items-center mb-6 pt-2">
                <p className="text-[32px] font-normal text-[#3f2a2a] tracking-tight">
                    {isViewMode ? 'Detail Subcategory' : 'Edit Subcategory'}
                </p>
                <div className="text-[13px] text-gray-500 font-medium">EMM Service / Subcategory </div>
            </div>

            <div className="bg-white rounded shadow-sm border border-gray-200">
                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded text-[13px]">
                            {error}
                        </div>
                    )}

                    {initialData && (
                        <ProductSubCategoryForm
                            initialData={initialData}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            onEdit={handleEditToggle}
                            isSubmitting={isSubmitting}
                            isEditMode={true}
                            isViewMode={isViewMode}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductSubCategoryEditPage;
