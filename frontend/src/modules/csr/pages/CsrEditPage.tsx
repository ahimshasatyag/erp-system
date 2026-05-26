import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CsrForm from '../forms/CsrForm';
import { showAlert } from '../../../components/SweetAlert';
import DescModal from '../../../components/DescModal';
import {
    useGetCsrDetail,
    useUpdateCsr,
    useConfirmCsr,
    useCancelCsr,
    useAddNewCst
} from '../hooks/useCsr';

export default function CsrEditPage() {
    const { code } = useParams<{ code: string }>();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);

    const { data: csr, isLoading, isError, refetch } = useGetCsrDetail(code || '');
    const updateMutation = useUpdateCsr();
    const confirmMutation = useConfirmCsr();
    const cancelMutation = useCancelCsr();
    const addNewCstMutation = useAddNewCst();

    if (isLoading) {
        return <div className="text-center py-12 text-gray-400">Loading CSR details...</div>;
    }

    if (isError || !csr) {
        return (
            <div className="bg-rose-900/20 text-rose-400 p-6 rounded-lg border border-rose-800">
                Failed to load CSR details. Please try again.
            </div>
        );
    }

    const handleUpdate = async (data: any) => {
        try {
            const payload = { ...data };
            if (data.link_foto && data.link_foto instanceof FileList && data.link_foto.length > 0) {
                payload.link_foto = data.link_foto[0];
            } else {
                delete payload.link_foto;
            }

            await updateMutation.mutateAsync({ csrCode: csr.csr_code, payload });
            showAlert.success('Berhasil', 'CSR updated successfully');
            setIsEditing(false);
            refetch();
        } catch (error: any) {
            console.error('Failed to update CSR:', error);
            showAlert.error('Gagal', error?.response?.data?.message || 'Failed to update CSR');
        }
    };

    const handleConfirm = async () => {
        showAlert.confirm(
            'Konfirmasi CSR',
            'Apakah Anda Yakin akan menkonfirmasi CSR ini ?',
            async () => {
                try {
                    await confirmMutation.mutateAsync({
                        csrCode: csr.csr_code,
                        customer: String(csr.id_customers),
                        product: String(csr.id_product)
                    });
                    showAlert.success('Berhasil', 'Konfirmasi CSR Berhasil');
                    refetch();
                } catch (error: any) {
                    console.error('Failed to confirm CSR:', error);
                    showAlert.error('Gagal', error?.response?.data?.message || 'Failed to confirm CSR');
                }
            }
        );
    };

    const handleCancelSubmit = async (reason: string) => {
        if (!reason.trim()) {
            showAlert.warning('Peringatan', 'Alasan cancel harus diisi');
            return;
        }
        try {
            await cancelMutation.mutateAsync({
                csrCode: csr.csr_code,
                customer: String(csr.id_customers),
                product: String(csr.id_product),
                memo: reason
            });
            showAlert.success('Berhasil', 'Cancel CSR Berhasil');
            setShowCancelDialog(false);
            refetch();
        } catch (error: any) {
            console.error('Failed to cancel CSR:', error);
            showAlert.error('Gagal', error?.response?.data?.message || 'Failed to cancel CSR');
        }
    };

    const handleAddNewCst = async () => {
        showAlert.confirm(
            'Tambah CST',
            'Are you sure you want to add a new CST for this CSR?',
            async () => {
                try {
                    await addNewCstMutation.mutateAsync(csr.csr_code);
                    showAlert.success('Berhasil', 'New CST added successfully');
                    refetch();
                } catch (error: any) {
                    console.error('Failed to add new CST:', error);
                    showAlert.error('Gagal', error?.response?.data?.message || 'Failed to add CST');
                }
            }
        );
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'DRAFT':
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-800 text-gray-400 border border-gray-700">Draft CSR</span>;
            case 'OUTSTANDING':
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-950/20 text-amber-500 border border-amber-800/40">Outstanding</span>;
            case 'CANCEL':
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-950/20 text-rose-500 border border-rose-800/40">CANCELED</span>;
            case 'DONE':
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/20 text-emerald-500 border border-emerald-800/40">DONE</span>;
            default:
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-950/20 text-blue-500 border border-blue-800/40">{status}</span>;
        }
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
    };

    const isWarrantyActive = () => {
        if (!csr.waranty_end) return false;
        const end = new Date(csr.waranty_end).getTime();
        const start = new Date(csr.csr_date || new Date()).getTime();
        return end >= start;
    };

    // Determine role & action buttons like PHP
    const showEditBtn = (csr.csr_status === 'DRAFT') || (csr.csr_status === 'OUTSTANDING' && csr.approved_csr_by === null);
    const showConfirmCancelBtn = showEditBtn;

    // Filter out dummy 'kosong' CST records to keep actual list clean
    const actualCstList = csr.cst_list ? csr.cst_list.filter((c: any) => c.cst_code !== 'kosong') : [];
    const allCstCancel = actualCstList.length > 0 && actualCstList.every((c: any) => c.status === 'CANCEL');
    const showAddCstBtn = (allCstCancel || actualCstList.length === 0) && csr.csr_status !== 'CANCEL' && !isEditing;

    return (
        <div className="w-full min-h-screen py-2 px-6 text-sm text-gray-800 dark:text-gray-300 transition-colors duration-200">
            {/* Header Title */}
            <div className="flex justify-between items-center mb-8 pt-2">
                <div>
                    <h2 className="text-[32px] font-normal text-gray-900 dark:text-white tracking-tight">
                        {isEditing ? `Edit CSR - ${csr.csr_code}` : csr.csr_code}
                    </h2>
                    <div className="flex items-center gap-3 mt-2">
                        {getStatusBadge(csr.csr_status)}
                        {csr.csr_approve_date && (
                            <span className="text-xs text-gray-500">Approved at {formatDate(csr.csr_approve_date)}</span>
                        )}
                    </div>
                </div>
                <div className="text-[13px] text-gray-500 font-medium">
                    EMM Service / CSR / {isEditing ? 'Edit' : 'Detail'}
                </div>
            </div>

            {/* Cancel Reason Dialog */}
            <DescModal
                isOpen={showCancelDialog}
                onClose={() => setShowCancelDialog(false)}
                onConfirm={handleCancelSubmit}
                title="Cancel CSR"
                placeholder="Alasan Cancel..."
            />

            {/* Unified Form & Action Toolbar Card */}
            <div className="max-w-4xl mb-8">
                <CsrForm
                    initialData={csr}
                    isViewMode={!isEditing}
                    isEditMode={isEditing}
                    onSubmit={handleUpdate}
                    isSubmitting={updateMutation.isPending}
                    actionToolbar={
                        isEditing ? (
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="bg-white dark:bg-[#161821] text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-5 py-2 rounded-lg text-xs font-bold border border-gray-300 dark:border-gray-855 hover:bg-gray-50 dark:hover:bg-[#232733] transition-all duration-200 cursor-pointer shadow-sm"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={updateMutation.isPending}
                                    className="bg-[#20c997] hover:bg-[#1ba87e] disabled:bg-[#20c997]/20 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all duration-200 disabled:cursor-not-allowed cursor-pointer shadow-md"
                                >
                                    {updateMutation.isPending ? (
                                        <div className="flex items-center gap-1.5">
                                            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Saving...
                                        </div>
                                    ) : 'Save CSR'}
                                </button>
                            </div>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={() => navigate('/csr')}
                                    className="bg-white dark:bg-[#161821] text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-5 py-2 rounded-lg text-xs font-bold border border-gray-300 dark:border-gray-855 hover:bg-gray-50 dark:hover:bg-[#232733] transition-all duration-200 cursor-pointer shadow-sm"
                                >
                                    Batal
                                </button>

                                {showEditBtn && (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(true)}
                                        className="bg-amber-600 hover:bg-amber-500 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer shadow-lg shadow-amber-950/20"
                                    >
                                        ✎ Edit
                                    </button>
                                )}

                                {showConfirmCancelBtn && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handleConfirm}
                                            disabled={confirmMutation.isPending}
                                            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer shadow-lg shadow-emerald-950/20"
                                        >
                                            ✓ Confirm
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowCancelDialog(true)}
                                            className="bg-rose-600 hover:bg-rose-500 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer shadow-lg shadow-rose-950/20"
                                        >
                                            ✗ Cancel
                                        </button>
                                    </>
                                )}
                            </>
                        )
                    }
                />
            </div>

            {/* 4. CST List Section */}
            <div className="bg-white dark:bg-[#1e202b] p-6 rounded-xl border border-gray-200 dark:border-gray-850 shadow-md space-y-4 mb-8 transition-colors duration-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800 text-xs">
                        <thead className="bg-gray-50 dark:bg-[#161821]">
                            <tr>
                                <th className="px-4 py-3 text-center font-bold text-gray-600 dark:text-gray-400 uppercase w-12 border-r border-gray-200 dark:border-gray-800">No</th>
                                <th className="px-4 py-3 text-left font-bold text-gray-600 dark:text-gray-400 uppercase border-r border-gray-200 dark:border-gray-800">CST Code</th>
                                <th className="px-4 py-3 text-center font-bold text-gray-600 dark:text-gray-400 uppercase border-r border-gray-200 dark:border-gray-800">Date</th>
                                <th className="px-4 py-3 text-left font-bold text-gray-600 dark:text-gray-400 uppercase border-r border-gray-200 dark:border-gray-800">Product Name</th>
                                <th className="px-4 py-3 text-left font-bold text-gray-600 dark:text-gray-400 uppercase border-r border-gray-200 dark:border-gray-800">Request</th>
                                <th className="px-4 py-3 text-left font-bold text-gray-600 dark:text-gray-400 uppercase border-r border-gray-200 dark:border-gray-800">User</th>
                                <th className="px-4 py-3 text-center font-bold text-gray-600 dark:text-gray-400 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-850">
                            {actualCstList.length > 0 ? (
                                actualCstList.map((cst: any, idx: number) => (
                                    <tr key={cst.id_afs_cst} className="hover:bg-gray-50/50 dark:hover:bg-[#20222e]/45 transition-colors">
                                        <td className="px-4 py-2 text-center text-gray-400 dark:text-gray-500 font-medium border-r border-gray-200 dark:border-gray-800/40">{idx + 1}</td>
                                        <td className="px-4 py-2 font-semibold text-rose-600 dark:text-rose-400 border-r border-gray-200 dark:border-gray-800/40">
                                            {cst.cst_code}
                                        </td>
                                        <td className="px-4 py-2 text-center text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-800/40">{formatDate(cst.cst_date)}</td>
                                        <td className="px-4 py-2 text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-800/40">{cst.code_product} - {cst.nm_product}</td>
                                        <td className="px-4 py-2 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-800/40">{cst.nm_karyawan}</td>
                                        <td className="px-4 py-2 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-800/40">{cst.approved_csr_by || '-'}</td>
                                        <td className="px-4 py-2 text-center">
                                            {cst.status === 'OUTSTANDING' && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-500 border border-amber-200 dark:border-amber-800/40">Outstanding</span>}
                                            {cst.status === 'ON PROGRESS' && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-500 border border-blue-200 dark:border-blue-800/40">In Progress</span>}
                                            {cst.status === 'DONE' && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-500 border border-emerald-200 dark:border-emerald-800/40">Done</span>}
                                            {cst.status === 'CANCEL' && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-500 border border-rose-200 dark:border-rose-800/40">Cancelled</span>}
                                            {cst.status === 'PENDING' && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">Pending</span>}
                                            {!cst.status && <span className="text-gray-400 dark:text-gray-500">-</span>}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-gray-400 dark:text-gray-500 font-medium">No CST data found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
