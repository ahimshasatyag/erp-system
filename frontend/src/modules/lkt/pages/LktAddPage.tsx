import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LktForm from '../forms/LktForm';
import { useGetCstDetailForLkt, useCreateLkt } from '../hooks/useLkt';
import { showAlert } from '../../../components/SweetAlert';
import { type LktSchemaInput } from '../validation/lktSchema';

export default function LktAddPage() {
    const { cstCode } = useParams<{ cstCode: string }>();
    const navigate = useNavigate();

    // Decode CST Code from dots to slashes
    const formattedCstCode = cstCode ? cstCode.replace(/\./g, '/') : '';

    const { data: cstResponse, isLoading, isError } = useGetCstDetailForLkt(formattedCstCode);
    const createMutation = useCreateLkt();

    const cst = cstResponse?.data || cstResponse;

    const handleFormSubmit = async (values: LktSchemaInput, imageFile: File | null) => {
        try {
            const formData = new FormData();
            formData.append('cst_code', formattedCstCode);
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

            const res = await createMutation.mutateAsync(formData);
            if (res.status === 'success') {
                showAlert.success('Berhasil', 'Data LKT Berhasil Disimpan');
                // Redirect back to CST Detail Edit Page
                const targetCstCode = formattedCstCode.replace(/\//g, '.');
                navigate(`/cst/${targetCstCode}/edit`);
            } else {
                showAlert.error('Gagal', res.message || 'Gagal menyimpan data LKT');
            }
        } catch (error: any) {
            console.error('Failed to create LKT:', error);
            showAlert.error('Gagal', error?.response?.data?.message || 'Terjadi kesalahan saat menyimpan data LKT');
        }
    };

    if (isLoading) {
        return <div className="text-center py-12 text-gray-400">Loading CST details for new LKT...</div>;
    }

    if (isError || !cst) {
        return (
            <div className="bg-rose-900/20 text-rose-400 p-6 rounded-lg border border-rose-800 m-6">
                Failed to load associated CST details. Please verify the URL.
            </div>
        );
    }

    const cancelUrl = `/cst/${cstCode}/edit`;

    return (
        <div className="w-full min-h-screen py-4 px-8 text-sm text-gray-800 bg-[#f3f3f4]">
            {/* Header Title & Breadcrumb */}
            <div className="flex justify-between items-start mb-6 text-left">
                <div className="flex flex-col">
                    <h2 className="text-[26px] font-bold text-gray-900 tracking-tight leading-tight">
                        {formattedCstCode}
                    </h2>
                    <div className="flex items-center text-[22px] font-bold text-gray-900 tracking-tight mt-1.5 ml-0.5">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" className="mr-1 text-black -mt-1.5" style={{ strokeLinecap: 'square' }}>
                            <path d="M6 2v14h14" />
                            <path d="M15 11l5 5-5 5" />
                        </svg>
                        <span>LKT-EMM/---/--/----</span>
                    </div>
                </div>
                <div className="text-[13px] text-gray-500 font-medium pt-1">
                    EMM Service / LKT / Tambah LKT
                </div>
            </div>

            {/* Subtitle & Buttons */}
            <div className="mb-6 text-left">
                <h3 className="text-base font-bold text-gray-800 mb-2">Tambah LKT</h3>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => navigate(cancelUrl)}
                        className="bg-[#428bca] hover:bg-[#3071a9] text-white px-3.5 py-1.5 rounded-[3px] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#357ebd]"
                    >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z" />
                        </svg>
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="lkt-form"
                        disabled={createMutation.isPending}
                        className="bg-[#1ab394] hover:bg-[#18a689] text-white px-3.5 py-1.5 rounded-[3px] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#18a689] disabled:opacity-50"
                    >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
                        </svg>
                        {createMutation.isPending ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>

            {/* Main Form Box (No outer card styling, direct table layout in LktForm) */}
            <LktForm
                initialCstData={cst}
                onSubmit={handleFormSubmit}
            />
        </div>
    );
}
