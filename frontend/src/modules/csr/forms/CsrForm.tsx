import React, { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { storeCsrSchema, updateCsrSchema, type StoreCsrValues, type UpdateCsrValues } from '../validation/csrSchema';
import { useGetCsrFormData, useIsiOtomatis } from '../hooks/useCsr';
import ProductServiceSection from '../components/ProductServiceSection';
import CustomerSection from '../components/CustomerSection';
import DeliverySection from '../components/DeliverySection';
import DamageReportSection from '../components/DamageReportSection';

interface CsrFormProps {
    initialData?: any;
    isEditMode?: boolean;
    isViewMode?: boolean;
    onSubmit?: (data: StoreCsrValues | UpdateCsrValues) => void;
    isSubmitting?: boolean;
    actionToolbar?: React.ReactNode;
}

export default function CsrForm({
    initialData,
    isEditMode = false,
    isViewMode = false,
    onSubmit = () => { },
    isSubmitting = false,
    actionToolbar
}: CsrFormProps) {
    const navigate = useNavigate();
    const { data: formData, isLoading: isLoadingFormData } = useGetCsrFormData();
    const isiOtomatisMutation = useIsiOtomatis();

    const [warrantyEndDisplay, setWarrantyEndDisplay] = useState<string>('');
    const [warrantyStatus, setWarrantyStatus] = useState<{ text: string; color: string } | null>(null);

    const getMappedDefaultValues = () => {
        if (!initialData) {
            return {
                date_request: new Date().toISOString().split('T')[0],
                tgl_delivered: new Date().toISOString().split('T')[0],
                warranty_time: '12',
                sts_pasang: '',
                lokasi: '',
            };
        }
        return {
            csr_code: initialData.csr_code || '',
            sn_number: initialData.barcode || '',
            id_product: initialData.id_product ? String(initialData.id_product) : '',
            sts_pasang: initialData.sts_pasang !== undefined && initialData.sts_pasang !== null ? String(initialData.sts_pasang) : '',
            customers: initialData.id_customers ? String(initialData.id_customers) : '',
            date_request: initialData.csr_date ? initialData.csr_date.split(' ')[0] : '',
            do_code: initialData.do_code || '',
            tgl_delivered: initialData.waranty_start ? initialData.waranty_start.split(' ')[0] : '',
            warranty_time: initialData.waranty_time ? String(initialData.waranty_time) : '12',
            status: initialData.csr_status || '',
            id_karyawan: initialData.id_karyawan ? String(initialData.id_karyawan) : '',
            lokasi: initialData.lokasi || '',
            lap_kerusakan: initialData.lap_kerusakan || '',
        };
    };

    const { register, handleSubmit, setValue, control, reset, formState: { errors } } = useForm<any>({
        resolver: zodResolver(isEditMode ? updateCsrSchema : storeCsrSchema),
        defaultValues: getMappedDefaultValues()
    });

    useEffect(() => {
        if (initialData) {
            reset(getMappedDefaultValues());
        }
    }, [initialData, reset]);

    // Watch fields to trigger warranty calculation and auto-fill
    const watchTglDelivered = useWatch({ control, name: 'tgl_delivered' });
    const watchDateRequest = useWatch({ control, name: 'date_request' });
    const watchCustomers = useWatch({ control, name: 'customers' });

    // Handle barcode auto-fill (isi_otomatis)
    const handleBarcodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const barcode = e.target.value;
        if (barcode && barcode.length >= 5) {
            try {
                const res = await isiOtomatisMutation.mutateAsync(barcode);
                if (res) {
                    if (res.id_product) setValue('id_product', String(res.id_product));
                    if (res.tgl_delivered) setValue('tgl_delivered', res.tgl_delivered.split(' ')[0]);
                    if (res.do_code) setValue('do_code', res.do_code);
                    if (res.status) setValue('status', res.status);
                    if (res.customers) setValue('customers', String(res.customers));
                    if (res.mesin_lama) setValue('mesin_lama', res.mesin_lama);

                    // Set lokasi based on provinsi
                    if (res.provinsi) {
                        if (String(res.provinsi) === '31') {
                            setValue('lokasi', 'Dalam Kota');
                        } else {
                            setValue('lokasi', 'Luar Kota');
                        }
                    }
                }
            } catch (err) {
                console.error("Barcode lookup failed:", err);
            }
        }
    };

    // Auto set lokasi when customer is manually changed
    useEffect(() => {
        if (watchCustomers && formData?.customers) {
            const selectedCust = formData.customers.find((c: any) => String(c.id_customers) === String(watchCustomers));
            if (selectedCust?.provinsi) {
                if (String(selectedCust.provinsi) === '31') {
                    setValue('lokasi', 'Dalam Kota');
                } else {
                    setValue('lokasi', 'Luar Kota');
                }
            }
        }
    }, [watchCustomers, formData, setValue]);

    // Calculate warranty status dynamically
    useEffect(() => {
        if (watchTglDelivered && watchDateRequest) {
            const d = new Date(watchTglDelivered);
            d.setFullYear(d.getFullYear() + 1); // + 12 months
            const end = d.toISOString().split('T')[0];

            // Format for display DD/MM/YY
            const dd = String(d.getDate()).padStart(2, '0');
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const yy = String(d.getFullYear()).slice(-2);
            setWarrantyEndDisplay(`( ${dd}/${mm}/${yy} )`);

            const today = new Date().toISOString().split('T')[0];
            if (today >= watchTglDelivered && today <= end) {
                setWarrantyStatus({ text: 'GARANSI', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' });
            } else {
                setWarrantyStatus({ text: 'TIDAK GARANSI', color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/20' });
            }
        } else {
            setWarrantyEndDisplay('');
            setWarrantyStatus(null);
        }
    }, [watchTglDelivered, watchDateRequest]);

    if (isLoadingFormData) {
        return <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading form options...</div>;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white dark:bg-[#1e202b] p-8 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 transition-all duration-300">
            {/* Action Toolbar placed INSIDE the form card at the very top */}
            {actionToolbar && (
                <div className="flex flex-wrap items-center gap-3 pb-6 border-b border-gray-250 dark:border-gray-800 transition-colors duration-200">
                    {actionToolbar}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* LEFT COLUMN */}
                <div className="space-y-8">
                    {/* 1. Product To Service */}
                    <ProductServiceSection
                        register={register}
                        control={control}
                        errors={errors}
                        isEditMode={isEditMode}
                        isViewMode={isViewMode}
                        formData={formData}
                        isiOtomatisPending={isiOtomatisMutation.isPending}
                        onBarcodeChange={handleBarcodeChange}
                    />

                    {/* 2. Customer Section */}
                    <CustomerSection
                        control={control}
                        register={register}
                        errors={errors}
                        isViewMode={isViewMode}
                        formData={formData}
                        initialData={initialData}
                    />
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-8">
                    {/* 3. Delivery Order Info */}
                    <DeliverySection
                        register={register}
                        errors={errors}
                        isEditMode={isEditMode}
                        isViewMode={isViewMode}
                        warrantyEndDisplay={warrantyEndDisplay}
                        warrantyStatus={warrantyStatus}
                    />
                </div>

                {/* FULL WIDTH damage reports & upload sections */}
                <DamageReportSection
                    register={register}
                    control={control}
                    errors={errors}
                    isViewMode={isViewMode}
                    formData={formData}
                    initialData={initialData}
                />
            </div>

            {/* BUTTONS Row */}
            {!isViewMode && !isEditMode && !actionToolbar && (
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-800">
                    <button
                        type="button"
                        onClick={() => navigate('/csr')}
                        className="bg-white dark:bg-[#161821] text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-6 py-2 rounded font-bold border border-gray-300 dark:border-gray-850 hover:bg-gray-50 dark:hover:bg-[#232733] transition-all duration-200 cursor-pointer text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#20c997] hover:bg-[#1ba87e] disabled:bg-emerald-800/40 text-white px-6 py-2 rounded font-bold transition-all duration-200 disabled:cursor-not-allowed cursor-pointer shadow-md text-sm"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </div>
                        ) : 'Save CSR'}
                    </button>
                </div>
            )}
        </form>
    );
}
