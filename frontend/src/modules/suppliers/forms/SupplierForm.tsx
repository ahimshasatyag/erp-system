import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supplierSchema } from '../validation/supplierSchema';
import type { SupplierFormValues } from '../validation/supplierSchema';
import type { Supplier } from '../api/types';

interface SupplierFormProps {
    initialData?: Supplier;
    onSubmit: (data: SupplierFormValues) => void;
    isLoading?: boolean;
    isEditMode?: boolean;
    onCancel?: () => void;
    onEdit?: () => void;
    onBack?: () => void;
}

const SupplierForm: React.FC<SupplierFormProps> = ({
    initialData,
    onSubmit,
    isLoading = false,
    isEditMode = true,
    onCancel,
    onEdit,
    onBack
}) => {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<SupplierFormValues>({
        resolver: zodResolver(supplierSchema),
        defaultValues: {
            nm_suppliers: initialData?.nm_suppliers || '',
            suppliers_mobile: initialData?.suppliers_mobile || '',
            suppliers_email: initialData?.suppliers_email || '',
            suppliers_address: initialData?.suppliers_address || '',
            suppliers_phone: initialData?.suppliers_phone || '',
            suppliers_fax: initialData?.suppliers_fax || '',
            suppliers_website: initialData?.suppliers_website || '',
            id_mata_uang: initialData?.id_mata_uang || '',
            contacts: initialData?.contacts || [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'contacts',
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex justify-start items-center pb-2">
                <div className="flex gap-2">
                    {isEditMode ? (
                        <>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex items-center gap-2 px-4 py-2 bg-[#22c55e] text-white text-[13px] font-medium rounded hover:bg-[#16a34a] transition-colors disabled:opacity-50"
                            >
                                <i className="fas fa-save"></i>
                                {isLoading ? 'Menyimpan...' : 'Save'}
                            </button>
                            {onCancel && (
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#f59e0b] text-white text-[13px] font-medium rounded hover:bg-[#d97706] transition-colors"
                                >
                                    <i className="fas fa-undo"></i>
                                    Discard
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            {onEdit && (
                                <button
                                    type="button"
                                    onClick={onEdit}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#0ea5e9] text-white text-[13px] font-medium rounded hover:bg-[#0284c7] transition-colors"
                                >
                                    <i className="fas fa-edit"></i>
                                    Edit
                                </button>
                            )}
                            {onBack && (
                                <button
                                    type="button"
                                    onClick={onBack}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#f59e0b] text-white text-[13px] font-medium rounded hover:bg-[#d97706] transition-colors"
                                >
                                    <i className="fas fa-undo"></i>
                                    Kembali
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className="bg-[#f8f9fa] border border-gray-200 p-3 mb-4 rounded-sm">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Logo */}
                    <div className="col-span-1 lg:col-span-2 flex flex-col items-center">
                        <div className="w-full aspect-square border border-gray-200 dark:border-gray-700 flex items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-400 p-2 rounded">
                            {initialData?.suppliers_logo ? (
                                <img src={initialData.suppliers_logo} alt={initialData.nm_suppliers} className="w-full h-full object-contain" />
                            ) : (
                                <svg className="w-16 h-16 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                    <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2"></line>
                                </svg>
                            )}
                        </div>
                        {isEditMode && (
                            <div className="mt-2 w-full">
                                <input
                                    type="file"
                                    {...register('file')}
                                    className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#20c997] file:text-white hover:file:bg-[#1ba87e]"
                                />
                            </div>
                        )}
                    </div>

                    {/* Main Details */}
                    <div className="col-span-1 lg:col-span-5 space-y-4">
                        <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1">Supplier Name</label>
                            <input
                                type="text"
                                placeholder="Masukkan nama supplier"
                                disabled={!isEditMode}
                                {...register('nm_suppliers')}
                                className={`w-full px-3 py-1.5 text-[13px] border rounded focus:outline-none focus:ring-2 focus:ring-[#20c997] dark:bg-gray-800 dark:text-white ${errors.nm_suppliers ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:text-gray-500`}
                            />
                            {errors.nm_suppliers && <span className="text-red-500 text-xs mt-1 block">{errors.nm_suppliers.message}</span>}
                        </div>
                        <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                            <textarea
                                rows={4}
                                placeholder="Masukkan alamat lengkap supplier"
                                disabled={!isEditMode}
                                {...register('suppliers_address')}
                                className={`w-full px-3 py-1.5 text-[13px] border rounded focus:outline-none focus:ring-2 focus:ring-[#20c997] dark:bg-gray-800 dark:text-white ${errors.suppliers_address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:text-gray-500`}
                            />
                            {errors.suppliers_address && <span className="text-red-500 text-xs mt-1 block">{errors.suppliers_address.message}</span>}
                        </div>
                        <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1">Mata Uang (Currency)</label>
                            <input
                                type="text"
                                placeholder="Masukkan ID Mata Uang (contoh: IDR)"
                                disabled={!isEditMode}
                                {...register('id_mata_uang')}
                                className="w-full px-3 py-1.5 text-[13px] border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#20c997] dark:border-gray-600 dark:bg-gray-800 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:text-gray-500"
                            />
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="col-span-1 lg:col-span-5 space-y-4">
                        <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile</label>
                            <input
                                type="text"
                                placeholder="Masukkan nomor handphone"
                                disabled={!isEditMode}
                                {...register('suppliers_mobile')}
                                className="w-full px-3 py-1.5 text-[13px] border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#20c997] dark:border-gray-600 dark:bg-gray-800 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:text-gray-500"
                            />
                        </div>
                        <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                            <input
                                type="text"
                                placeholder="Masukkan nomor telepon"
                                disabled={!isEditMode}
                                {...register('suppliers_phone')}
                                className="w-full px-3 py-1.5 text-[13px] border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#20c997] dark:border-gray-600 dark:bg-gray-800 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:text-gray-500"
                            />
                            {errors.suppliers_phone && <span className="text-red-500 text-xs mt-1 block">{errors.suppliers_phone.message}</span>}
                        </div>
                        <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1">Fax</label>
                            <input
                                type="text"
                                placeholder="Masukkan nomor fax"
                                disabled={!isEditMode}
                                {...register('suppliers_fax')}
                                className="w-full px-3 py-1.5 text-[13px] border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#20c997] dark:border-gray-600 dark:bg-gray-800 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:text-gray-500"
                            />
                        </div>
                        <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                            <input
                                type="email"
                                placeholder="Masukkan alamat email"
                                disabled={!isEditMode}
                                {...register('suppliers_email')}
                                className="w-full px-3 py-1.5 text-[13px] border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#20c997] dark:border-gray-600 dark:bg-gray-800 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:text-gray-500"
                            />
                        </div>
                        <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1">Website</label>
                            <input
                                type="text"
                                placeholder="Masukkan alamat website"
                                disabled={!isEditMode}
                                {...register('suppliers_website')}
                                className="w-full px-3 py-1.5 text-[13px] border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#20c997] dark:border-gray-600 dark:bg-gray-800 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:text-gray-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Contacts Table */}
            <div className="mt-2 border border-gray-200 rounded p-4 pb-10">
                <div className="flex justify-between items-center mb-4">
                    {isEditMode && (
                        <button
                            type="button"
                            onClick={() => append({ nm_suppliers_contact: '', suppliers_contact_posisi: '', suppliers_contact_phone: '', suppliers_contact_email: '' })}
                            className="flex items-center gap-2 px-3 py-1.5 bg-[#20c997] text-white text-[13px] font-medium rounded hover:bg-[#1ba87e] transition-colors"
                        >
                            <span className="font-bold text-base leading-none">+</span> Tambah Kontak
                        </button>
                    )}
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border border-gray-200 dark:border-gray-700">
                        <thead className="text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 w-16 text-center">No</th>
                                <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">Contact Name</th>
                                <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">Position</th>
                                <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">Phone</th>
                                <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">Email</th>
                                {isEditMode && <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 w-16 text-center">Aksi</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {fields.length === 0 ? (
                                <tr>
                                    <td colSpan={isEditMode ? 6 : 5} className="px-4 py-4 text-center text-gray-500 bg-gray-50 dark:bg-gray-900">
                                        No data available in table
                                    </td>
                                </tr>
                            ) : (
                                fields.map((field, index) => (
                                    <tr key={field.id} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                                        <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">{index + 1}</td>
                                        <td className="px-4 py-2">
                                            <input
                                                disabled={!isEditMode}
                                                placeholder="Nama kontak"
                                                {...register(`contacts.${index}.nm_suppliers_contact` as const)}
                                                className={`w-full px-2 py-1 text-[13px] border rounded focus:outline-none focus:ring-1 focus:ring-[#20c997] dark:bg-gray-800 dark:text-white ${errors.contacts?.[index]?.nm_suppliers_contact ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} disabled:bg-transparent dark:disabled:bg-transparent disabled:border-transparent disabled:px-0`}
                                            />
                                            {errors.contacts?.[index]?.nm_suppliers_contact && (
                                                <span className="text-red-500 text-[11px] block mt-0.5">{errors.contacts[index]?.nm_suppliers_contact?.message}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                disabled={!isEditMode}
                                                placeholder="Posisi / Jabatan"
                                                {...register(`contacts.${index}.suppliers_contact_posisi` as const)}
                                                className="w-full px-2 py-1 text-[13px] border rounded border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#20c997] dark:border-gray-600 dark:bg-gray-800 dark:text-white disabled:bg-transparent dark:disabled:bg-transparent disabled:border-transparent disabled:px-0"
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                disabled={!isEditMode}
                                                placeholder="No. Telepon"
                                                {...register(`contacts.${index}.suppliers_contact_phone` as const)}
                                                className="w-full px-2 py-1 text-[13px] border rounded border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#20c997] dark:border-gray-600 dark:bg-gray-800 dark:text-white disabled:bg-transparent dark:disabled:bg-transparent disabled:border-transparent disabled:px-0"
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="email"
                                                disabled={!isEditMode}
                                                placeholder="Email kontak"
                                                {...register(`contacts.${index}.suppliers_contact_email` as const)}
                                                className="w-full px-2 py-1 text-[13px] border rounded border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#20c997] dark:border-gray-600 dark:bg-gray-800 dark:text-white disabled:bg-transparent dark:disabled:bg-transparent disabled:border-transparent disabled:px-0"
                                            />
                                        </td>
                                        {isEditMode && (
                                            <td className="px-4 py-2 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => remove(index)}
                                                    className="p-1.5 bg-red-50 text-red-500 rounded hover:bg-red-100 transition-colors"
                                                    title="Hapus"
                                                >
                                                    <i className="fas fa-trash-alt"></i>
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

export default SupplierForm;
