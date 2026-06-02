import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { showAlert } from '../../../components/SweetAlert';
import {
    useGetVisitDetail,
    useUpdateVisit,
    useSavePartVisit
} from '../hooks/useLkt';
import { useGetCsrFormData } from '../../csr/hooks/useCsr';
import type { RealisasiFormValues } from '../validation/realisasiForm';
import RealisasiFormFields from '../forms/RealisasiFormFields';
import SparePartTable from '../components/SparePartTable';


export default function LktRealisasiEditPage() {
    const { subCode } = useParams<{ subCode: string }>();
    const navigate = useNavigate();

    const formattedSubCode = subCode || '';

    // Queries & Mutations
    const { data: visitResponse, isLoading: isVisitLoading, refetch } = useGetVisitDetail(formattedSubCode);
    const { data: formData, isLoading: isFormLoading } = useGetCsrFormData();
    const updateMutation = useUpdateVisit();
    const savePartVisitMutation = useSavePartVisit();

    // Data wrappers
    const visit = visitResponse?.data || visitResponse;
    const parts = visitResponse?.parts || [];
    const technicians = visitResponse?.technicians || [];

    const lktCode = visit?.lkt_code || '';
    const cleanLktCode = lktCode.replace(/\//g, '.');
    const cstCode = visit?.cst_code || '';

    // Spare part input fields state
    const [addPartName, setAddPartName] = useState('');
    const [addQtyPart, setAddQtyPart] = useState<number>(0);
    const [addHargaEs, setAddHargaEs] = useState<number>(0);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm<RealisasiFormValues>({
        defaultValues: {
            actual_starting_date: '',
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

    // Pre-fill form when visit detail loads
    useEffect(() => {
        if (visit) {
            setValue('actual_starting_date', visit.actual_starting_date ? visit.actual_starting_date.split(' ')[0] : '');
            setValue('actual_day', visit.actual_day || 1);
            setValue('actual_service_amount', Number(visit.actual_service_amount) || 0);
            setValue('actual_transport_amount', Number(visit.actual_transport_amount) || 0);
            setValue('actual_accommodation_amount', Number(visit.actual_accommodation_amount) || 0);
            setValue('actual_training', Number(visit.actual_training) || 0);
            setValue('actual_bongkar', Number(visit.actual_bongkar) || 0);
            setValue('actual_description', visit.actual_description || '');
            setValue('flag_daring', Number(visit.flag_daring) === 1);

            // Populate selected technicians from API technicians list
            if (technicians && technicians.length > 0) {
                const techIds = technicians.map((t: any) => String(t.actual_id_karyawan || t.id_karyawan));
                setValue('nm_teknisi', techIds);
            }

            if (visit.image) {
                setImagePreview(`http://localhost:8000/assets/upload/afs/${visit.image}`);
            }
        }
    }, [visit, technicians, setValue]);

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
            formDataPayload.append('lkt_code', lktCode);
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
                'Simpan Perubahan?',
                'Apakah Anda yakin akan menyimpan perubahan data realisasi visit ini?',
                async () => {
                    const res = await updateMutation.mutateAsync({ subCode: formattedSubCode, formData: formDataPayload });
                    if (res.status === 'success' || res.message) {
                        showAlert.success('Berhasil!', 'Data Realisasi Kunjungan Berhasil Diubah');
                        navigate(`/lkt/${cleanLktCode}/edit`);
                    }
                }
            );
        } catch (error: any) {
            console.error('Failed to update visit realisasi:', error);
            showAlert.error('Gagal', error?.response?.data?.message || 'Terjadi kesalahan saat menyimpan realisasi');
        }
    };

    // Add actual spare part used in visit
    const handleAddPartVisit = async () => {
        if (!addPartName || addQtyPart <= 0 || addHargaEs < 0) {
            showAlert.error('Error', 'Silakan isi Nama Part, Qty, dan Harga dengan benar.');
            return;
        }

        try {
            await savePartVisitMutation.mutateAsync({
                lkt_code: lktCode,
                id_visit: formattedSubCode,
                add_part_name: addPartName,
                add_qty_part: addQtyPart,
                add_harga_es: addHargaEs
            });
            showAlert.success('Berhasil!', 'Part Realisasi Berhasil Disimpan');
            setAddPartName('');
            setAddQtyPart(0);
            setAddHargaEs(0);
            refetch();
        } catch (error: any) {
            showAlert.error('Gagal', error?.response?.data?.message || 'Gagal menyimpan part realisasi');
        }
    };

    if (isVisitLoading || isFormLoading) {
        return <div className="text-center py-12 text-gray-400">Loading visit details...</div>;
    }

    const backUrl = `/lkt/${cleanLktCode}/edit`;
    const location = useLocation();
    const mode = new URLSearchParams(location.search).get('mode') || 'detail';
    const isEditing = mode === 'edit';
    const isDraft = visit?.status?.toUpperCase() === 'DRAFT';
    const isCancelled = Number(visit?.f_cancel) === 1;
    const canEdit = isDraft && !isCancelled && isEditing;

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
                            <span>{lktCode}</span>
                        </div>
                    </div>
                </div>

                {/* Subtitle / Title Action */}
                <div className="text-left mb-2 flex items-center justify-between">
                    <h5 className="text-[18px] font-bold text-gray-800 tracking-wide">
                        Edit Laporan Visit
                    </h5>
                    <span className={`px-2.5 py-1 rounded text-xs font-bold border ${
                        isCancelled 
                            ? 'bg-red-50 text-red-600 border-red-200' 
                            : isDraft 
                            ? 'bg-blue-50 text-blue-600 border-blue-200'
                            : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                    }`}>
                        STATUS: {isCancelled ? 'CANCEL' : visit?.status?.toUpperCase()}
                    </span>
                </div>

                {/* Back & Save Button Row */}
                <div className="flex justify-start items-center mb-6">
                    <div className="flex gap-2">
                        {!isEditing && (
                            <button
                                type="button"
                                onClick={() => navigate(backUrl)}
                                className="bg-[#5bc0de] hover:bg-[#46b8da] text-white px-3 py-1.5 rounded-[3px] text-[13px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-[#46b8da]"
                            >
                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                    <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z" />
                                </svg>
                                Back
                            </button>
                        )}

                        {isEditing && (
                            <button
                                type="button"
                                onClick={() => {
                                    const subCode = visit?.lkt_sub_code || visit?.id_visit || '';
                                    navigate(`/lkt/realisasi/${String(subCode).replace(/\//g, '.')}/edit${cleanLktCode ? `?lkt=${cleanLktCode}` : ''}`);
                                }}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1.5 rounded-[3px] text-[13px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-gray-400"
                            >
                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                    <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z" />
                                </svg>
                                Cancel
                            </button>
                        )}
                        
                        {!isEditing && isDraft && !isCancelled && (
                            <button
                                type="button"
                                onClick={() => navigate(`?mode=edit&lkt=${cleanLktCode}`)}
                                className="bg-[#f0ad4e] hover:bg-[#ec971f] text-white px-3.5 py-1.5 rounded-[3px] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#eea236]"
                            >
                                <svg className="w-3.5 h-3.5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                                Edit
                            </button>
                        )}

                        {canEdit && (
                            <button
                                type="submit"
                                form="realisasi-edit-form"
                                disabled={updateMutation.isPending}
                                className="bg-[#5cb85c] hover:bg-[#449d44] text-white px-3.5 py-1.5 rounded-[3px] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#4cae4c] disabled:opacity-50"
                            >
                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                    <path d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
                                </svg>
                                {updateMutation.isPending ? 'Saving...' : 'Save'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Form Section */}
                <form id="realisasi-edit-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    <div className="text-left mb-4">
                        <h4 className="text-[16px] font-bold text-gray-800 tracking-wide">
                            Laporan Kerusakan
                        </h4>
                    </div>

                    <RealisasiFormFields
                        visitData={visit}
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        canEdit={canEdit}
                        groupedKaryawan={groupedKaryawan}
                        watchTeknisi={watchTeknisi}
                        handleImageChange={handleImageChange}
                        imagePreview={imagePreview}
                    />
                </form>

                {/* Actual Spare Part Detail Table (Interactive Part details) */}
                <SparePartTable
                    parts={parts}
                    canEdit={canEdit}
                    addPartName={addPartName}
                    setAddPartName={setAddPartName}
                    addQtyPart={addQtyPart}
                    setAddQtyPart={setAddQtyPart}
                    addHargaEs={addHargaEs}
                    setAddHargaEs={setAddHargaEs}
                    handleAddPartVisit={handleAddPartVisit}
                    isPending={savePartVisitMutation.isPending}
                />
            </div>
        </div>
    );
}
