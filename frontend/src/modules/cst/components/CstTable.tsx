import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

interface CstTableProps {
    data: any[];
    isLoading: boolean;
}

export default function CstTable({ data, isLoading }: CstTableProps) {
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

    const sortedData = useMemo(() => {
        if (!data) return [];
        let sortableItems = [...data];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                if (sortConfig.key === 'id_afs_cst') {
                    aValue = data.findIndex(r => r.cst_code === a.cst_code);
                    bValue = data.findIndex(r => r.cst_code === b.cst_code);
                } else if (sortConfig.key === 'cst_date') {
                    aValue = new Date(a.cst_date).getTime();
                    bValue = new Date(b.cst_date).getTime();
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
        return <div className="text-center py-10 text-gray-500">Loading CST data...</div>;
    }

    if (!data || data.length === 0) {
        return <div className="text-center py-10 text-gray-500">No CST data found.</div>;
    }

    const getNo = (row: any) => {
        const originalIdx = data.findIndex(r => r.cst_code === row.cst_code);
        return data.length - originalIdx;
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'OUTSTANDING':
                return <span className="px-3 py-0.5 text-[11px] font-semibold text-[#8a6d3b] bg-[#fcf8e3] border border-[#faebcc] rounded-full shadow-sm">Outstanding</span>;
            case 'ON PROGRESS':
                return <span className="px-3 py-0.5 text-[11px] font-semibold text-[#31708f] bg-[#d9edf7] border border-[#bce8f1] rounded-full shadow-sm">In Progress</span>;
            case 'DONE':
                return <span className="px-3 py-0.5 text-[11px] font-semibold text-[#3c763d] bg-[#dff0d8] border border-[#d6e9c6] rounded-full shadow-sm">Done</span>;
            case 'CANCEL':
                return <span className="px-3 py-0.5 text-[11px] font-semibold text-[#a94442] bg-[#f2dede] border border-[#ebccd1] rounded-full shadow-sm">Cancelled</span>;
            case 'PENDING':
                return <span className="px-3 py-0.5 text-[11px] font-semibold text-gray-700 bg-gray-100 border border-gray-200 rounded-full shadow-sm">Pending</span>;
            default:
                return <span className="px-3 py-0.5 text-[11px] font-semibold text-gray-500 bg-gray-50 border border-gray-200 rounded-full shadow-sm">{status || '-'}</span>;
        }
    };

    return (
        <div className="w-full text-sm">
            <div className="overflow-x-auto border-t border-b border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th onClick={() => handleSort('id_afs_cst')} className="px-4 py-3 text-left font-bold text-gray-600 cursor-pointer group border-r border-gray-200 w-12 hover:bg-gray-100 transition-colors">
                                <div className="flex items-center justify-between">No {getSortIcon('id_afs_cst')}</div>
                            </th>
                            <th onClick={() => handleSort('cst_date')} className="px-4 py-3 text-left font-bold text-gray-600 cursor-pointer group border-r border-gray-200 hover:bg-gray-100 transition-colors">
                                <div className="flex items-center justify-between">Date {getSortIcon('cst_date')}</div>
                            </th>
                            <th onClick={() => handleSort('cst_code')} className="px-4 py-3 text-left font-bold text-gray-600 cursor-pointer group border-r border-gray-200 hover:bg-gray-100 transition-colors">
                                <div className="flex items-center justify-between">CST Code {getSortIcon('cst_code')}</div>
                            </th>
                            <th onClick={() => handleSort('csr_code')} className="px-4 py-3 text-left font-bold text-gray-600 cursor-pointer group border-r border-gray-200 hover:bg-gray-100 transition-colors">
                                <div className="flex items-center justify-between">CSR Code {getSortIcon('csr_code')}</div>
                            </th>
                            <th onClick={() => handleSort('nm_customers')} className="px-4 py-3 text-left font-bold text-gray-600 cursor-pointer group border-r border-gray-200 hover:bg-gray-100 transition-colors">
                                <div className="flex items-center justify-between">Customers {getSortIcon('nm_customers')}</div>
                            </th>
                            <th onClick={() => handleSort('code_product')} className="px-4 py-3 text-left font-bold text-gray-600 cursor-pointer group border-r border-gray-200 hover:bg-gray-100 transition-colors">
                                <div className="flex items-center justify-between">Product Name {getSortIcon('code_product')}</div>
                            </th>
                            <th onClick={() => handleSort('nm_karyawan')} className="px-4 py-3 text-left font-bold text-gray-600 cursor-pointer group border-r border-gray-200 hover:bg-gray-100 transition-colors">
                                <div className="flex items-center justify-between">User {getSortIcon('nm_karyawan')}</div>
                            </th>
                            <th onClick={() => handleSort('status')} className="px-4 py-3 text-left font-bold text-gray-600 cursor-pointer group hover:bg-gray-100 transition-colors">
                                <div className="flex items-center justify-between">Status {getSortIcon('status')}</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {sortedData.map((row, idx) => {
                            const urlCode = row.cst_code.replace(/\//g, '.');
                            const editUrl = `/cst/${urlCode}/edit`;
                            const isEven = idx % 2 === 0;

                            return (
                                <tr key={row.cst_code} className={`${isEven ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors`}>
                                    <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                                        <Link to={editUrl} className="text-blue-600">{getNo(row)}</Link>
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                                        <Link to={editUrl} className="hover:text-blue-600">
                                            {formatDate(row.cst_date)}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-950">
                                        <Link to={editUrl} className="hover:text-blue-600">{row.cst_code.substring(16)}</Link>
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                                        <Link to={`/csr/${row.csr_code.replace(/\//g, '.')}/edit`} className="hover:text-blue-600 font-semibold">{row.csr_code.substring(16)}</Link>
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                                        <Link to={editUrl} className="hover:text-blue-600">{row.nm_customers}</Link>
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                                        <Link to={editUrl} className="hover:text-blue-600">{row.code_product}</Link>
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                                        {row.nm_karyawan}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        <Link to={editUrl}>
                                            {getStatusBadge(row.status)}
                                        </Link>
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
