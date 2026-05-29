import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import LktForm from '../forms/LktForm';
import LktRealisasiListPage from './LktRealisasiListPage';
import { showAlert } from '../../../components/SweetAlert';
import {
    useGetLktDetail,
    useUpdateLkt,
    useConfirmLkt,
    useCloseLkt,
    useCancelLkt,
    useSavePart
} from '../hooks/useLkt';
import { lktSchema, type LktSchemaInput } from '../validation/lktSchema';

export default function LktEditPage() {
    const { code } = useParams<{ code: string }>();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState<'perbaikan' | 'realisasi'>('perbaikan');

    // Spare part input fields state
    const [addPartName, setAddPartName] = useState('');
    const [addQtyPart, setAddQtyPart] = useState<number>(0);
    const [addHargaEs, setAddHargaEs] = useState<number>(0);

    // Decode URL safe format to standard code
    const formattedLktCode = code ? code.replace(/\./g, '/') : '';

    // Queries & Mutations
    const { data: detailResponse, isLoading, isError, refetch } = useGetLktDetail(formattedLktCode);
    const updateMutation = useUpdateLkt();
    const confirmMutation = useConfirmLkt();
    const closeMutation = useCloseLkt();
    const cancelMutation = useCancelLkt();
    const savePartMutation = useSavePart();

    // Data wrappers
    const lkt = detailResponse?.data || detailResponse;
    const visits = detailResponse?.visits || [];
    const parts = detailResponse?.parts || [];
    const technicians = detailResponse?.technicians || [];
    const allCancelled = detailResponse?.all_cancelled || false;
    const anyClosed = detailResponse?.any_closed || false;

    if (isLoading) {
        return <div className="text-center py-12 text-gray-400">Loading LKT details...</div>;
    }

    if (isError || !lkt) {
        return (
            <div className="bg-rose-900/20 text-rose-400 p-6 rounded-lg border border-rose-800 m-6 text-left">
                Failed to load LKT details. Please verify the URL.
            </div>
        );
    }

    const cstCode = lkt.cst_code || '';
    const cleanCstCode = cstCode.replace(/\//g, '.');
    const backUrl = `/cst/${cleanCstCode}/edit`;

    // AFS Logic Variables
    const statusTampil = lkt.flag_done || 'Draft';
    const isDraft = statusTampil === 'Draft';
    const isCancelled = Number(lkt.f_cancel) === 1;
    const showPrintBarcode = lkt.mesin_lama === '1' || lkt.mesin_lama === 1;
    const showPrintBast = lkt.sts_pasang === '1' || lkt.sts_pasang === 1;

    // Checks if closing requires BAST upload
    const allowClose = anyClosed && !visits.some((v: any) => v.f_cancel === 0 && (v.status === 'Draft' || v.status === 'ON PROGRESS'));

    // Handle Form Submit (Update LKT)
    const handleFormSubmit = async (values: LktSchemaInput, imageFile: File | null) => {
        try {
            const formData = new FormData();
            formData.append('cst_code', cstCode);
            formData.append('lkt_code', formattedLktCode);
            formData.append('starting_date', values.starting_date);
            formData.append('description', values.description);
            formData.append('estimation_day', String(values.estimation_day));
            formData.append('transport_amount', String(values.transport_amount));
            formData.append('actual_transport', values.actual_transport);
            formData.append('accommodation_amount', String(values.accommodation_amount));
            formData.append('service_amount', String(values.service_amount));

            if (imageFile) {
                formData.append('link_foto', imageFile);
            }

            showAlert.confirm(
                'Simpan Edit?',
                'Simpan untuk merubah data LKT ini!',
                async () => {
                    const res = await updateMutation.mutateAsync({ lktCode: formattedLktCode, formData });
                    if (res.status === 'success' || res.message) {
                        showAlert.success('Berhasil!', 'Data LKT Berhasil Diubah');
                        setIsEditing(false);
                        refetch();
                    }
                }
            );
        } catch (error: any) {
            console.error('Failed to update LKT:', error);
            showAlert.error('Gagal', error?.response?.data?.message || 'Terjadi kesalahan saat menyimpan data LKT');
        }
    };

    // Actions
    const handleConfirm = () => {
        showAlert.confirm(
            'Konfirmasi?',
            'Apakah Anda yakin akan mengonfirmasi LKT ini?',
            async () => {
                try {
                    await confirmMutation.mutateAsync({ lktCode: formattedLktCode, cstCode });
                    showAlert.success('Berhasil!', 'Konfirmasi Draft LKT Berhasil');
                    refetch();
                } catch (error: any) {
                    showAlert.error('Gagal', error?.response?.data?.message || 'Gagal mengonfirmasi LKT');
                }
            }
        );
    };

    const handleClose = () => {
        showAlert.confirm(
            'Close LKT?',
            'Apakah Anda yakin akan menyelesaikan (CLOSE) LKT ini?',
            async () => {
                try {
                    await closeMutation.mutateAsync(formattedLktCode);
                    showAlert.success('Berhasil!', 'Close LKT Berhasil');
                    refetch();
                } catch (error: any) {
                    showAlert.error('Gagal', error?.response?.data?.message || 'Gagal menyelesaikan LKT');
                }
            }
        );
    };

    const handleCancel = () => {
        showAlert.confirm(
            'Batal LKT?',
            'Apakah Anda yakin akan membatalkan (CANCEL) LKT ini?',
            async () => {
                try {
                    await cancelMutation.mutateAsync(formattedLktCode);
                    showAlert.success('Berhasil!', 'Data LKT Berhasil di-Cancel');
                    refetch();
                } catch (error: any) {
                    showAlert.error('Gagal', error?.response?.data?.message || 'Gagal membatalkan LKT');
                }
            }
        );
    };

    // Add planned spare part
    const handleAddPart = async () => {
        if (!addPartName || addQtyPart <= 0 || addHargaEs < 0) {
            showAlert.error('Error', 'Silakan isi Nama Part, Qty, dan Harga Estimasi dengan benar.');
            return;
        }

        try {
            await savePartMutation.mutateAsync({
                lkt_code: formattedLktCode,
                add_part_name: addPartName,
                add_qty_part: addQtyPart,
                add_harga_es: addHargaEs
            });
            showAlert.success('Berhasil!', 'Part Estimasi Berhasil Disimpan');
            setAddPartName('');
            setAddQtyPart(0);
            setAddHargaEs(0);
            refetch();
        } catch (error: any) {
            showAlert.error('Gagal', error?.response?.data?.message || 'Gagal menyimpan part estimasi');
        }
    };

    // Print placeholders (Non-API browser windows)
    const handlePrint = (type: 'label' | 'barcode' | 'bast' | 'travel') => {
        const cleanLktCode = formattedLktCode.replace(/\//g, '.');
        let printPath = '';
        switch (type) {
            case 'label':
                printPath = `/lkt/print_label/${cleanLktCode}`;
                break;
            case 'barcode':
                printPath = `/lkt/print_barcode/${cleanLktCode}`;
                break;
            case 'bast':
                printPath = `/lkt/print_bast/${cleanLktCode}`;
                break;
            case 'travel':
                printPath = `/lkt/travel_permit/${cleanLktCode}`;
                break;
        }
        window.open(`http://localhost:8000${printPath}`, '_blank');
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
    };

    const getStatusTextLabel = () => {
        if (isCancelled) {
            return <h6 className="text-[14px] font-bold text-red-500 italic select-none">Status : (CANCEL)</h6>;
        }
        switch (statusTampil.toUpperCase()) {
            case 'DRAFT':
                return <h6 className="text-[14px] font-bold text-blue-500 italic select-none">Status : (DRAFT)</h6>;
            case 'ON PROGRESS':
                return <h6 className="text-[14px] font-bold text-amber-500 italic select-none">Status : (IN PROGRESS)</h6>;
            case 'DONE':
                return <h6 className="text-[14px] font-bold text-emerald-500 italic select-none">Status : (DONE)</h6>;
            default:
                return <h6 className="text-[14px] font-bold text-gray-500 italic select-none">Status : ({statusTampil})</h6>;
        }
    };

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
                    EMM Service / LKT / Detail LKT
                </div>
            </div>

            {/* Tabs selection: Laporan Perbaikan & Realisasi Service */}
            <div className="flex items-center gap-1.5 text-xs font-bold mb-4 text-left">
                <button
                    type="button"
                    onClick={() => setActiveTab('perbaikan')}
                    className={`px-5 py-2.5 border-t border-l border-r rounded-t-[4px] transition-all duration-250 cursor-pointer font-bold outline-none ${
                        activeTab === 'perbaikan'
                            ? 'bg-[#faedef] border-[#ebccd1] text-[#a94442] shadow-sm translate-y-[1px] border-b-transparent'
                            : 'bg-white border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    Laporan Perbaikan
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('realisasi')}
                    className={`px-5 py-2.5 border-t border-l border-r rounded-t-[4px] transition-all duration-250 cursor-pointer font-bold outline-none ${
                        activeTab === 'realisasi'
                            ? 'bg-[#f0fbff] border-[#bce8f1] text-[#31708f] shadow-sm translate-y-[1px] border-b-transparent'
                            : 'bg-white border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    Realisasi Service
                </button>
            </div>

            {/* Panel wrapper with tab-specific background */}
            <div className={`p-6 rounded-[4px] border shadow-sm transition-all duration-300 ${
                activeTab === 'perbaikan'
                    ? 'bg-[#faedef]/30 border-[#ebccd1]'
                    : 'bg-[#f0fbff]/30 border-[#bce8f1]'
            }`}>
                {activeTab === 'perbaikan' ? (
                    <div className="space-y-6">
                        {/* Action Bar (Top) */}
                        <div className="text-left mb-6">
                            <div className="flex flex-wrap gap-2 items-center">
                                {/* View mode actions */}
                                {!isEditing && (
                                    <>
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

                                        {!isCancelled && isDraft && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsEditing(true)}
                                                    className="bg-[#f0ad4e] hover:bg-[#ec971f] text-white px-3.5 py-1.5 rounded-[3px] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#eea236]"
                                                >
                                                    <svg className="w-3.5 h-3.5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                    </svg>
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={handleConfirm}
                                                    className="bg-[#5cb85c] hover:bg-[#449d44] text-white px-3.5 py-1.5 rounded-[3px] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#4cae4c]"
                                                >
                                                    <svg className="w-3.5 h-3.5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                    </svg>
                                                    Confirm
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={handleCancel}
                                                    className="bg-[#d9534f] hover:bg-[#c9302c] text-white px-3.5 py-1.5 rounded-[3px] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#d43f3a]"
                                                >
                                                    <svg className="w-3.5 h-3.5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    Cancel
                                                </button>
                                            </>
                                        )}

                                        {!isCancelled && statusTampil === 'ON PROGRESS' && (
                                            <>
                                                {allowClose ? (
                                                    showPrintBast ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => navigate(`/lkt/upload-bast/${code}`)}
                                                            className="bg-[#5cb85c] hover:bg-[#449d44] text-white px-3.5 py-1.5 rounded-[3px] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#4cae4c]"
                                                        >
                                                            <svg className="w-3.5 h-3.5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                            </svg>
                                                            Close
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={handleClose}
                                                            className="bg-[#5cb85c] hover:bg-[#449d44] text-white px-3.5 py-1.5 rounded-[3px] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#4cae4c]"
                                                        >
                                                            <svg className="w-3.5 h-3.5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                            </svg>
                                                            Close
                                                        </button>
                                                    )
                                                ) : null}

                                                {allCancelled && (
                                                    <button
                                                        type="button"
                                                        onClick={handleCancel}
                                                        className="bg-[#d9534f] hover:bg-[#c9302c] text-white px-3.5 py-1.5 rounded-[3px] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#d43f3a]"
                                                    >
                                                        <svg className="w-3.5 h-3.5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                        Cancel
                                                    </button>
                                                )}
                                            </>
                                        )}

                                        {/* Print helpers */}
                                        <button
                                            type="button"
                                            onClick={() => handlePrint('label')}
                                            className="bg-[#343a40] hover:bg-[#23272b] text-white px-3.5 py-1.5 rounded-[3px] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#23272b]"
                                        >
                                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                                <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
                                            </svg>
                                            Print Label
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handlePrint('travel')}
                                            className="bg-[#5bc0de] hover:bg-[#31b0d5] text-white px-3.5 py-1.5 rounded-[3px] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#46b8da]"
                                        >
                                            <svg className="w-3.5 h-3.5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                            </svg>
                                            Perjalanan Dinas
                                        </button>

                                        {showPrintBarcode && (
                                            <button
                                                type="button"
                                                onClick={() => handlePrint('barcode')}
                                                className="bg-[#343a40] hover:bg-[#23272b] text-white px-3.5 py-1.5 rounded-[3px] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#23272b]"
                                            >
                                                <svg className="w-3.5 h-3.5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5zM13.5 15.625c0-.621.504-1.125 1.125-1.125H18c.621 0 1.125.504 1.125 1.125v3c0 .621-.504 1.125-1.125 1.125h-3.375a1.125 1.125 0 01-1.125-1.125v-3z" />
                                            </svg>
                                            Print Barcode
                                        </button>
                                    )}

                                    {showPrintBast && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => handlePrint('bast')}
                                                className="bg-[#343a40] hover:bg-[#23272b] text-white px-3.5 py-1.5 rounded-[3px] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#23272b]"
                                            >
                                                <svg className="w-3.5 h-3.5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                                </svg>
                                                Print BAST
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => navigate(`/lkt/view-bast/${cleanCstCode}`)}
                                                className="bg-[#343a40] hover:bg-[#23272b] text-white px-3.5 py-1.5 rounded-[3px] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#23272b]"
                                            >
                                                <svg className="w-3.5 h-3.5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                                </svg>
                                                View BAST
                                            </button>
                                        </>
                                    )}
                                </>
                            )}

                            {/* Edit mode actions */}
                            {isEditing && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="bg-[#428bca] hover:bg-[#3071a9] text-white px-3.5 py-1.5 rounded-[3px] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#357ebd]"
                                    >
                                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                            <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z" />
                                        </svg>
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        form="lkt-form"
                                        disabled={updateMutation.isPending}
                                        className="bg-[#5cb85c] hover:bg-[#449d44] text-white px-3.5 py-1.5 rounded-[3px] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#4cae4c] disabled:opacity-50"
                                    >
                                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                            <path d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
                                        </svg>
                                        {updateMutation.isPending ? 'Saving...' : 'Save'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="text-left mb-4">
                        {getStatusTextLabel()}
                    </div>

                    {isEditing ? (
                        /* Edit Mode using dynamic LktForm */
                        <LktForm
                            initialLktData={lkt}
                            onSubmit={handleFormSubmit}
                        />
                    ) : (
                        /* View Mode matching vformlkt_before2.php exactly */
                        <div className="space-y-6">
                            {/* Row 1: Catatan Details & Image */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-left">
                                {/* Left Details Table */}
                                <div className="border border-[#e7eaec] rounded-[4px] overflow-hidden bg-white h-fit shadow-sm">
                                    <table className="w-full text-xs text-gray-800 border-collapse table-fixed">
                                        <tbody>
                                            <tr className="bg-white">
                                                <td className="py-3 px-4 font-bold text-gray-700 w-[30%] text-left bg-[#f3f3f4] border-r border-b border-[#e7eaec] align-middle">
                                                    Catatan Kerusakan
                                                </td>
                                                <td className="py-3 px-1 text-center w-[5%] bg-[#f3f3f4] border-r border-b border-[#e7eaec] align-middle">:</td>
                                                <td className="py-3 px-4 text-gray-900 font-semibold whitespace-pre-wrap text-left border-b border-[#e7eaec] align-middle">
                                                    {lkt.lap_kerusakan || '-'}
                                                </td>
                                            </tr>
                                            <tr className="bg-white">
                                                <td className="py-3 px-4 font-bold text-gray-700 text-left bg-[#f3f3f4] border-r border-b border-[#e7eaec] align-top pt-4">
                                                    Tambahan Catatan Kerusakan
                                                </td>
                                                <td className="py-3 px-1 text-center bg-[#f3f3f4] border-r border-b border-[#e7eaec] align-top pt-4">:</td>
                                                <td className="py-3 px-4 text-left align-middle border-b border-[#e7eaec]">
                                                    <textarea
                                                        readOnly
                                                        value={lkt.description || ''}
                                                        rows={3}
                                                        className="w-full bg-gray-50 text-gray-800 border border-gray-300 rounded-[3px] px-2.5 py-1.5 focus:outline-none font-normal outline-none"
                                                    />
                                                </td>
                                            </tr>
                                            <tr className="bg-white">
                                                <td className="py-3 px-4 font-bold text-gray-700 text-left bg-[#f3f3f4] border-r border-[#e7eaec] align-middle">
                                                    Nama Teknisi
                                                </td>
                                                <td className="py-3 px-1 text-center bg-[#f3f3f4] border-r border-[#e7eaec] align-middle">:</td>
                                                <td className="py-3 px-4 text-left align-middle font-semibold text-gray-900">
                                                    {technicians.length > 0 ? (
                                                        <div className="flex flex-wrap gap-1">
                                                            {technicians.map((t: any, index: number) => (
                                                                <span key={t.id_karyawan || index} className="bg-gray-100 border border-gray-300 px-2 py-0.5 rounded-[3px]">
                                                                    {t.nm_karyawan}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        '-'
                                                    )}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Right Details Table (Clickable Image Preview) */}
                                <div className="border border-[#e7eaec] rounded-[4px] overflow-hidden bg-white h-fit shadow-sm">
                                    <table className="w-full text-xs text-gray-850 border-collapse table-fixed">
                                        <tbody>
                                            <tr className="bg-white">
                                                <td className="py-3 px-4 font-bold text-gray-700 w-[30%] text-left bg-[#f3f3f4] border-r border-[#e7eaec] align-top pt-4">
                                                    Images
                                                </td>
                                                <td className="py-3 px-1 text-center w-[5%] bg-[#f3f3f4] border-r border-[#e7eaec] align-top pt-4">:</td>
                                                <td className="py-3 px-4 text-left align-middle">
                                                    <div className="py-1">
                                                        <label className="cursor-pointer">
                                                            <img
                                                                src={lkt.image ? `http://localhost:8000/assets/upload/afs/${lkt.image}` : 'http://localhost:8000/assets/images/placeholder.png'}
                                                                alt="LKT Preview"
                                                                className="w-[120px] h-[120px] object-cover border border-gray-300 rounded hover:opacity-85 transition-opacity"
                                                                onDoubleClick={(e) => {
                                                                    const target = e.target as HTMLImageElement;
                                                                    window.open(target.src, '_blank');
                                                                }}
                                                                onClick={(e) => {
                                                                    const target = e.target as HTMLImageElement;
                                                                    window.open(target.src, '_blank');
                                                                }}
                                                            />
                                                        </label>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Row 2: Estimations and Amounts */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-2 text-left">
                                {/* Left Estimation Table */}
                                <div className="border border-[#e7eaec] rounded-[4px] overflow-hidden bg-white h-fit shadow-sm">
                                    <table className="w-full text-xs text-gray-850 border-collapse table-fixed">
                                        <tbody>
                                            <tr className="bg-white">
                                                <td className="py-3 px-4 font-bold text-gray-700 w-[30%] text-left bg-[#f3f3f4] border-r border-b border-[#e7eaec] align-middle">
                                                    Estimation Day
                                                </td>
                                                <td className="py-3 px-1 text-center w-[5%] bg-[#f3f3f4] border-r border-b border-[#e7eaec] align-middle">:</td>
                                                <td className="py-3 px-4 text-left border-b border-[#e7eaec] align-middle font-semibold text-gray-900">
                                                    {lkt.estimation_day || 0}
                                                </td>
                                            </tr>
                                            <tr className="bg-white">
                                                <td className="py-3 px-4 font-bold text-gray-700 text-left bg-[#f3f3f4] border-r border-b border-[#e7eaec] align-middle">
                                                    Service Amount
                                                </td>
                                                <td className="py-3 px-1 text-center bg-[#f3f3f4] border-r border-b border-[#e7eaec] align-middle">:</td>
                                                <td className="py-3 px-4 text-left border-b border-[#e7eaec] align-middle font-mono font-semibold text-gray-900">
                                                    Rp {Number(lkt.service_amount || 0).toLocaleString('id-ID')}
                                                </td>
                                            </tr>
                                            <tr className="bg-white">
                                                <td className="py-3 px-4 font-bold text-gray-700 text-left bg-[#f3f3f4] border-r border-[#e7eaec] align-middle">
                                                    Type Transport
                                                </td>
                                                <td className="py-3 px-1 text-center bg-[#f3f3f4] border-r border-[#e7eaec] align-middle">:</td>
                                                <td className="py-3 px-4 text-left align-middle font-semibold text-gray-900">
                                                    {lkt.actual_transport || '-'}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Right Estimation Table */}
                                <div className="border border-[#e7eaec] rounded-[4px] overflow-hidden bg-white h-fit shadow-sm">
                                    <table className="w-full text-xs text-gray-850 border-collapse table-fixed">
                                        <tbody>
                                            <tr className="bg-white">
                                                <td className="py-3 px-4 font-bold text-gray-700 w-[30%] text-left bg-[#f3f3f4] border-r border-b border-[#e7eaec] align-middle">
                                                    Serial Number
                                                </td>
                                                <td className="py-3 px-1 text-center w-[5%] bg-[#f3f3f4] border-r border-b border-[#e7eaec] align-middle">:</td>
                                                <td className="py-3 px-4 text-left border-b border-[#e7eaec] align-middle font-semibold text-gray-900">
                                                    {lkt.barcode || '-'}
                                                </td>
                                            </tr>
                                            <tr className="bg-white">
                                                <td className="py-3 px-4 font-bold text-gray-700 text-left bg-[#f3f3f4] border-r border-b border-[#e7eaec] align-middle">
                                                    Start Date
                                                </td>
                                                <td className="py-3 px-1 text-center bg-[#f3f3f4] border-r border-b border-[#e7eaec] align-middle">:</td>
                                                <td className="py-3 px-4 text-left border-b border-[#e7eaec] align-middle font-semibold text-gray-600">
                                                    {formatDate(lkt.starting_date)}
                                                </td>
                                            </tr>
                                            <tr className="bg-white">
                                                <td className="py-3 px-4 font-bold text-gray-700 text-left bg-[#f3f3f4] border-r border-b border-[#e7eaec] align-middle">
                                                    Transport
                                                </td>
                                                <td className="py-3 px-1 text-center bg-[#f3f3f4] border-r border-b border-[#e7eaec] align-middle">:</td>
                                                <td className="py-3 px-4 text-left border-b border-[#e7eaec] align-middle font-mono font-semibold text-gray-900">
                                                    Rp {Number(lkt.transport_amount || 0).toLocaleString('id-ID')}
                                                </td>
                                            </tr>
                                            <tr className="bg-white">
                                                <td className="py-3 px-4 font-bold text-gray-700 text-left bg-[#f3f3f4] border-r border-b border-[#e7eaec] align-middle">
                                                    Accommodation
                                                </td>
                                                <td className="py-3 px-1 text-center bg-[#f3f3f4] border-r border-b border-[#e7eaec] align-middle">:</td>
                                                <td className="py-3 px-4 text-left border-b border-[#e7eaec] align-middle font-mono font-semibold text-gray-900">
                                                    Rp {Number(lkt.accommodation_amount || 0).toLocaleString('id-ID')}
                                                </td>
                                            </tr>
                                            <tr className="bg-white">
                                                <td className="py-3 px-4 font-bold text-gray-700 text-left bg-[#f3f3f4] border-r border-[#e7eaec] align-middle">
                                                    Keterangan SO
                                                </td>
                                                <td className="py-3 px-1 text-center bg-[#f3f3f4] border-r border-[#e7eaec] align-middle">:</td>
                                                <td className="py-3 px-4 text-left align-middle font-medium text-gray-800">
                                                    {lkt.so_keterangan || lkt.keterangan || '-'}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Planned Spare Part Details Table */}
                            <div className="pt-4 text-left">
                                <h4 className="text-base font-bold text-gray-800 mb-3">Spare Part Detail</h4>
                                <div className="border border-[#e7eaec] rounded-[4px] overflow-hidden bg-white shadow-sm">
                                    <table className="w-full text-xs text-gray-800 border-collapse">
                                        <thead className="bg-[#f3f3f4] border-b border-[#e7eaec] text-gray-700 font-bold">
                                            <tr>
                                                <th className="py-2.5 px-4 text-center border-r border-[#e7eaec] w-12">No</th>
                                                <th className="py-2.5 px-4 text-left border-r border-[#e7eaec]">Nama Spare Part</th>
                                                <th className="py-2.5 px-4 text-center border-r border-[#e7eaec] w-24">Qty</th>
                                                <th className="py-2.5 px-4 text-right border-r border-[#e7eaec] w-48">Harga Estimasi</th>
                                                <th className="py-2.5 px-4 text-right w-48">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#e7eaec]">
                                            {parts.length > 0 ? (
                                                parts.map((p: any, idx: number) => (
                                                    <tr key={p.id || idx} className="hover:bg-gray-50/50 transition-colors">
                                                        <td className="py-2.5 px-4 text-center border-r border-[#e7eaec] text-gray-500 font-medium">{idx + 1}</td>
                                                        <td className="py-2.5 px-4 border-r border-[#e7eaec] font-medium text-gray-900">{p.name}</td>
                                                        <td className="py-2.5 px-4 text-center border-r border-[#e7eaec] text-gray-800 font-medium">{p.qty}</td>
                                                        <td className="py-2.5 px-4 text-right border-r border-[#e7eaec] font-mono text-gray-700">Rp {Number(p.harga || 0).toLocaleString('id-ID')}</td>
                                                        <td className="py-2.5 px-4 text-right font-mono font-semibold text-gray-900">Rp {Number(p.total || 0).toLocaleString('id-ID')}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={5} className="py-8 text-center text-gray-400 font-medium">No spare parts added yet</td>
                                                </tr>
                                            )}

                                            {/* Inline Add Part Form (Only visible in Draft status) */}
                                            {isDraft && !isCancelled && (
                                                <tr className="bg-emerald-50/30">
                                                    <td className="py-2 px-4 text-center border-r border-[#e7eaec] font-bold text-emerald-600">+</td>
                                                    <td className="py-2 px-4 border-r border-[#e7eaec]">
                                                        <input
                                                            type="text"
                                                            placeholder="Masukkan nama spare part..."
                                                            value={addPartName}
                                                            onChange={(e) => setAddPartName(e.target.value)}
                                                            className="w-full bg-white text-gray-800 border border-gray-300 rounded-[3px] px-2.5 py-1 focus:outline-none focus:border-[#1ab394] font-normal"
                                                        />
                                                    </td>
                                                    <td className="py-2 px-4 border-r border-[#e7eaec]">
                                                        <input
                                                            type="number"
                                                            placeholder="Qty"
                                                            value={addQtyPart || ''}
                                                            onChange={(e) => setAddQtyPart(Number(e.target.value))}
                                                            className="w-full bg-white text-gray-800 border border-gray-300 rounded-[3px] px-2 py-1 text-center focus:outline-none focus:border-[#1ab394] font-normal"
                                                        />
                                                    </td>
                                                    <td className="py-2 px-4 border-r border-[#e7eaec] text-right">
                                                        <div className="flex items-center gap-1.5 justify-end">
                                                            <span className="text-gray-500 font-medium">Rp</span>
                                                            <input
                                                                type="number"
                                                                placeholder="Harga"
                                                                value={addHargaEs || ''}
                                                                onChange={(e) => setAddHargaEs(Number(e.target.value))}
                                                                className="w-32 bg-white text-gray-800 border border-gray-300 rounded-[3px] px-2 py-1 text-right focus:outline-none focus:border-[#1ab394] font-normal font-mono"
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="py-2 px-4 text-right">
                                                        <button
                                                            type="button"
                                                            onClick={handleAddPart}
                                                            disabled={savePartMutation.isPending}
                                                            className="bg-[#1ab394] hover:bg-[#18a689] text-white px-4 py-1.5 rounded-[3px] text-xs font-bold transition-colors cursor-pointer border border-[#18a689]"
                                                        >
                                                            {savePartMutation.isPending ? 'Adding...' : 'Add'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                    /* Realisasi Service List Component */
                    <LktRealisasiListPage
                        lktCode={formattedLktCode}
                        visits={visits}
                        lktStatus={statusTampil}
                        isLktCancelled={isCancelled}
                        onRefresh={refetch}
                    />
                )}
            </div>
        </div>
    );
}
