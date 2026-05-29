import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

interface LktTableProps {
    data: any[];
    isLoading: boolean;
}

export default function LktTable({ data, isLoading }: LktTableProps) {
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    const calculateAgeIn = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - date.getTime());
        return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    };

    const sortedData = useMemo(() => {
        if (!data) return [];
        let sortableItems = [...data];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                if (sortConfig.key === 'id_afs_lkt') {
                    aValue = data.findIndex(r => r.lkt_code === a.lkt_code);
                    bValue = data.findIndex(r => r.lkt_code === b.lkt_code);
                } else if (sortConfig.key === 'starting_date') {
                    aValue = new Date(a.starting_date).getTime();
                    bValue = new Date(b.starting_date).getTime();
                } else if (sortConfig.key === 'age') {
                    aValue = calculateAgeIn(a.starting_date);
                    bValue = calculateAgeIn(b.starting_date);
                }

                if (aValue === undefined || aValue === null) aValue = '';
                if (bValue === undefined || bValue === null) bValue = '';

                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    aValue = aValue.toLowerCase();
                    bValue = bValue.toLowerCase();
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [data, sortConfig]);

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: string) => {
        if (!sortConfig || sortConfig.key !== key) {
            return <span className="text-gray-400 font-normal text-[10px]">⇅</span>;
        }
        if (sortConfig.direction === 'asc') {
            return <span className="text-blue-600 font-bold text-[12px]">↑</span>;
        }
        return <span className="text-blue-600 font-bold text-[12px]">↓</span>;
    };

    if (isLoading) {
        return <div className="text-center py-10 text-gray-500">Loading LKT data...</div>;
    }

    if (!data || data.length === 0) {
        return <div className="text-center py-10 text-gray-500">No LKT data found.</div>;
    }

    const getNo = (row: any) => {
        const originalIdx = data.findIndex(r => r.lkt_code === row.lkt_code);
        return data.length - originalIdx;
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
    };

    const getStatusBadge = (status: string, fCancel: number) => {
        if (Number(fCancel) === 1) {
            return <span className="px-3 py-0.5 text-[11px] font-semibold text-[#a94442] bg-[#f2dede] border border-[#ebccd1] rounded-full shadow-sm">Cancelled</span>;
        }
        switch (status?.toUpperCase()) {
            case 'DRAFT':
                return <span className="px-3 py-0.5 text-[11px] font-semibold text-gray-700 bg-gray-100 border border-gray-200 rounded-full shadow-sm">Draft</span>;
            case 'ON PROGRESS':
                return <span className="px-3 py-0.5 text-[11px] font-semibold text-[#31708f] bg-[#d9edf7] border border-[#bce8f1] rounded-full shadow-sm">In Progress</span>;
            case 'DONE':
                return <span className="px-3 py-0.5 text-[11px] font-semibold text-[#3c763d] bg-[#dff0d8] border border-[#d6e9c6] rounded-full shadow-sm">Done</span>;
            default:
                return <span className="px-3 py-0.5 text-[11px] font-semibold text-gray-500 bg-gray-50 border border-gray-200 rounded-full shadow-sm">{status || '-'}</span>;
        }
    };

    const isWarrantyActive = (warrantyEnd: string, cstDate: string) => {
        if (!warrantyEnd || !cstDate) return false;
        return new Date(warrantyEnd).getTime() >= new Date(cstDate).getTime();
    };

    return (
        <div className="w-full text-sm">
            <div className="overflow-x-auto border-t border-b border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                        <tr>
                            <th onClick={() => handleSort('id_afs_lkt')} className="px-3 py-3 text-left cursor-pointer border-r border-gray-200 hover:bg-gray-100 transition-colors w-12">
                                <div className="flex items-center justify-between">No {getSortIcon('id_afs_lkt')}</div>
                            </th>
                            <th onClick={() => handleSort('lkt_code')} className="px-3 py-3 text-left cursor-pointer border-r border-gray-200 hover:bg-gray-100 transition-colors w-24">
                                <div className="flex items-center justify-between">LKT {getSortIcon('lkt_code')}</div>
                            </th>
                            <th onClick={() => handleSort('cst_code')} className="px-3 py-3 text-left cursor-pointer border-r border-gray-200 hover:bg-gray-100 transition-colors w-24">
                                <div className="flex items-center justify-between">CST {getSortIcon('cst_code')}</div>
                            </th>
                            <th onClick={() => handleSort('starting_date')} className="px-3 py-3 text-left cursor-pointer border-r border-gray-200 hover:bg-gray-100 transition-colors w-28">
                                <div className="flex items-center justify-between">Start Date {getSortIcon('starting_date')}</div>
                            </th>
                            <th onClick={() => handleSort('age')} className="px-3 py-3 text-left cursor-pointer border-r border-gray-200 hover:bg-gray-100 transition-colors w-20">
                                <div className="flex items-center justify-between">Age In {getSortIcon('age')}</div>
                            </th>
                            <th onClick={() => handleSort('nm_customers')} className="px-3 py-3 text-left cursor-pointer border-r border-gray-200 hover:bg-gray-100 transition-colors">
                                <div className="flex items-center justify-between">Customer {getSortIcon('nm_customers')}</div>
                            </th>
                            <th className="px-3 py-3 text-left border-r border-gray-200">Provinsi</th>
                            <th className="px-3 py-3 text-left border-r border-gray-200">Kabupaten/Kota</th>
                            <th className="px-3 py-3 text-left border-r border-gray-200">Keterangan</th>
                            <th className="px-3 py-3 text-left border-r border-gray-200">Transport Type</th>
                            <th className="px-3 py-3 text-left border-r border-gray-200">Garansi</th>
                            <th className="px-3 py-3 text-right border-r border-gray-200">Service Amount</th>
                            <th className="px-3 py-3 text-right border-r border-gray-200">Transport</th>
                            <th className="px-3 py-3 text-right border-r border-gray-200">Training</th>
                            <th className="px-3 py-3 text-right border-r border-gray-200">Bongkar</th>
                            <th className="px-3 py-3 text-center border-r border-gray-200">Actual Day</th>
                            <th className="px-3 py-3 text-left w-24">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100 text-xs">
                        {sortedData.map((row, idx) => {
                            const urlCode = row.lkt_code.replace(/\//g, '.');
                            // Let's assume edit LKT maps to /lkt/:code/edit (or details view)
                            const editUrl = `/lkt/${urlCode}/edit`;
                            const isEven = idx % 2 === 0;

                            const truncatedDesc = row.description && row.description.length > 25 
                                ? row.description.substring(0, 25) + '...' 
                                : row.description || '-';

                            const hasWarranty = isWarrantyActive(row.waranty_end, row.cst_date);

                            return (
                                <tr key={row.lkt_code} className={`${isEven ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors`}>
                                    <td className="px-3 py-2 whitespace-nowrap text-gray-700">
                                        <Link to={editUrl} className="text-blue-600 font-semibold">{getNo(row)}</Link>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap font-bold text-gray-950">
                                        <Link to={editUrl} className="hover:text-blue-600">{row.lkt_code.substring(16)}</Link>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-gray-700">
                                        <Link to={`/cst/${row.cst_code.replace(/\//g, '.')}/edit`} className="hover:text-blue-600 font-semibold">
                                            {row.cst_code.substring(16)}
                                        </Link>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-gray-600 font-medium">
                                        {formatDate(row.starting_date)}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-center text-gray-600">
                                        {calculateAgeIn(row.starting_date)}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-gray-800 font-medium">
                                        {row.nm_customers || '-'}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-gray-600">
                                        {row.provinsi_nama || '-'}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-gray-600">
                                        {row.kabupaten_nama || '-'}
                                    </td>
                                    <td className="px-3 py-2 text-gray-600" title={row.description}>
                                        {truncatedDesc}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-gray-600">
                                        {row.actual_transport || '-'}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap font-bold">
                                        {hasWarranty ? (
                                            <span className="text-emerald-600">GARANSI</span>
                                        ) : (
                                            <span className="text-rose-600">TIDAK GARANSI</span>
                                        )}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-right text-gray-700 font-mono">
                                        Rp {Number(row.actual_service_amount || 0).toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-right text-gray-700 font-mono">
                                        Rp {Number(row.actual_transport_amount || 0).toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-right text-gray-700 font-mono">
                                        Rp {Number(row.actual_training || 0).toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-right text-gray-700 font-mono">
                                        Rp {Number(row.actual_bongkar || 0).toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-center text-gray-700 font-medium">
                                        {row.actual_day || 0}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        {getStatusBadge(row.flag_done, row.f_cancel)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-4 pb-2 px-2 text-sm text-gray-600">
                <div>
                    Showing 1 to {data.length} of {data.length} entries
                </div>
                <div className="flex shadow-sm rounded-md border border-gray-200">
                    <button className="px-3 py-1.5 bg-white border-r border-gray-200 hover:bg-gray-50 text-gray-500 rounded-l-md disabled:opacity-50" disabled>Previous</button>
                    <button className="px-3 py-1.5 bg-blue-400 text-white font-medium">1</button>
                    <button className="px-3 py-1.5 bg-white border-l border-gray-200 hover:bg-gray-50 text-gray-500 rounded-r-md disabled:opacity-50" disabled>Next</button>
                </div>
            </div>
        </div>
    );
}
