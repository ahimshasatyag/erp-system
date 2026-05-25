import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { storeCsrSchema, updateCsrSchema, type StoreCsrValues, type UpdateCsrValues } from '../validation/csrSchema';
import { useNavigate } from 'react-router-dom';

interface CsrFormProps {
    initialData?: any;
    isEditMode?: boolean;
    onSubmit: (data: StoreCsrValues | UpdateCsrValues) => void;
    isSubmitting: boolean;
}

export default function CsrForm({ initialData, isEditMode = false, onSubmit, isSubmitting }: CsrFormProps) {
    const navigate = useNavigate();
    
    const { register, handleSubmit, formState: { errors } } = useForm<StoreCsrValues | UpdateCsrValues>({
        resolver: zodResolver(isEditMode ? updateCsrSchema : storeCsrSchema),
        defaultValues: initialData || {}
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Depending on edit mode, some fields might be hidden/read-only */}
                {isEditMode && (
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">CSR Code</label>
                        <input 
                            type="text" 
                            {...register('csr_code' as any)} 
                            readOnly
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500" 
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700">SN Number (Barcode)</label>
                    <input 
                        type="text" 
                        {...register('sn_number' as any)} 
                        disabled={isEditMode}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                    />
                    {errors.sn_number && <p className="mt-1 text-sm text-red-600">{errors.sn_number.message as string}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Customer ID</label>
                    <input 
                        type="text" 
                        {...register('customers')} 
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                    />
                    {errors.customers && <p className="mt-1 text-sm text-red-600">{errors.customers.message as string}</p>}
                </div>

                {!isEditMode && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">DO Code</label>
                            <input 
                                type="text" 
                                {...register('do_code' as any)} 
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Product ID</label>
                            <input 
                                type="text" 
                                {...register('id_product' as any)} 
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date Request</label>
                            <input 
                                type="date" 
                                {...register('date_request' as any)} 
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tanggal Kirim Mesin</label>
                            <input 
                                type="date" 
                                {...register('tgl_delivered' as any)} 
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                            />
                            {errors.tgl_delivered && <p className="mt-1 text-sm text-red-600">{errors.tgl_delivered.message as string}</p>}
                        </div>
                    </>
                )}

                {isEditMode && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">CSR Date</label>
                        <input 
                            type="date" 
                            {...register('csr_date' as any)} 
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700">Karyawan ID (Requestor)</label>
                    <input 
                        type="text" 
                        {...register('id_karyawan' as any)} 
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                    />
                    {errors.id_karyawan && <p className="mt-1 text-sm text-red-600">{errors.id_karyawan.message as string}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Status Pasang</label>
                    <select 
                        {...register('sts_pasang')} 
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Pilih Status Pasang</option>
                        <option value="SUDAH">SUDAH</option>
                        <option value="BELUM">BELUM</option>
                    </select>
                    {errors.sts_pasang && <p className="mt-1 text-sm text-red-600">{errors.sts_pasang.message as string}</p>}
                </div>

                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Lokasi</label>
                    <input 
                        type="text" 
                        {...register('lokasi')} 
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                    />
                    {errors.lokasi && <p className="mt-1 text-sm text-red-600">{errors.lokasi.message as string}</p>}
                </div>

                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Laporan Kerusakan</label>
                    <textarea 
                        {...register('lap_kerusakan')} 
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                    />
                    {errors.lap_kerusakan && <p className="mt-1 text-sm text-red-600">{errors.lap_kerusakan.message as string}</p>}
                </div>

                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Foto Bukti (Opsional)</label>
                    <input 
                        type="file" 
                        {...register('link_foto')} 
                        accept="image/*"
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                    />
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button 
                    type="button" 
                    onClick={() => navigate('/csr')}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Cancel
                </button>
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Saving...' : 'Save CSR'}
                </button>
            </div>
        </form>
    );
}
