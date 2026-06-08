import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { productCategorySchema } from '../validation/productCategorySchema';
import type { ProductCategoryFormData } from '../validation/productCategorySchema';
import type { ProductCategory } from '../api/productCategoryApi';

interface ProductCategoryFormProps {
    initialData?: ProductCategory;
    onSubmit: (data: ProductCategoryFormData) => Promise<void>;
    isSubmitting: boolean;
    isEdit?: boolean;
}

const ProductCategoryForm: React.FC<ProductCategoryFormProps> = ({ initialData, onSubmit, isSubmitting, isEdit = false }) => {
    const navigate = useNavigate();
    
    const { register, handleSubmit, formState: { errors }, reset } = useForm<ProductCategoryFormData>({
        resolver: zodResolver(productCategorySchema),
        defaultValues: {
            nm_product_kategori: '',
            id_product_kategori: '',
            kode_product_kategori: '',
        }
    });

    useEffect(() => {
        if (initialData) {
            reset({
                nm_product_kategori: initialData.nm_product_kategori,
                id_product_kategori: initialData.id_product_kategori,
                kode_product_kategori: initialData.kode_product_kategori,
            });
        }
    }, [initialData, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        {...register('nm_product_kategori')}
                        className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                            errors.nm_product_kategori ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        }`}
                        placeholder="Masukkan nama kategori"
                        disabled={isSubmitting}
                    />
                    {errors.nm_product_kategori && (
                        <p className="mt-1 text-xs text-red-500">{errors.nm_product_kategori.message}</p>
                    )}
                </div>
            </div>

            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#20c997] hover:bg-[#1ba87e] text-white px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50"
                >
                    {isSubmitting ? 'Menyimpan...' : (isEdit ? 'Update' : 'Simpan')}
                </button>
                <button
                    type="button"
                    onClick={() => navigate('/productcategory')}
                    disabled={isSubmitting}
                    className="bg-[#17a2b8] hover:bg-[#138496] text-white px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50"
                >
                    Kembali
                </button>
            </div>
        </form>
    );
};

export default ProductCategoryForm;
