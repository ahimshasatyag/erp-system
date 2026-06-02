import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { showAlert } from '../../../components/SweetAlert';
import { useGetLktDetail, useSaveVisit } from '../hooks/useLkt';
import { useGetCsrFormData } from '../../csr/hooks/useCsr';
import type { RealisasiFormValues } from '../validation/realisasiForm';
import RealisasiFormFields from '../forms/RealisasiFormFields';

export default function LktRealisasiAddPage() {
    const { lktCode } = useParams<{ lktCode: string }>();
    const navigate = useNavigate();
    const saveVisitMutation = useSaveVisit();

    const formattedLktCode = lktCode ? lktCode.replace(/\./g, '/') : '';
    const cleanLktCode = lktCode || '';

    // Queries
    const { data: detailResponse, isLoading: isDetailLoading } = useGetLktDetail(formattedLktCode);
    const { data: formData, isLoading: isFormLoading } = useGetCsrFormData();

    // Data wrappers
    const lkt = detailResponse?.data || detailResponse;
    const cstCode = lkt?.cst_code || '';

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm<RealisasiFormValues>({
        defaultValues: {
            actual_starting_date: new Date().toISOString().split('T')[0],
            actual_day: 1,
            actual_service_amount: 0,
            actual_transport_amount: 0,
            actual_accommodation_amount: 0,
            actual_training: 0,
            actual_bongkar: 0,
            actual_description: '',
            flag_daring: false,
            nm_teknisi: []
        }
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const watchTeknisi = watch('nm_teknisi') || [];

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setSelectedImage(null);
            setImagePreview(null);
        }
    };

    // Helper to group karyawan for react-select
    const groupedKaryawan = React.useMemo(() => {
        if (!formData?.karyawan) return [];
        const groups: Record<string, any[]> = {};
        formData.karyawan.forEach((k: any) => {
            const div = k.divisi || 'Lainnya';
            if (!groups[div]) groups[div] = [];
            groups[div].push({ value: String(k.id_karyawan), label: k.nm_karyawan });
        });
        return Object.keys(groups).sort().map(div => ({
            label: div,
            options: groups[div].sort((a, b) => a.label.localeCompare(b.label))
        }));
    }, [formData?.karyawan]);

    const handleFormSubmit = async (values: RealisasiFormValues) => {
        if (values.nm_teknisi.length === 0) {
            showAlert.error('Gagal', 'Silakan pilih minimal 1 nama teknisi.');
            return;
        }

        try {
            const formDataPayload = new FormData();
            formDataPayload.append('lkt_code', formattedLktCode);
            formDataPayload.append('cst_code', cstCode);
            formDataPayload.append('actual_starting_date', values.actual_starting_date);
            formDataPayload.append('actual_day', String(values.actual_day));
            formDataPayload.append('actual_service_amount', String(values.actual_service_amount));
            formDataPayload.append('actual_transport_amount', String(values.actual_transport_amount));
            formDataPayload.append('actual_accommodation_amount', String(values.actual_accommodation_amount));
            formDataPayload.append('actual_training', String(values.actual_training));
            formDataPayload.append('actual_bongkar', String(values.actual_bongkar));
            formDataPayload.append('actual_description', values.actual_description);
            formDataPayload.append('flag_daring', values.flag_daring ? '1' : '0');

            values.nm_teknisi.forEach((techId) => {
                formDataPayload.append('nm_teknisi[]', techId);
            });

            if (selectedImage) {
                formDataPayload.append('link_foto', selectedImage);
            }

            showAlert.confirm(
                'Simpan Realisasi?',
                'Apakah Anda yakin akan menyimpan realisasi visit ini?',
                async () => {
                    const res = await saveVisitMutation.mutateAsync(formDataPayload);
                    if (res.status === 'success' || res.id_ak) {
                        showAlert.success('Berhasil!', 'Data Realisasi Kunjungan Berhasil Disimpan');
                        navigate(`/lkt/${cleanLktCode}/edit`);
                    }
                }
            );
        } catch (error: any) {
            console.error('Failed to save visit realisasi:', error);
            showAlert.error('Gagal', error?.response?.data?.message || 'Terjadi kesalahan saat menyimpan realisasi');
        }
    };

    if (isDetailLoading || isFormLoading) {
        return <div className="text-center py-12 text-gray-400">Loading form data...</div>;
    }

    const backUrl = `/lkt/${cleanLktCode}/edit`;

    return (
        <div className="w-full min-h-screen py-4 px-8 text-sm text-gray-800 bg-[#f3f3f4]">
            {/* Main White Container */}
            <div className="bg-white p-6 shadow-sm rounded-sm text-left">
                {/* Header Title & Breadcrumb */}
                <div className="flex justify-between items-start mb-4 text-left">
                    <div className="flex flex-col">
                        <h2 className="text-[22px] font-bold text-gray-800 tracking-tight leading-tight">
                            {cstCode}
                        </h2>
                        <div className="flex items-center text-[18px] font-bold text-gray-800 tracking-tight mt-1 ml-0.5">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="mr-2 text-gray-800 -mt-2" style={{ strokeLinecap: 'square' }}>
                                <path d="M4 2v12h12" />
                                <path d="M13 10l5 4-5 4" />
                            </svg>
                            <span>{formattedLktCode}</span>
                        </div>
                    </div>
                </div>

                {/* Subtitle / Title Action */}
                <div className="text-left mb-2">
                    <h5 className="text-[18px] font-bold text-gray-800 tracking-wide">
                        Tambah Laporan Visit
                    </h5>
                </div>

                {/* Back & Save Button Row */}
                <div className="flex justify-start items-center mb-6">
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => navigate(backUrl)}
                            className="bg-[#5bc0de] hover:bg-[#46b8da] text-white px-3 py-1.5 rounded-[3px] text-[13px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-[#46b8da]"
                        >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z" />
                            </svg>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="realisasi-add-form"
                            disabled={saveVisitMutation.isPending}
                            className="bg-[#5cb85c] hover:bg-[#449d44] text-white px-3.5 py-1.5 rounded-[3px] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#4cae4c] disabled:opacity-50"
                        >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                <path d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
                            </svg>
                            {saveVisitMutation.isPending ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>

                {/* Form Section */}
                <form id="realisasi-add-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    <div className="text-left mb-4">
                        <h4 className="text-[16px] font-bold text-gray-800 tracking-wide">
                            Laporan Kerusakan
                        </h4>
                    </div>

                    <RealisasiFormFields
                        visitData={lkt}
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        canEdit={true}
                        groupedKaryawan={groupedKaryawan}
                        watchTeknisi={watchTeknisi}
                        handleImageChange={handleImageChange}
                        imagePreview={imagePreview}
                    />
                </form>
            </div>
        </div>
    );
}
