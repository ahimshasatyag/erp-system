import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { showAlert } from '../../../components/SweetAlert';
import { useGetLktDetail, useSaveVisit } from '../hooks/useLkt';
import { useGetCsrFormData } from '../../csr/hooks/useCsr';

interface RealisasiFormValues {
    actual_starting_date: string;
    actual_day: number;
    actual_service_amount: number;
    actual_transport_amount: number;
    actual_accommodation_amount: number;
    actual_training: number;
    actual_bongkar: number;
    actual_description: string;
    flag_daring: boolean;
    nm_teknisi: string[];
}

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

    const handleToggleTeknisi = (id: string) => {
        const current = [...watchTeknisi];
        const idx = current.indexOf(id);
        if (idx > -1) {
            current.splice(idx, 1);
        } else {
            current.push(id);
        }
        setValue('nm_teknisi', current);
    };

    if (isDetailLoading || isFormLoading) {
        return <div className="text-center py-12 text-gray-400">Loading form data...</div>;
    }

    const backUrl = `/lkt/${cleanLktCode}/edit`;

    return (
        <div className="w-full min-h-screen py-4 px-8 text-sm text-gray-800 bg-[#f3f3f4]">
            {/* Header Title & Breadcrumb */}
            <div className="flex justify-between items-start mb-6 text-left">
                <div className="flex flex-col">
                    <h2 className="text-[26px] font-bold text-gray-900 tracking-tight leading-tight">
                        {cstCode}
                    </h2>
                    <div className="flex items-center text-[22px] font-bold text-gray-900 tracking-tight mt-1.5 ml-0.5">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" className="mr-1 text-black -mt-1.5" style={{ strokeLinecap: 'square' }}>
                            <path d="M6 2v14h14" />
                            <path d="M15 11l5 5-5 5" />
                        </svg>
                        <span>{formattedLktCode}</span>
                    </div>
                </div>
                <div className="text-[13px] text-gray-500 font-medium pt-1">
                    EMM Service / LKT / Tambah Visit Realisasi
                </div>
            </div>

            {/* Subtitle / Title Action */}
            <div className="text-left mb-4">
                <h5 className="text-[15px] font-bold text-gray-800 uppercase tracking-wide">
                    LKT Detail - Realisasi Service
                </h5>
            </div>

            {/* Back & Save Button Row */}
            <div className="flex justify-between items-center mb-5">
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => navigate(backUrl)}
                        className="bg-[#428bca] hover:bg-[#3071a9] text-white px-3.5 py-1.5 rounded-[3px] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#357ebd]"
                    >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z" />
                        </svg>
                        Back
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

            {/* Blue Color Tinted Panel */}
            <div className="bg-[#f0fbff]/30 border border-[#bce8f1] p-6 rounded-[4px] shadow-sm text-left">
                <form id="realisasi-add-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                    <div className="text-left mb-3">
                        <h4 className="text-[17px] font-bold text-[#31708f] uppercase tracking-wide">
                            Tambah Kunjungan Realisasi
                        </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        {/* Left Details Table */}
                        <div className="border border-[#e7eaec] rounded-[4px] overflow-hidden bg-white h-fit shadow-sm">
                            <table className="w-full text-xs text-gray-800 border-collapse table-fixed">
                                <tbody>
                                    <tr className="bg-white">
                                        <td className="py-3 px-4 font-bold text-gray-700 w-[35%] text-left bg-[#f3f3f4] border-r border-b border-[#e7eaec] align-middle">
                                            Tanggal Visit <span className="text-red-500">*</span>
                                        </td>
                                        <td className="py-3 px-1 text-center w-[5%] bg-[#f3f3f4] border-r border-b border-[#e7eaec] align-middle">:</td>
                                        <td className="py-3 px-4 text-left border-b border-[#e7eaec] align-middle">
                                            <input
                                                type="date"
                                                {...register('actual_starting_date', { required: true })}
                                                className="w-full max-w-[200px] bg-white text-gray-800 border border-gray-300 rounded-[3px] px-2.5 py-1.5 focus:outline-none focus:border-[#1ab394] font-normal"
                                            />
                                        </td>
                                    </tr>
                                    <tr className="bg-white">
                                        <td className="py-3 px-4 font-bold text-gray-700 text-left bg-[#f3f3f4] border-r border-b border-[#e7eaec] align-middle">
                                            Hari Kerja <span className="text-red-500">*</span>
                                        </td>
                                        <td className="py-3 px-1 text-center bg-[#f3f3f4] border-r border-b border-[#e7eaec] align-middle">:</td>
                                        <td className="py-3 px-4 text-left border-b border-[#e7eaec] align-middle">
                                            <input
                                                type="number"
                                                min={1}
                                                {...register('actual_day', { required: true, valueAsNumber: true })}
                                                className="w-[100px] bg-white text-gray-800 border border-gray-300 rounded-[3px] px-2.5 py-1.5 focus:outline-none focus:border-[#1ab394] font-normal"
                                            />
                                        </td>
                                    </tr>
                                    <tr className="bg-white">
                                        <td className="py-3 px-4 font-bold text-gray-700 text-left bg-[#f3f3f4] border-r border-b border-[#e7eaec] align-middle">
                                            Training Daring
                                        </td>
                                        <td className="py-3 px-1 text-center bg-[#f3f3f4] border-r border-b border-[#e7eaec] align-middle">:</td>
                                        <td className="py-3 px-4 text-left border-b border-[#e7eaec] align-middle">
                                            <label className="inline-flex items-center gap-2 cursor-pointer py-1 select-none">
                                                <input
                                                    type="checkbox"
                                                    {...register('flag_daring')}
                                                    className="w-4 h-4 rounded border-gray-300 text-[#1ab394] focus:ring-[#1ab394] transition-colors cursor-pointer"
                                                />
                                                <span className="text-gray-700 font-medium">Daring (Online)</span>
                                            </label>
                                        </td>
                                    </tr>
                                    <tr className="bg-white">
                                        <td className="py-3 px-4 font-bold text-gray-700 text-left bg-[#f3f3f4] border-r border-[#e7eaec] align-top pt-4">
                                            Bukti Foto
                                        </td>
                                        <td className="py-3 px-1 text-center bg-[#f3f3f4] border-r border-[#e7eaec] align-top pt-4">:</td>
                                        <td className="py-3 px-4 text-left align-middle">
                                            <div className="flex flex-col py-1">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="text-xs text-gray-500 cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-[3px] file:border file:border-gray-300 file:text-xs file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 transition-colors"
                                                />
                                                <span className="text-[11px] text-red-500 italic mt-1 font-medium">max size 5mb</span>
                                                {imagePreview && (
                                                    <div className="mt-3 border border-gray-300 rounded overflow-hidden max-w-[200px] max-h-[150px]">
                                                        <img src={imagePreview} alt="Bukti Foto Preview" className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Right Details Table (Amounts) */}
                        <div className="border border-[#e7eaec] rounded-[4px] overflow-hidden bg-white h-fit shadow-sm">
                            <table className="w-full text-xs text-gray-850 border-collapse table-fixed">
                                <tbody>
                                    <tr className="bg-white">
                                        <td className="py-3 px-4 font-bold text-gray-700 w-[35%] text-left bg-[#f3f3f4] border-r border-b border-[#e7eaec] align-middle">
                                            Biaya Jasa (Rp)
                                        </td>
                                        <td className="py-3 px-1 text-center w-[5%] bg-[#f3f3f4] border-r border-b border-[#e7eaec] align-middle">:</td>
                                        <td className="py-3 px-4 text-left border-b border-[#e7eaec] align-middle">
                                            <input
                                                type="number"
                                                min={0}
                                                {...register('actual_service_amount', { valueAsNumber: true })}
                                                className="w-full max-w-[250px] bg-white text-gray-800 border border-gray-300 rounded-[3px] px-2.5 py-1.5 focus:outline-none focus:border-[#1ab394] font-normal"
                                            />
                                        </td>
                                    </tr>
                                    <tr className="bg-white">
                                        <td className="py-3 px-4 font-bold text-gray-700 text-left bg-[#f3f3f4] border-r border-b border-[#e7eaec] align-middle">
                                            Biaya Transport (Rp)
                                        </td>
                                        <td className="py-3 px-1 text-center bg-[#f3f3f4] border-r border-b border-[#e7eaec] align-middle">:</td>
                                        <td className="py-3 px-4 text-left border-b border-[#e7eaec] align-middle">
                                            <input
                                                type="number"
                                                min={0}
                                                {...register('actual_transport_amount', { valueAsNumber: true })}
                                                className="w-full max-w-[250px] bg-white text-gray-800 border border-gray-300 rounded-[3px] px-2.5 py-1.5 focus:outline-none focus:border-[#1ab394] font-normal"
                                            />
                                        </td>
                                    </tr>
                                    <tr className="bg-white">
                                        <td className="py-3 px-4 font-bold text-gray-700 text-left bg-[#f3f3f4] border-r border-b border-[#e7eaec] align-middle">
                                            Biaya Akomodasi (Rp)
                                        </td>
                                        <td className="py-3 px-1 text-center bg-[#f3f3f4] border-r border-b border-[#e7eaec] align-middle">:</td>
                                        <td className="py-3 px-4 text-left border-b border-[#e7eaec] align-middle">
                                            <input
                                                type="number"
                                                min={0}
                                                {...register('actual_accommodation_amount', { valueAsNumber: true })}
                                                className="w-full max-w-[250px] bg-white text-gray-800 border border-gray-300 rounded-[3px] px-2.5 py-1.5 focus:outline-none focus:border-[#1ab394] font-normal"
                                            />
                                        </td>
                                    </tr>
                                    <tr className="bg-white">
                                        <td className="py-3 px-4 font-bold text-gray-700 text-left bg-[#f3f3f4] border-r border-b border-[#e7eaec] align-middle">
                                            Biaya Training (Rp)
                                        </td>
                                        <td className="py-3 px-1 text-center bg-[#f3f3f4] border-r border-b border-[#e7eaec] align-middle">:</td>
                                        <td className="py-3 px-4 text-left border-b border-[#e7eaec] align-middle">
                                            <input
                                                type="number"
                                                min={0}
                                                {...register('actual_training', { valueAsNumber: true })}
                                                className="w-full max-w-[250px] bg-white text-gray-800 border border-gray-300 rounded-[3px] px-2.5 py-1.5 focus:outline-none focus:border-[#1ab394] font-normal"
                                            />
                                        </td>
                                    </tr>
                                    <tr className="bg-white">
                                        <td className="py-3 px-4 font-bold text-gray-700 text-left bg-[#f3f3f4] border-r-[#e7eaec] align-middle">
                                            Biaya Bongkar (Rp)
                                        </td>
                                        <td className="py-3 px-1 text-center bg-[#f3f3f4] border-r-[#e7eaec] align-middle">:</td>
                                        <td className="py-3 px-4 text-left align-middle">
                                            <input
                                                type="number"
                                                min={0}
                                                {...register('actual_bongkar', { valueAsNumber: true })}
                                                className="w-full max-w-[250px] bg-white text-gray-800 border border-gray-300 rounded-[3px] px-2.5 py-1.5 focus:outline-none focus:border-[#1ab394] font-normal"
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Bottom Full-width Fields: Description and Technician Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-2">
                        {/* Left - Keterangan Kunjungan */}
                        <div className="border border-[#e7eaec] rounded-[4px] overflow-hidden bg-white shadow-sm h-full">
                            <div className="bg-[#f3f3f4] py-2.5 px-4 font-bold text-gray-750 border-b border-[#e7eaec]">
                                Keterangan Kunjungan <span className="text-red-500">*</span>
                            </div>
                            <div className="p-4">
                                <textarea
                                    {...register('actual_description', { required: 'Keterangan wajib diisi!' })}
                                    rows={6}
                                    placeholder="Masukkan rincian pekerjaan atau hasil kunjungan teknisi..."
                                    className="w-full bg-white text-gray-800 border border-gray-300 rounded-[3px] px-2.5 py-2.5 focus:outline-none focus:border-[#1ab394] font-normal outline-none transition-colors"
                                />
                                {errors.actual_description && (
                                    <p className="mt-1 text-red-500 font-semibold text-[11px]">{errors.actual_description.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Right - Nama Teknisi Selection */}
                        <div className="border border-[#e7eaec] rounded-[4px] overflow-hidden bg-white shadow-sm flex flex-col h-[300px]">
                            <div className="bg-[#f3f3f4] py-2.5 px-4 font-bold text-gray-750 border-b border-[#e7eaec] flex justify-between items-center">
                                <span>Pilih Teknisi <span className="text-red-500">*</span></span>
                                <span className="text-[11px] text-gray-500">Selected: {watchTeknisi.length}</span>
                            </div>
                            <div className="p-4 overflow-y-auto flex-1 grid grid-cols-2 gap-2 text-[11px] align-middle">
                                {formData?.karyawan?.length > 0 ? (
                                    formData.karyawan.map((k: any) => {
                                        const isSelected = watchTeknisi.includes(String(k.id_karyawan));
                                        return (
                                            <button
                                                key={k.id_karyawan}
                                                type="button"
                                                onClick={() => handleToggleTeknisi(String(k.id_karyawan))}
                                                className={`p-2 rounded-[3px] text-left transition-all font-semibold flex items-center gap-2 select-none border cursor-pointer ${
                                                    isSelected
                                                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => {}}
                                                    className="w-3.5 h-3.5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 pointer-events-none"
                                                />
                                                <span className="truncate">{k.nm_karyawan}</span>
                                            </button>
                                        );
                                    })
                                ) : (
                                    <div className="col-span-2 py-8 text-center text-gray-400">
                                        Data teknisi tidak ditemukan
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
