import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { productUnitSchema } from '../validation/productUnitSchema';
import type { ProductUnitFormData } from '../validation/productUnitSchema';
import type { ProductUnit } from '../api/productUnitApi';

interface ProductUnitFormProps {
    initialData?: ProductUnit;
    onSubmit: (data: ProductUnitFormData) => Promise<void>;
    onCancel?: () => void;
    onEdit?: () => void;
    isSubmitting: boolean;
    isEdit?: boolean;
    isEditMode?: boolean;
    isViewMode?: boolean;
}

const ProductUnitForm: React.FC<ProductUnitFormProps> = ({ 
    initialData, 
    onSubmit, 
    onCancel,
    onEdit,
    isSubmitting, 
    isEdit = false,
    isEditMode = false,
    isViewMode = false
}) => {
    const navigate = useNavigate();
    
    const { register, handleSubmit, formState: { errors }, reset } = useForm<ProductUnitFormData>({
        resolver: zodResolver(productUnitSchema),
        defaultValues: {
            nm_product_satuan: '',
            id_product_satuan: '',
        }
    });

    useEffect(() => {
        if (initialData) {
            reset({
                nm_product_satuan: initialData.nm_product_satuan,
                id_product_satuan: initialData.id_product_satuan,
            });
        }
    }, [initialData, reset]);

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
                            onClick={onCancel || (() => navigate('/productunit'))}
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
                            {isSubmitting ? 'Menyimpan...' : (isEdit || isEditMode ? 'Update' : 'Simpan')}
                        </button>
                        <button
                            type="button"
                            onClick={onCancel || (() => navigate('/productunit'))}
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
                <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-1">
                        Unit Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        {...register('nm_product_satuan')}
                        className={`w-full px-3 py-2 text-[13px] border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed ${
                            errors.nm_product_satuan ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Masukkan nama satuan"
                        disabled={isSubmitting || isViewMode}
                    />
                    {errors.nm_product_satuan && (
                        <p className="mt-1 text-xs text-red-500">{errors.nm_product_satuan.message}</p>
                    )}
                </div>
            </div>
        </form>
    );
};

export default ProductUnitForm;
