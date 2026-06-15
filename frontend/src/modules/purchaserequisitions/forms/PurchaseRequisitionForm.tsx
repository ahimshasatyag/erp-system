import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { purchaseRequisitionSchema } from '../validation/purchaseRequisitionSchema';
import type { PurchaseRequisitionFormData } from '../validation/purchaseRequisitionSchema';
import { getDetailBarang } from '../api/purchaseRequisitionApi';
import api from '../../../services/api';
import SearchablePaginatedSelect from '../../../components/SearchablePaginatedSelect';

interface PurchaseRequisitionFormProps {
    initialData?: any;
    onSubmit: (data: PurchaseRequisitionFormData) => Promise<void>;
    onCancel?: () => void;
    onEdit?: () => void;
    onConfirm?: () => void;
    isSubmitting: boolean;
    isEditMode?: boolean;
    isViewMode?: boolean;
}

const PurchaseRequisitionForm: React.FC<PurchaseRequisitionFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    onEdit,
    onConfirm,
    isSubmitting,
    isEditMode = false,
    isViewMode = false
}) => {
    const navigate = useNavigate();
    const [usersList, setUsersList] = useState<any[]>([]);
    const [productsList, setProductsList] = useState<any[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(false);

    const { register, control, handleSubmit, formState: { errors }, reset, setValue, getValues, watch } = useForm<PurchaseRequisitionFormData>({
        resolver: zodResolver(purchaseRequisitionSchema),
        defaultValues: {
            username: '',
            date_request: new Date().toISOString().split('T')[0],
            date_deadline: new Date().toISOString().split('T')[0],
            details: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "details"
    });

    // Load initial data
    useEffect(() => {
        if (initialData) {
            reset({
                username: initialData.username || '',
                date_request: initialData.date_request ? initialData.date_request.split('T')[0] : '',
                date_deadline: initialData.date_deadline ? initialData.date_deadline.split('T')[0] : '',
                details: initialData.details?.map((d: any) => ({
                    id_product: String(d.id_product),
                    qty: d.qty,
                    note: d.note || '',
                    nm_product: d.nm_product,
                    code_product: d.code_product,
                    nm_product_satuan: d.nm_product_satuan
                })) || []
            });
        }
    }, [initialData, reset]);

    // Load Options
    useEffect(() => {
        const loadOptions = async () => {
            setLoadingUsers(true);
            setLoadingProducts(true);
            try {
                // If the user has a specific endpoint for users and products, use it.
                // Otherwise try generic ones.
                const [usersRes, productsRes] = await Promise.all([
                    api.get('/users', { params: { length: 10000 } }).catch(() => ({ data: [] })), // Fetch all users
                    api.get('/products', { params: { length: 10000 } }).catch(() => ({ data: [] })) // Fetch all products
                ]);
                
                // For users, it could be inside data.data or just data
                const users = Array.isArray(usersRes.data) ? usersRes.data : (usersRes.data?.data || []);
                setUsersList(users);

                const products = Array.isArray(productsRes.data) ? productsRes.data : (productsRes.data?.data || []);
                setProductsList(products);
            } catch (err) {
                console.error("Gagal load options", err);
            } finally {
                setLoadingUsers(false);
                setLoadingProducts(false);
            }
        };

        // If the backend `show` endpoint provided data_product and data_users alongside initialData, we can use those.
        // Wait, if initialData has them, let's use them directly from some prop. 
        // For simplicity, we just fetch from API here.
        loadOptions();
    }, []);

    const handleProductChange = async (index: number, productId: string) => {
        setValue(`details.${index}.id_product`, productId);
        try {
            if (productId) {
                const response = await getDetailBarang(productId);
                if (response?.data && response.data.length > 0) {
                    const detail = response.data[0];
                    // We can store additional info in the form state if needed, or simply let the UI read it.
                    // React-hook-form doesn't strictly prevent extra fields, but for TS typing, it's safe.
                    // We can just rely on the UI to show these. We'll set them dynamically.
                    setValue(`details.${index}.qty`, 1);
                    setValue(`details.${index}.nm_product`, detail.nm_product);
                    setValue(`details.${index}.nm_product_satuan`, detail.nm_product_satuan);
                }
            }
        } catch (error) {
            console.error("Failed to fetch product detail", error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Top Actions */}
            <div className="flex items-center gap-2 mb-4 pb-2">
                {!isViewMode && (
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-4 py-2 bg-[#22c55e] text-white text-[13px] font-medium rounded hover:bg-[#16a34a] transition-colors disabled:opacity-50"
                    >
                        <i className="fas fa-save"></i> {isSubmitting ? 'Menyimpan...' : 'Save'}
                    </button>
                )}

                {isViewMode ? (
                    <>
                        {initialData?.status_pr === 'DRAFT' && (
                            <>
                                <button
                                    type="button"
                                    onClick={onEdit}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#0ea5e9] text-white text-[13px] font-medium rounded hover:bg-[#0284c7] transition-colors"
                                >
                                    <i className="fas fa-edit"></i> Edit
                                </button>
                                <button
                                    type="button"
                                    onClick={onConfirm}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#22c55e] text-white text-[13px] font-medium rounded hover:bg-[#16a34a] transition-colors"
                                >
                                    <i className="fas fa-check"></i> Confirm
                                </button>
                            </>
                        )}
                        <button
                            type="button"
                            onClick={onCancel || (() => navigate('/purchaserequisitions'))}
                            className="flex items-center gap-2 px-4 py-2 bg-[#f59e0b] text-white text-[13px] font-medium rounded hover:bg-[#d97706] transition-colors"
                        >
                            <i className="fas fa-undo"></i> Kembali
                        </button>
                    </>
                ) : (
                    <button
                        type="button"
                        onClick={onCancel || (() => navigate('/purchaserequisitions'))}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-4 py-2 bg-[#f59e0b] text-white text-[13px] font-medium rounded hover:bg-[#d97706] transition-colors disabled:opacity-50"
                    >
                        <i className="fas fa-undo"></i> Discard
                    </button>
                )}
            </div>

            <div className="bg-[#f8f9fa] border border-gray-200 p-3 mb-4 rounded-sm">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-2">
                    {/* Left Column */}
                    <div className="space-y-2">
                        <div className="flex border border-gray-200 rounded-sm">
                            <div className="w-[35%] bg-gray-50 p-2 flex items-center justify-between text-[13px] font-bold text-gray-600 border-r border-gray-200">
                                <span>Responsible</span><span>:</span>
                            </div>
                            <div className="w-[65%] p-1.5">
                                <Controller
                                    control={control}
                                    name="username"
                                    render={({ field }) => (
                                        <SearchablePaginatedSelect
                                            value={field.value}
                                            onChange={field.onChange}
                                            options={usersList.map(u => ({
                                                value: u.username || String(u.id),
                                                label: u.nm_users || u.name || u.username || 'Unknown User'
                                            }))}
                                            placeholder="Select Responsible"
                                            disabled={isSubmitting || isViewMode || loadingUsers}
                                            error={errors.username?.message}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-2">
                        <div className="flex border border-gray-200 rounded-sm">
                            <div className="w-[35%] bg-gray-50 p-2 flex items-center justify-between text-[13px] font-bold text-gray-600 border-r border-gray-200">
                                <span>Requisition Date</span><span>:</span>
                            </div>
                            <div className="w-[65%] p-1.5">
                                <input
                                    type="date"
                                    {...register('date_request')}
                                    className={`w-full px-2 py-1 text-[13px] border rounded outline-none ${errors.date_request ? 'border-red-500' : 'border-gray-300'}`}
                                    disabled={isSubmitting || isViewMode}
                                />
                            </div>
                        </div>

                        <div className="flex border border-gray-200 rounded-sm">
                            <div className="w-[35%] bg-gray-50 p-2 flex items-center justify-between text-[13px] font-bold text-gray-600 border-r border-gray-200">
                                <span>Requisition Deadline</span><span>:</span>
                            </div>
                            <div className="w-[65%] p-1.5">
                                <input
                                    type="date"
                                    {...register('date_deadline')}
                                    className={`w-full px-2 py-1 text-[13px] border rounded outline-none ${errors.date_deadline ? 'border-red-500' : 'border-gray-300'}`}
                                    disabled={isSubmitting || isViewMode}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons Top */}
            <div className="flex items-center gap-2 pt-2 pb-4">
                {!isViewMode && (
                    <button
                        type="button"
                        onClick={() => append({ id_product: '', qty: 1, note: '', nm_product: '', nm_product_satuan: '' })}
                        className="flex items-center gap-2 px-4 py-2 bg-[#0ea5e9] text-white text-[13px] font-medium rounded hover:bg-[#0284c7] transition-colors"
                    >
                        Tambah Barang
                    </button>
                )}
            </div>

            {errors.details && <p className="text-red-500 text-sm">{errors.details.message}</p>}

            {/* Details Table */}
            <div className="mt-2 border border-gray-200 rounded pb-40">
                <div className="overflow-visible">
                    <table className="min-w-full divide-y divide-gray-200 text-[13px]">
                        <thead className="bg-[#f9f9f9] border-b border-gray-200">
                            <tr>
                                <th className="px-3 py-2 text-center font-bold text-gray-700 w-12 border-r border-gray-200">No</th>
                                <th className="px-3 py-2 text-center font-bold text-gray-700 border-r border-gray-200 min-w-[250px]">Kode Barang</th>
                                <th className="px-3 py-2 text-center font-bold text-gray-700 border-r border-gray-200 min-w-[250px]">Nama Barang</th>
                                <th className="px-3 py-2 text-center font-bold text-gray-700 border-r border-gray-200 w-[100px]">Satuan</th>
                                <th className="px-3 py-2 text-center font-bold text-gray-700 border-r border-gray-200 w-[100px]">Qty</th>
                                <th className="px-3 py-2 text-center font-bold text-gray-700 border-r border-gray-200 w-[250px]">Notes</th>
                                {!isViewMode && <th className="px-3 py-2 text-center font-bold text-gray-700 w-20">Aksi</th>}
                            </tr>
                        </thead>
                        <tbody className="bg-[#fcfcfc] divide-y divide-gray-200">
                            {fields.length === 0 ? (
                                <tr>
                                    <td colSpan={isViewMode ? 6 : 7} className="px-3 py-4 text-center text-gray-500 bg-[#f9f9f9]">
                                        Tidak ada barang ditambahkan
                                    </td>
                                </tr>
                            ) : (
                                fields.map((field, index) => (
                                    <tr key={field.id} className="hover:bg-gray-50">
                                        <td className="px-2 py-2 text-center border-r border-gray-200">{index + 1}</td>
                                        <td className="px-2 py-2 border-r border-gray-200">
                                            <Controller
                                                control={control}
                                                name={`details.${index}.id_product`}
                                                render={({ field: selectField }) => (
                                                    <SearchablePaginatedSelect
                                                        value={selectField.value}
                                                        onChange={(val) => {
                                                            selectField.onChange(val);
                                                            handleProductChange(index, val);
                                                        }}
                                                        options={productsList.map(p => ({
                                                            value: String(p.id_product),
                                                            label: p.code_product
                                                        }))}
                                                        placeholder="Pilih Barang"
                                                        disabled={isSubmitting || isViewMode || loadingProducts}
                                                        error={errors.details?.[index]?.id_product?.message}
                                                    />
                                                )}
                                            />
                                        </td>
                                        <td className="px-2 py-2 border-r border-gray-200 align-top">
                                            <textarea
                                                {...register(`details.${index}.nm_product` as const)}
                                                className="w-full px-2 py-1 text-[13px] bg-transparent outline-none resize-none"
                                                disabled
                                                rows={2}
                                            />
                                        </td>
                                        <td className="px-2 py-2 border-r border-gray-200">
                                            <input
                                                type="text"
                                                {...register(`details.${index}.nm_product_satuan` as const)}
                                                className="w-full px-2 py-1 text-[13px] bg-transparent outline-none text-center"
                                                disabled
                                            />
                                        </td>
                                        <td className="px-2 py-2 border-r border-gray-200">
                                            <input
                                                type="number"
                                                {...register(`details.${index}.qty` as const)}
                                                className={`w-full px-2 py-1 text-[13px] border rounded outline-none disabled:bg-transparent disabled:border-transparent ${errors.details?.[index]?.qty ? 'border-red-500' : 'border-gray-300'}`}
                                                disabled={isSubmitting || isViewMode}
                                                min="1"
                                            />
                                        </td>
                                        <td className="px-2 py-2 border-r border-gray-200">
                                            <input
                                                type="text"
                                                {...register(`details.${index}.note` as const)}
                                                className="w-full px-2 py-1 text-[13px] border border-gray-300 rounded outline-none disabled:bg-transparent disabled:border-transparent"
                                                disabled={isSubmitting || isViewMode}
                                            />
                                        </td>
                                        {!isViewMode && (
                                            <td className="px-2 py-2 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => remove(index)}
                                                    className="text-red-500 hover:bg-red-50 px-2 py-1 rounded"
                                                    title="Hapus baris"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </form>
    );
};

export default PurchaseRequisitionForm;
