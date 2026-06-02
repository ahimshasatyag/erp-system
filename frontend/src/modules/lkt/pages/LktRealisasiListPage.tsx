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
                            <th className="py-2.5 px-4 text-center border-r border-[#e7eaec] w-24">LKT</th>
                            <th className="py-2.5 px-4 text-center border-r border-[#e7eaec] w-24">CST</th>
                            <th className="py-2.5 px-4 text-center border-r border-[#e7eaec] w-28">St Date</th>
                            <th className="py-2.5 px-4 text-left border-r border-[#e7eaec]">Customers</th>
                            <th className="py-2.5 px-4 text-left border-r border-[#e7eaec]">Keterangan</th>
                            <th className="py-2.5 px-4 text-right border-r border-[#e7eaec] w-24">Training</th>
                            <th className="py-2.5 px-4 text-right border-r border-[#e7eaec] w-24">Bongkar</th>
                            <th className="py-2.5 px-4 text-center border-r border-[#e7eaec] w-20">Daring</th>
                            <th className="py-2.5 px-4 text-center border-r border-[#e7eaec] w-28">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e7eaec]">
                        {visits.length > 0 ? (
                            visits.map((visit: any, idx: number) => {
                                return (
                                    <tr key={visit.id_afs_realisasi || idx} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-2.5 px-4 text-center border-r border-[#e7eaec] text-gray-500 font-medium">{idx + 1}</td>
                                        <td className="py-2.5 px-4 text-center border-r border-[#e7eaec] font-bold">
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    const subCode = visit.lkt_sub_code || visit.id_visit || '';
                                                    const lktQuery = visit.lkt_code ? `lkt=${visit.lkt_code.replace(/\//g, '.')}` : '';
                                                    const queryStr = lktQuery ? `?${lktQuery}` : '';
                                                    navigate(`/lkt/realisasi/${String(subCode).replace(/\//g, '.')}/edit${queryStr}`);
                                                }}
                                                className="text-[#1ab394] hover:text-[#18a689] hover:underline cursor-pointer"
                                            >
                                                {visit.lkt_code && visit.lkt_code.length > 16 ? visit.lkt_code.substring(16) : (visit.lkt_sub_code || visit.lkt_code || '-')}
                                            </a>
                                        </td>
                                        <td className="py-2.5 px-4 text-center border-r border-[#e7eaec] text-gray-700">
                                            {visit.cst_code && visit.cst_code.length > 16 ? visit.cst_code.substring(16) : (visit.cst_code || '-')}
                                        </td>
                                        <td className="py-2.5 px-4 text-center border-r border-[#e7eaec] text-gray-600 font-medium">{formatDate(visit.actual_starting_date)}</td>
                                        <td className="py-2.5 px-4 border-r border-[#e7eaec] text-left text-gray-800 truncate" title={visit.nm_customers}>{visit.nm_customers || '-'}</td>
                                        <td className="py-2.5 px-4 border-r border-[#e7eaec] text-left text-gray-800 whitespace-pre-wrap max-w-xs overflow-hidden text-ellipsis">{visit.actual_description || '-'}</td>
                                        <td className="py-2.5 px-4 text-right border-r border-[#e7eaec] font-mono text-gray-700">{Number(visit.actual_training || 0).toLocaleString('id-ID')}</td>
                                        <td className="py-2.5 px-4 text-right border-r border-[#e7eaec] font-mono text-gray-700">{Number(visit.actual_bongkar || 0).toLocaleString('id-ID')}</td>
                                        <td className="py-2.5 px-4 text-center border-r border-[#e7eaec]">
                                            {Number(visit.flag_daring) === 1 ? (
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-600 border border-green-200">Daring</span>
                                            ) : (
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-50 text-gray-600 border border-gray-200">Tidak</span>
                                            )}
                                        </td>
                                        <td className="py-2.5 px-4 text-center border-r border-[#e7eaec]">{getStatusBadge(visit.status, visit.f_cancel)}</td>
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
