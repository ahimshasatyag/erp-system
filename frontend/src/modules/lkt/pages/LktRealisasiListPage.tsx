import React from 'react';
import { useNavigate } from 'react-router-dom';
import { showAlert } from '../../../components/SweetAlert';
import api from '../../../services/api';

interface LktRealisasiListPageProps {
    lktCode: string;
    visits: any[];
    lktStatus: string;
    isLktCancelled: boolean;
    onRefresh: () => void;
}

export default function LktRealisasiListPage({ lktCode, visits, lktStatus, isLktCancelled, onRefresh }: LktRealisasiListPageProps) {
    const navigate = useNavigate();

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
    };

    const getStatusBadge = (status: string, fCancel: number) => {
        if (Number(fCancel) === 1) {
            return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-600 border border-red-200">CANCEL</span>;
        }
        switch (status?.toUpperCase()) {
            case 'DRAFT':
                return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200">DRAFT</span>;
            case 'ON PROGRESS':
                return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">IN PROGRESS</span>;
            case 'CLOSE':
            case 'DONE':
                return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">CLOSE</span>;
            default:
                return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-50 text-gray-600 border border-gray-200">{status || '-'}</span>;
        }
    };

    const handleCancelVisit = async (subCode: string) => {
        showAlert.confirm(
            'Apakah anda yakin ?',
            'Anda akan Cancel Realisasi Visit ini!',
            async () => {
                try {
                    // Laravel route to cancel visit, matching PHP controller
                    await api.post(`/lkt/visit/cancel`, { lkt_sub_code: subCode });
                    showAlert.success('Berhasil!', 'Data Realisasi berhasil di-Cancel');
                    onRefresh();
                } catch (error: any) {
                    console.error('Failed to cancel visit:', error);
                    showAlert.error('Gagal', error?.response?.data?.message || 'Gagal membatalkan visit');
                }
            }
        );
    };

    // Realisasi service can be added when LKT status is 'ON PROGRESS' and LKT is not cancelled
    const showAddButton = lktStatus === 'ON PROGRESS' && !isLktCancelled;

    return (
        <div className="space-y-4">
            {/* Header row with Add New button */}
            <div className="flex justify-between items-center">
                <h4 className="text-base font-bold text-gray-800">Daftar Kunjungan Realisasi</h4>
                {showAddButton && (
                    <button
                        type="button"
                        onClick={() => {
                            const cleanCode = lktCode.replace(/\//g, '.');
                            navigate(`/lkt/realisasi/create/${cleanCode}`);
                        }}
                        className="bg-[#1ab394] hover:bg-[#18a689] text-white px-3.5 py-1.5 rounded-[3px] text-xs font-bold flex items-center gap-1 shadow-sm transition-colors border border-[#18a689] cursor-pointer"
                    >
                        <span className="text-sm leading-none font-extrabold">+</span> Add Realisasi
                    </button>
                )}
            </div>

            {/* Visits Table */}
            <div className="border border-[#e7eaec] rounded-[4px] overflow-hidden bg-white shadow-sm">
                <table className="w-full text-xs text-gray-800 border-collapse table-fixed">
                    <thead className="bg-[#f3f3f4] border-b border-[#e7eaec] text-gray-700 font-bold">
                        <tr>
                            <th className="py-2.5 px-4 text-center border-r border-[#e7eaec] w-12">No</th>
                            <th className="py-2.5 px-4 text-center border-r border-[#e7eaec] w-20">ID Visit</th>
                            <th className="py-2.5 px-4 text-center border-r border-[#e7eaec] w-28">Tgl Visit</th>
                            <th className="py-2.5 px-4 text-left border-r border-[#e7eaec]">Keterangan</th>
                            <th className="py-2.5 px-4 text-right border-r border-[#e7eaec] w-32">Jasa</th>
                            <th className="py-2.5 px-4 text-right border-r border-[#e7eaec] w-32">Transport</th>
                            <th className="py-2.5 px-4 text-right border-r border-[#e7eaec] w-32">Akomodasi</th>
                            <th className="py-2.5 px-4 text-right border-r border-[#e7eaec] w-32">Total</th>
                            <th className="py-2.5 px-4 text-center border-r border-[#e7eaec] w-28">Status</th>
                            <th className="py-2.5 px-4 text-center w-28">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e7eaec]">
                        {visits.length > 0 ? (
                            visits.map((visit: any, idx: number) => {
                                const isDraft = visit.status?.toUpperCase() === 'DRAFT';
                                const isCancelled = Number(visit.f_cancel) === 1;

                                return (
                                    <tr key={visit.id_afs_realisasi || idx} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-2.5 px-4 text-center border-r border-[#e7eaec] text-gray-500 font-medium">{idx + 1}</td>
                                        <td className="py-2.5 px-4 text-center border-r border-[#e7eaec] font-bold text-gray-900">{visit.lkt_sub_code}</td>
                                        <td className="py-2.5 px-4 text-center border-r border-[#e7eaec] text-gray-600 font-medium">{formatDate(visit.actual_starting_date)}</td>
                                        <td className="py-2.5 px-4 border-r border-[#e7eaec] text-left text-gray-800 whitespace-pre-wrap max-w-xs overflow-hidden text-ellipsis">{visit.actual_description || '-'}</td>
                                        <td className="py-2.5 px-4 text-right border-r border-[#e7eaec] font-mono text-gray-700">Rp {Number(visit.actual_service_amount || 0).toLocaleString('id-ID')}</td>
                                        <td className="py-2.5 px-4 text-right border-r border-[#e7eaec] font-mono text-gray-700">Rp {Number(visit.actual_transport_amount || 0).toLocaleString('id-ID')}</td>
                                        <td className="py-2.5 px-4 text-right border-r border-[#e7eaec] font-mono text-gray-700">Rp {Number(visit.actual_accommodation_amount || 0).toLocaleString('id-ID')}</td>
                                        <td className="py-2.5 px-4 text-right border-r border-[#e7eaec] font-mono font-semibold text-gray-900">Rp {Number(visit.actual_tot_detail_amount || 0).toLocaleString('id-ID')}</td>
                                        <td className="py-2.5 px-4 text-center border-r border-[#e7eaec]">{getStatusBadge(visit.status, visit.f_cancel)}</td>
                                        <td className="py-2 px-4 text-center">
                                            {!isCancelled && isDraft ? (
                                                <div className="flex gap-1 justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => navigate(`/lkt/realisasi/${visit.lkt_sub_code}/edit`)}
                                                        className="bg-[#f0ad4e] hover:bg-[#ec971f] text-white px-2 py-0.5 rounded-[2px] text-[10px] font-semibold border border-[#eea236] cursor-pointer"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCancelVisit(visit.lkt_sub_code)}
                                                        className="bg-[#d9534f] hover:bg-[#c9302c] text-white px-2 py-0.5 rounded-[2px] text-[10px] font-semibold border border-[#d43f3a] cursor-pointer"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={10} className="py-8 text-center text-gray-400 font-medium">Belum ada realisasi service kunjungan</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
