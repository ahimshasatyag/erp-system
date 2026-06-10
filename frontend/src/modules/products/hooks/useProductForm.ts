import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import type { UseFormReturn, UseFieldArrayReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema } from '../validation/productSchema';
import { fetchProduct, createProduct, updateProduct, fetchSubCategories } from '../api/productApi';

export interface ProductFormValues {
    code_product: string;
    nm_product: string;
    id_product_kategori: string;
    id_product_sub_kategori: string;
    id_product_brand: string;
    id_product_satuan: string;
    product_deskripsi: string;
    product_refference?: string | null;
    link_brosur?: any;
    link_foto?: any;
    options?: { value: string }[] | null;
}

export const useProductForm = (productId: string | null = null, isDuplicate: boolean = false) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [subCategories, setSubCategories] = useState<any[]>([]);
    const [fotoPreview, setFotoPreview] = useState<string | null>(null);

    const formReturn: UseFormReturn<ProductFormValues> = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema) as any,
        defaultValues: {
            options: []
        }
    });

    const { register, control, handleSubmit, setValue, watch, reset, formState: { errors } } = formReturn;

    const fieldArrayReturn: UseFieldArrayReturn<ProductFormValues, "options", "id"> = useFieldArray({
        control,
        name: "options" as never
    });

    const { fields: optionFields, append: appendOption, remove: removeOption } = fieldArrayReturn;

    const selectedCategory = watch("id_product_kategori");

    useEffect(() => {
        if (selectedCategory) {
            fetchSubCategories(selectedCategory).then(data => {
                setSubCategories(data);
            }).catch(err => console.error("Failed to load subcategories", err));
        } else {
            setSubCategories([]);
        }
    }, [selectedCategory]);

    useEffect(() => {
        if (productId) {
            setLoading(true);
            fetchProduct(productId).then(response => {
                const product = response.data;
                const formValues: ProductFormValues = {
                    code_product: isDuplicate ? `${product.code_product} (copy)` : product.code_product,
                    nm_product: product.nm_product,
                    id_product_kategori: product.category?.id || '',
                    id_product_sub_kategori: product.sub_category?.id || '',
                    id_product_brand: product.brand?.id || '',
                    id_product_satuan: product.unit?.id || '',
                    product_deskripsi: product.product_deskripsi || '',
                    product_refference: product.product_refference,
                    options: product.options?.map((opt: any) => ({ value: opt.nm_product_opt })) || []
                };
                
                reset(formValues);
                
                if (product.link_foto) {
                    setFotoPreview(product.link_foto);
                }
                
            }).catch(err => {
                console.error("Failed to fetch product", err);
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [productId, isDuplicate, reset]);

    const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue('link_foto', file);
            setFotoPreview(URL.createObjectURL(file));
        }
    };

    const handleBrosurChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue('link_brosur', file);
        }
    };

    const submitForm = async (data: ProductFormValues): Promise<{ success: boolean; data?: any; error?: string }> => {
        setLoading(true);
        try {
            const formData = new FormData();
            
            Object.keys(data).forEach(key => {
                const value = data[key as keyof ProductFormValues];
                if (key === 'options' && Array.isArray(value)) {
                    value.forEach((opt, index) => {
                        if (opt && opt.value) formData.append(`options[${index}]`, opt.value);
                    });
                } else if (value !== null && value !== undefined) {
                    formData.append(key, value as string | Blob);
                }
            });

            let result;
            if (productId && !isDuplicate) {
                result = await updateProduct(productId, formData);
            } else {
                result = await createProduct(formData);
            }
            return { success: true, data: result };
        } catch (error: any) {
            return { success: false, error: error.response?.data?.message || error.message };
        } finally {
            setLoading(false);
        }
    };

    return {
        register,
        handleSubmit,
        errors,
        loading,
        submitForm,
        subCategories,
        fotoPreview,
        handlePhotoChange,
        handleBrosurChange,
        optionFields,
        appendOption,
        removeOption,
        setValue,
        control
    };
};
