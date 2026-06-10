import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { customerSchema } from '../validation/customerSchema';
import type { CustomerFormData } from '../validation/customerSchema';
import type { Customer, Provinsi, Kabupaten } from '../api/customerApi';
import { fetchProvinsi, fetchKabupaten } from '../api/customerApi';
import SearchablePaginatedSelect from '../../../components/SearchablePaginatedSelect';

interface CustomerFormProps {
    initialData?: Customer;
    onSubmit: (data: CustomerFormData) => Promise<void>;
    onCancel?: () => void;
    onEdit?: () => void;
    isSubmitting: boolean;
    isEditMode?: boolean;
    isViewMode?: boolean;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ 
    initialData, 
    onSubmit, 
    onCancel,
    onEdit,
    isSubmitting, 
    isEditMode = false,
    isViewMode = false
}) => {
    const navigate = useNavigate();
    const [provinsiList, setProvinsiList] = useState<Provinsi[]>([]);
    const [kabupatenList, setKabupatenList] = useState<Kabupaten[]>([]);
    const [loadingProvinsi, setLoadingProvinsi] = useState(false);
    const [loadingKabupaten, setLoadingKabupaten] = useState(false);
    
    const { register, control, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<CustomerFormData>({
        resolver: zodResolver(customerSchema),
        defaultValues: {
            nm_customers: '',
            customers_address: '',
            customers_address_invoice: '',
            customers_phone: '',
            customers_mobile: '',
            customers_email: '',
            customers_fax: '',
            provinsi: '',
            kabupaten: '',
            f_company: false,
            nama_lengkap: '',
            nik: '',
            nib: '',
            npwp: '',
            alamat: '',
            is_blacklist: false,
            is_external_sales: false,
            contacts: [],
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "contacts"
    });

    const watchProvinsi = watch("provinsi");
    const watchFCompany = watch("f_company");

    // Load initial data
    useEffect(() => {
        if (initialData) {
            reset({
                ...initialData,
                contacts: initialData.contacts || []
            });
        }
    }, [initialData, reset]);

    // Load Provinsi
    useEffect(() => {
        const loadProv = async () => {
            setLoadingProvinsi(true);
            try {
                const data = await fetchProvinsi();
                setProvinsiList(data);
            } catch (err) {
                console.error("Gagal load provinsi", err);
            } finally {
                setLoadingProvinsi(false);
            }
        };
        loadProv();
    }, []);

    // Load Kabupaten when Provinsi changes
    useEffect(() => {
        const loadKab = async () => {
            if (!watchProvinsi) {
                setKabupatenList([]);
                return;
            }
            setLoadingKabupaten(true);
            try {
                const data = await fetchKabupaten(watchProvinsi);
                setKabupatenList(data);
            } catch (err) {
                console.error("Gagal load kabupaten", err);
            } finally {
                setLoadingKabupaten(false);
            }
        };
        loadKab();
    }, [watchProvinsi]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-0">
                {/* Left Column */}
                <div className="space-y-2">
                    <div className="flex border border-gray-200 rounded-sm">
                        <div className="w-[30%] bg-gray-50 p-2 flex items-center justify-between text-[13px] font-bold text-gray-600 border-r border-gray-200">
                            <span>Company Name</span><span>:</span>
                        </div>
                        <div className="w-[70%] p-1.5">
                            <input
                                type="text"
                                placeholder="Enter company name"
                                {...register('nm_customers')}
                                className={`w-full px-2 py-1 text-[13px] border rounded outline-none ${errors.nm_customers ? 'border-red-500' : 'border-gray-300'}`}
                                disabled={isSubmitting || isViewMode}
                            />
                        </div>
                    </div>

                    <div className="flex border border-gray-200 rounded-sm">
                        <div className="w-[30%] bg-gray-50 p-2 flex items-start justify-between text-[13px] font-bold text-gray-600 border-r border-gray-200">
                            <span>Address</span><span>:</span>
                        </div>
                        <div className="w-[70%] p-1.5">
                            <textarea
                                rows={3}
                                {...register('customers_address')}
                                className={`w-full px-2 py-1 text-[13px] border rounded outline-none resize-y ${errors.customers_address ? 'border-red-500' : 'border-gray-300'}`}
                                disabled={isSubmitting || isViewMode}
                            ></textarea>
                        </div>
                    </div>

                    <div className="flex border border-gray-200 rounded-sm">
                        <div className="w-[30%] bg-gray-50 p-2 flex items-start justify-between text-[13px] font-bold text-gray-600 border-r border-gray-200">
                            <span>Address Invoice</span><span>:</span>
                        </div>
                        <div className="w-[70%] p-1.5">
                            <textarea
                                rows={3}
                                {...register('customers_address_invoice')}
                                className={`w-full px-2 py-1 text-[13px] border rounded outline-none resize-y ${errors.customers_address_invoice ? 'border-red-500' : 'border-gray-300'}`}
                                disabled={isSubmitting || isViewMode}
                            ></textarea>
                        </div>
                    </div>

                    <div className="flex border border-gray-200 rounded-sm">
                        <div className="w-[30%] bg-gray-50 p-2 flex items-center justify-between text-[13px] font-bold text-gray-600 border-r border-gray-200">
                            <span>Blacklist</span><span>:</span>
                        </div>
                        <div className="w-[70%] p-2 flex items-center bg-gray-50/50">
                            <input type="checkbox" {...register('is_blacklist')} disabled={isSubmitting || isViewMode} className="rounded" />
                        </div>
                    </div>

                    <div className="flex border border-gray-200 rounded-sm">
                        <div className="w-[30%] bg-gray-50 p-2 flex items-center justify-between text-[13px] font-bold text-gray-600 border-r border-gray-200">
                            <span>External Sales</span><span>:</span>
                        </div>
                        <div className="w-[70%] p-2 flex items-center bg-gray-50/50">
                            <input type="checkbox" {...register('is_external_sales')} disabled={isSubmitting || isViewMode} className="rounded" />
                        </div>
                    </div>

                    <div className="flex border border-gray-200 rounded-sm">
                        <div className="w-[30%] bg-gray-50 p-2 flex items-center justify-between text-[13px] font-bold text-gray-600 border-r border-gray-200">
                            <span>Company</span><span>:</span>
                        </div>
                        <div className="w-[70%] p-2 flex items-center bg-gray-50/50">
                            <input type="checkbox" {...register('f_company')} disabled={isSubmitting || isViewMode} className="rounded" />
                        </div>
                    </div>

                    <div className="flex border border-gray-200 rounded-sm">
                        <div className="w-[30%] bg-gray-50 p-2 flex items-center justify-between text-[13px] font-bold text-gray-600 border-r border-gray-200">
                            <span>{watchFCompany ? 'NIB' : 'NIK PIC'}</span><span>:</span>
                        </div>
                        <div className="w-[70%] p-1.5">
                            <input
                                type="text"
                                {...register(watchFCompany ? 'nib' : 'nik')}
                                className="w-full px-2 py-1 text-[13px] border border-gray-300 rounded outline-none"
                                disabled={isSubmitting || isViewMode}
                            />
                        </div>
                    </div>

                    {/* Additional Company Fields if checked */}
                    {watchFCompany && (
                        <>
                            <div className="flex border border-gray-200 rounded-sm">
                                <div className="w-[30%] bg-gray-50 p-2 flex items-center justify-between text-[13px] font-bold text-gray-600 border-r border-gray-200">
                                    <span>NPWP</span><span>:</span>
                                </div>
                                <div className="w-[70%] p-1.5">
                                    <input
                                        type="text"
                                        {...register('npwp')}
                                        className="w-full px-2 py-1 text-[13px] border border-gray-300 rounded outline-none"
                                        disabled={isSubmitting || isViewMode}
                                    />
                                </div>
                            </div>
                            <div className="flex border border-gray-200 rounded-sm">
                                <div className="w-[30%] bg-gray-50 p-2 flex items-center justify-between text-[13px] font-bold text-gray-600 border-r border-gray-200">
                                    <span>Nama Lengkap (PIC)</span><span>:</span>
                                </div>
                                <div className="w-[70%] p-1.5">
                                    <input
                                        type="text"
                                        {...register('nama_lengkap')}
                                        className="w-full px-2 py-1 text-[13px] border border-gray-300 rounded outline-none"
                                        disabled={isSubmitting || isViewMode}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Right Column */}
                <div className="space-y-2">
                    <div className="flex border border-gray-200 rounded-sm">
                        <div className="w-[30%] bg-gray-50 p-2 flex items-center justify-between text-[13px] font-bold text-gray-600 border-r border-gray-200">
                            <span>Mobile</span><span>:</span>
                        </div>
                        <div className="w-[70%] p-1.5">
                            <input
                                type="text"
                                placeholder="Enter mobile phone number"
                                {...register('customers_mobile')}
                                className="w-full px-2 py-1 text-[13px] border border-gray-300 rounded outline-none"
                                disabled={isSubmitting || isViewMode}
                            />
                        </div>
                    </div>

                    <div className="flex border border-gray-200 rounded-sm">
                        <div className="w-[30%] bg-gray-50 p-2 flex items-center justify-between text-[13px] font-bold text-gray-600 border-r border-gray-200">
                            <span>Email</span><span>:</span>
                        </div>
                        <div className="w-[70%] p-1.5">
                            <input
                                type="email"
                                placeholder="Enter email"
                                {...register('customers_email')}
                                className="w-full px-2 py-1 text-[13px] border border-gray-300 rounded outline-none"
                                disabled={isSubmitting || isViewMode}
                            />
                        </div>
                    </div>

                    <div className="flex border border-gray-200 rounded-sm">
                        <div className="w-[30%] bg-gray-50 p-2 flex items-center justify-between text-[13px] font-bold text-gray-600 border-r border-gray-200">
                            <span>Fax</span><span>:</span>
                        </div>
                        <div className="w-[70%] p-1.5">
                            <input
                                type="text"
                                placeholder="Enter fax"
                                {...register('customers_fax')}
                                className="w-full px-2 py-1 text-[13px] border border-gray-300 rounded outline-none"
                                disabled={isSubmitting || isViewMode}
                            />
                        </div>
                    </div>

                    <div className="flex border border-gray-200 rounded-sm">
                        <div className="w-[30%] bg-gray-50 p-2 flex items-center justify-between text-[13px] font-bold text-gray-600 border-r border-gray-200">
                            <span>Phone</span><span>:</span>
                        </div>
                        <div className="w-[70%] p-1.5">
                            <input
                                type="text"
                                placeholder="Enter phone number"
                                {...register('customers_phone')}
                                className="w-full px-2 py-1 text-[13px] border border-gray-300 rounded outline-none"
                                disabled={isSubmitting || isViewMode}
                            />
                        </div>
                    </div>

                    <div className="flex border border-gray-200 rounded-sm">
                        <div className="w-[30%] bg-gray-50 p-2 flex items-center justify-between text-[13px] font-bold text-gray-600 border-r border-gray-200">
                            <span>Alamat PIC</span><span>:</span>
                        </div>
                        <div className="w-[70%] p-1.5">
                            <input
                                type="text"
                                {...register('alamat')}
                                className="w-full px-2 py-1 text-[13px] border border-gray-300 rounded outline-none"
                                disabled={isSubmitting || isViewMode}
                            />
                        </div>
                    </div>

                    <div className="flex border border-gray-200 rounded-sm mt-4">
                        <div className="w-[30%] bg-gray-50 p-2 flex items-center justify-between text-[13px] font-bold text-gray-600 border-r border-gray-200">
                            <span>Provinsi</span><span>:</span>
                        </div>
                        <div className="w-[70%] p-1.5">
                            <Controller
                                control={control}
                                name="provinsi"
                                render={({ field }) => (
                                    <SearchablePaginatedSelect
                                        value={field.value || ''}
                                        onChange={(val) => {
                                            field.onChange(val);
                                        }}
                                        options={provinsiList.map(p => ({
                                            value: String(p.id),
                                            label: p.nama
                                        }))}
                                        placeholder="----- Cari Provinsi -----"
                                        disabled={isSubmitting || isViewMode || loadingProvinsi}
                                        error={errors.provinsi?.message}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex border border-gray-200 rounded-sm">
                        <div className="w-[30%] bg-gray-50 p-2 flex items-center justify-between text-[13px] font-bold text-gray-600 border-r border-gray-200">
                            <span>Kabupaten/Kota</span><span>:</span>
                        </div>
                        <div className="w-[70%] p-1.5">
                            <Controller
                                control={control}
                                name="kabupaten"
                                render={({ field }) => (
                                    <SearchablePaginatedSelect
                                        value={field.value || ''}
                                        onChange={(val) => {
                                            field.onChange(val);
                                        }}
                                        options={kabupatenList.map(k => ({
                                            value: String(k.id),
                                            label: k.nama_kabupaten
                                        }))}
                                        placeholder="----- Cari Kabupaten/Kota -----"
                                        disabled={isSubmitting || isViewMode || loadingKabupaten || !watchProvinsi}
                                        error={errors.kabupaten?.message}
                                    />
                                )}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
                {!isViewMode && (
                    <>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-4 py-2 bg-[#22c55e] text-white text-[13px] font-medium rounded hover:bg-[#16a34a] transition-colors disabled:opacity-50"
                        >
                            <i className="fas fa-save"></i> {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                        </button>
                        <button 
                            type="button" 
                            onClick={() => append({ nm_customers_contact: '', customers_contact_posisi: '', customers_contact_phone: '', customers_contact_email: '' })}
                            className="flex items-center gap-2 px-4 py-2 bg-[#f5f5f5] border border-gray-300 text-gray-700 text-[13px] font-medium rounded hover:bg-[#e0e0e0] transition-colors"
                        >
                            + Tambah Kontak
                        </button>
                    </>
                )}
                
                {isViewMode ? (
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
                            onClick={onCancel || (() => navigate('/customers'))}
                            className="flex items-center gap-2 px-4 py-2 bg-[#f59e0b] text-white text-[13px] font-medium rounded hover:bg-[#d97706] transition-colors"
                        >
                            <i className="fas fa-undo"></i> Kembali
                        </button>
                    </>
                ) : (
                    <button
                        type="button"
                        onClick={onCancel || (() => navigate('/customers'))}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-4 py-2 bg-[#f59e0b] text-white text-[13px] font-medium rounded hover:bg-[#d97706] transition-colors disabled:opacity-50"
                    >
                        <i className="fas fa-undo"></i> Kembali
                    </button>
                )}
            </div>

            {/* Contacts Table */}
            <div className="mt-2 border border-gray-200 rounded">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-[13px]">
                        <thead className="bg-[#f9f9f9] border-b border-gray-200">
                            <tr>
                                <th className="px-3 py-2 text-center font-bold text-gray-700 w-12 border-r border-gray-200">No</th>
                                <th className="px-3 py-2 text-center font-bold text-gray-700 border-r border-gray-200">Contact Name</th>
                                <th className="px-3 py-2 text-center font-bold text-gray-700 border-r border-gray-200">Position</th>
                                <th className="px-3 py-2 text-center font-bold text-gray-700 border-r border-gray-200">Phone</th>
                                <th className="px-3 py-2 text-center font-bold text-gray-700 border-r border-gray-200">Email</th>
                                {!isViewMode && <th className="px-3 py-2 text-center font-bold text-gray-700 w-24">Action</th>}
                            </tr>
                        </thead>
                        <tbody className="bg-[#fcfcfc] divide-y divide-gray-200">
                            {fields.length === 0 ? (
                                <tr>
                                    <td colSpan={isViewMode ? 5 : 6} className="px-3 py-4 text-center text-gray-500 bg-[#f9f9f9]">
                                        No data available in table
                                    </td>
                                </tr>
                            ) : (
                                fields.map((field, index) => (
                                    <tr key={field.id} className="hover:bg-gray-50">
                                        <td className="px-2 py-2 text-center border-r border-gray-200">{index + 1}</td>
                                        <td className="px-2 py-2 border-r border-gray-200">
                                            <input 
                                                type="text" 
                                                {...register(`contacts.${index}.nm_customers_contact` as const)} 
                                                className={`w-full px-2 py-1 text-[13px] border rounded outline-none disabled:bg-transparent disabled:border-transparent ${errors.contacts?.[index]?.nm_customers_contact ? 'border-red-500' : 'border-gray-300'}`}
                                                disabled={isSubmitting || isViewMode}
                                            />
                                        </td>
                                        <td className="px-2 py-2 border-r border-gray-200">
                                            <input 
                                                type="text" 
                                                {...register(`contacts.${index}.customers_contact_posisi` as const)} 
                                                className="w-full px-2 py-1 text-[13px] border border-gray-300 rounded outline-none disabled:bg-transparent disabled:border-transparent"
                                                disabled={isSubmitting || isViewMode}
                                            />
                                        </td>
                                        <td className="px-2 py-2 border-r border-gray-200">
                                            <input 
                                                type="text" 
                                                {...register(`contacts.${index}.customers_contact_phone` as const)} 
                                                className="w-full px-2 py-1 text-[13px] border border-gray-300 rounded outline-none disabled:bg-transparent disabled:border-transparent"
                                                disabled={isSubmitting || isViewMode}
                                            />
                                        </td>
                                        <td className="px-2 py-2 border-r border-gray-200">
                                            <input 
                                                type="text" 
                                                {...register(`contacts.${index}.customers_contact_email` as const)} 
                                                className={`w-full px-2 py-1 text-[13px] border rounded outline-none disabled:bg-transparent disabled:border-transparent ${errors.contacts?.[index]?.customers_contact_email ? 'border-red-500' : 'border-gray-300'}`}
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

export default CustomerForm;
