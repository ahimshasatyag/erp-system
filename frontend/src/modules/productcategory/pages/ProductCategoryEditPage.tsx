import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCategoryForm from '../forms/ProductCategoryForm';
import { fetchProductCategory, updateProductCategory } from '../api/productCategoryApi';
import type { ProductCategory } from '../api/productCategoryApi';
import type { ProductCategoryFormData } from '../validation/productCategorySchema';
import { showAlert } from '../../../components/SweetAlert';

const ProductCategoryEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [initialData, setInitialData] = useState<ProductCategory | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            try {
                const response = await fetchProductCategory(id);
                setInitialData(response.data);
            } catch (error: any) {
                showAlert.error('Error', 'Data Product Category tidak ditemukan');
                navigate('/productcategory');
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [id, navigate]);

    const handleSubmit = async (data: ProductCategoryFormData) => {
        if (!id) return;
        setIsSubmitting(true);
        try {
            // Need to pass id_product_kategori as part of data as requested by validation
            const payload = {
                ...data,
                id_product_kategori: id
            };
            const response = await updateProductCategory(id, payload);
            if (response.success) {
                showAlert.success('Berhasil', 'Product Category berhasil diupdate');
                navigate('/productcategory');
            } else {
                showAlert.error('Gagal', response.message || 'Gagal mengupdate Product Category');
            }
        } catch (error: any) {
            showAlert.error('Error', error.response?.data?.message || 'Terjadi kesalahan pada server');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#20c997]"></div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen py-2 px-6">
            <div className="flex justify-between items-center mb-6 pt-2">
                <p className="text-[32px] font-normal text-[#3f2a2a] tracking-tight">Edit Product Category</p>
                <div className="text-[13px] text-gray-500 font-medium">EMM Service / Product Category / Edit</div>
            </div>

            <div className="bg-white rounded shadow-sm border border-gray-200">
                <div className="p-6">
                    <ProductCategoryForm 
                        initialData={initialData} 
                        onSubmit={handleSubmit} 
                        isSubmitting={isSubmitting} 
                        isEdit={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductCategoryEditPage;
