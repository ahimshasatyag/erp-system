import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CstForm from '../forms/CstForm';
import { showAlert } from '../../../components/SweetAlert';
import {
    useGetCstDetail,
    useCancelCst
} from '../hooks/useCst';

export default function CstEditPage() {
    const { code } = useParams<{ code: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'lkt' | 'expense'>('lkt');

    const { data: cst, isLoading, isError, refetch } = useGetCstDetail(code || '');
    const cancelMutation = useCancelCst();

    if (isLoading) {
        return <div className="text-center py-12 text-gray-400">Loading CST details...</div>;
    }

    if (isError || !cst) {
        return (
            <div className="bg-rose-900/20 text-rose-400 p-6 rounded-lg border border-rose-800">
                Failed to load CST details. Please try again.
            </div>
        );
    }



    const handleCancelCst = async () => {
        showAlert.confirm(
            'Cancel CST',
            'Apakah Anda Yakin akan membatalkan (CANCEL) CST ini ?',
            async () => {
                try {
                    await cancelMutation.mutateAsync(cst.cst_code);
                    showAlert.success('Berhasil', 'Cancel CST Berhasil');
                    refetch();
                } catch (error: any) {
                    console.error('Failed to cancel CST:', error);
                    showAlert.error('Gagal', error?.response?.data?.message || 'Failed to cancel CST');
                }
            }
        );
    };
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'OUTSTANDING':
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-950/20 text-amber-500 border border-amber-800/40">Outstanding</span>;
            case 'ON PROGRESS':
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-950/20 text-blue-500 border border-blue-800/40">In Progress</span>;
            case 'CANCEL':
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-950/20 text-rose-500 border border-rose-800/40">CANCELED</span>;
            case 'DONE':
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/20 text-emerald-500 border border-emerald-800/40">DONE</span>;
            case 'PENDING':
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-800 text-gray-400 border border-gray-700">Pending</span>;
            default:
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-950/20 text-gray-500 border border-gray-800/40">{status}</span>;
        }
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
    };

    const showCloseCancelBtn = (cst.status === 'OUTSTANDING' || cst.status === 'ON PROGRESS');
    const worksheets = cst.lkt_list || [];

    return (
        <div className="w-full min-h-screen py-3 px-6 text-sm text-gray-800 bg-gray-50/50">
            {/* Header Title & Breadcrumb */}
            <div className="flex justify-between items-center mb-8 pt-2 text-left">
                <div>
                    <h2 className="text-[32px] font-normal text-gray-900 dark:text-white tracking-tight text-left">
                        {cst.cst_code}
                    </h2>
                    <div className="flex items-center gap-3 mt-2 text-left">
                        {getStatusBadge(cst.status || 'OUTSTANDING')}
                        {cst.cst_done_date && (
                            <span className="text-xs text-gray-500">Completed at {formatDate(cst.cst_done_date)} by {cst.done_cst_by}</span>
                        )}
                    </div>
                </div>
                <div className="text-[13px] text-gray-500 font-medium text-left">
                    EMM Service / CST / Detail
                </div>
            </div>

            {/* Main Form Details Card */}
            <div className="bg-white p-6 rounded border border-gray-200 shadow-sm space-y-8 mb-6">
                <CstForm
                    initialData={cst}
                    actionToolbar={
                        <>
                            <button
                                type="button"
                                onClick={() => navigate('/cst')}
                                className="bg-white dark:bg-[#161821] text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-5 py-2 rounded-lg text-xs font-bold border border-gray-300 dark:border-gray-855 hover:bg-gray-50 dark:hover:bg-[#232733] transition-all duration-200 cursor-pointer shadow-sm"
                            >
                                Batal
                            </button>

                            {showCloseCancelBtn && (
                                <button
                                    type="button"
                                    onClick={handleCancelCst}
                                    disabled={cancelMutation.isPending}
                                    className="bg-rose-600 hover:bg-rose-500 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer shadow-lg shadow-rose-950/20"
                                >
                                    ✗ Cancel
                                </button>
                            )}
                        </>
                    }
                />

                {/* Tabs selection: LKT List & Expense */}
                <div className="space-y-4">
                    <div className="border-b border-gray-250 flex items-center gap-1 text-xs font-bold">
                        <button
                            type="button"
                            onClick={() => setActiveTab('lkt')}
                            className={`px-4 py-2 border-t border-l border-r rounded-t transition-colors ${activeTab === 'lkt' ? 'bg-white border-gray-250 border-b-transparent text-gray-800 translate-y-[1px]' : 'bg-gray-50 border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            LKT List
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('expense')}
                            className={`px-4 py-2 border-t border-l border-r rounded-t transition-colors ${activeTab === 'expense' ? 'bg-white border-gray-250 border-b-transparent text-gray-800 translate-y-[1px]' : 'bg-gray-50 border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            Expense
                        </button>
                    </div>

                    {/* LKT LIST TAB CONTENT */}
                    {activeTab === 'lkt' && (
                        <div className="space-y-3">
                            <div className="flex justify-start">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const cleanCstCode = (cst.cst_code || '').replace(/\//g, '.');
                                        navigate(`/lkt/create/${cleanCstCode}`);
                                    }}
                                    className="bg-[#1ab394] hover:bg-[#18a689] text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                                >
                                    <span className="text-sm leading-none font-extrabold">+</span> Add New
                                </button>
                            </div>
                            <div className="overflow-x-auto border border-gray-200 rounded">
                                <table className="min-w-full divide-y divide-gray-200 text-xs">
                                    <thead className="bg-gray-50 font-bold">
                                        <tr>
                                            <th className="px-4 py-2.5 text-center font-bold text-gray-600 border-r border-gray-200 w-12">No</th>
                                            <th className="px-4 py-2.5 text-left font-bold text-gray-600 border-r border-gray-200">LKT</th>
                                            <th className="px-4 py-2.5 text-center font-bold text-gray-600 border-r border-gray-200">Tgl LKT</th>
                                            <th className="px-4 py-2.5 text-left font-bold text-gray-600 border-r border-gray-200">Keterangan</th>
                                            <th className="px-4 py-2.5 text-right font-bold text-gray-600 border-r border-gray-200">Service Amount</th>
                                            <th className="px-4 py-2.5 text-right font-bold text-gray-600 border-r border-gray-200">Tot Biaya Sparepart</th>
                                            <th className="px-4 py-2.5 text-center font-bold text-gray-600">Satus</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {worksheets.length > 0 ? (
                                            worksheets.map((lkt: any, idx: number) => (
                                                <tr key={lkt.id_afs_lkt} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-4 py-2 text-center text-gray-500 font-medium border-r border-gray-200">{idx + 1}</td>
                                                    <td className="px-4 py-2 font-semibold text-rose-600 border-r border-gray-200">{lkt.lkt_code}</td>
                                                    <td className="px-4 py-2 text-center text-gray-600 border-r border-gray-200">{formatDate(lkt.lkt_date)}</td>
                                                    <td className="px-4 py-2 text-gray-800 border-r border-gray-200">{lkt.keterangan || lkt.lap_kerusakan || '-'}</td>
                                                    <td className="px-4 py-2 text-right border-r border-gray-200">Rp {Number(lkt.service_amount || 0).toLocaleString('id-ID')}</td>
                                                    <td className="px-4 py-2 text-right border-r border-gray-200">Rp {Number(lkt.sparepart_amount || lkt.total_sparepart || 0).toLocaleString('id-ID')}</td>
                                                    <td className="px-4 py-2 text-center">
                                                        {lkt.flag_done === 'DONE' ? (
                                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">DONE</span>
                                                        ) : (
                                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">{lkt.flag_done || 'PENDING'}</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={7} className="px-4 py-8 text-center text-gray-400 font-medium">No LKT found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* EXPENSE TAB CONTENT */}
                    {activeTab === 'expense' && (
                        <div className="space-y-3">
                            <div className="overflow-x-auto border border-gray-200 rounded">
                                <table className="min-w-full divide-y divide-gray-200 text-xs">
                                    <thead className="bg-gray-50 font-bold">
                                        <tr>
                                            <th className="px-4 py-2.5 text-center font-bold text-gray-600 border-r border-gray-200 w-12">No</th>
                                            <th className="px-4 py-2.5 text-center font-bold text-gray-600 border-r border-gray-200">Tgl</th>
                                            <th className="px-4 py-2.5 text-left font-bold text-gray-600 border-r border-gray-200">Keterangan</th>
                                            <th className="px-4 py-2.5 text-right font-bold text-gray-600 border-r border-gray-200">Nominal</th>
                                            <th className="px-4 py-2.5 text-center font-bold text-gray-600 border-r border-gray-200">Bukti</th>
                                            <th className="px-4 py-2.5 text-center font-bold text-gray-600 border-r border-gray-200">Status</th>
                                            <th className="px-4 py-2.5 text-center font-bold text-gray-600">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {/* Mocked empty rows as seen in design image */}
                                        <tr>
                                            <td colSpan={7} className="px-4 py-8 text-center text-gray-400 font-medium">No expense data found</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
