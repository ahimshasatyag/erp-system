import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSubCategorySchema, type ProductSubCategoryFormData } from '../validation/productSubCategorySchema';
import { fetchCategoriesOptions } from '../api/productSubCategoryApi';
import SearchablePaginatedSelect from '../../../components/SearchablePaginatedSelect';

interface ProductSubCategoryFormProps {
    initialData?: ProductSubCategoryFormData;
    onSubmit: (data: ProductSubCategoryFormData) => void;
    onCancel: () => void;
    onEdit?: () => void;
    isSubmitting?: boolean;
    isEditMode?: boolean;
    isViewMode?: boolean;
}

const ProductSubCategoryForm: React.FC<ProductSubCategoryFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    onEdit,
    isSubmitting = false,
    isEditMode = false,
    isViewMode = false,
}) => {
    const [categories, setCategories] = useState<{ value: string; label: string; subLabel: string }[]>([]);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<ProductSubCategoryFormData>({
        resolver: zodResolver(productSubCategorySchema),
        defaultValues: initialData || { id_product_kategori: '', nm_product_sub_kategori: '' },
    });

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await fetchCategoriesOptions();
                const options = response.data.map((cat: any) => ({
                    value: String(cat.id_product_kategori),
                    label: cat.nm_product_kategori,
                    subLabel: cat.kode_product_kategori,
                }));
                setCategories(options);
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };
        loadCategories();
    }, []);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-4">
                {isViewMode ? (
                    <>
                        <button
                            type="button"
                            onClick={onEdit}
                            className="flex items-center gap-2 px-4 py-2 bg-[#0ea5e9] text-white text-[13px] font-medium rounded hover:bg-[#0284c7] transition-colors"
                        >
                            <i className="fas fa-edit"></i>
                            Edit
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex items-center gap-2 px-4 py-2 bg-[#f59e0b] text-white text-[13px] font-medium rounded hover:bg-[#d97706] transition-colors"
                        >
                            <i className="fas fa-undo"></i>
                            Kembali
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-4 py-2 bg-[#22c55e] text-white text-[13px] font-medium rounded hover:bg-[#16a34a] transition-colors disabled:opacity-50"
                        >
                            <i className="fas fa-save"></i>
                            {isEditMode ? 'Update' : 'Simpan'}
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-4 py-2 bg-[#f59e0b] text-white text-[13px] font-medium rounded hover:bg-[#d97706] transition-colors disabled:opacity-50"
                        >
                            <i className="fas fa-undo"></i>
                            Kembali
                        </button>
                    </>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Category Dropdown */}
                <div className="space-y-1">
                    <label className="block text-[13px] font-medium text-gray-700">
                        Category <span className="text-red-500">*</span>
                    </label>
                    <Controller
                        name="id_product_kategori"
                        control={control}
                        render={({ field }) => (
                            <SearchablePaginatedSelect
                                value={field.value || ''}
                                onChange={(val) => field.onChange(String(val))}
                                options={categories}
                                disabled={isSubmitting || isViewMode} // Disabled in view mode
                                placeholder="----- Select Category -----"
                                error={errors.id_product_kategori?.message}
                            />
                        )}
                    />
                </div>

                {/* Sub Category Name */}
                <div className="space-y-1">
                    <label className="block text-[13px] font-medium text-gray-700">
                        Sub Category Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        {...register('nm_product_sub_kategori')}
                        disabled={isSubmitting || isViewMode}
                        className={`w-full px-3 py-2 text-[13px] border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed ${
                            errors.nm_product_sub_kategori ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter sub category name"
                    />
                    {errors.nm_product_sub_kategori && (
                        <p className="text-red-500 text-xs mt-1">{errors.nm_product_sub_kategori.message}</p>
                    )}
                </div>

            </div>
        </form>
    );
};

export default ProductSubCategoryForm;
