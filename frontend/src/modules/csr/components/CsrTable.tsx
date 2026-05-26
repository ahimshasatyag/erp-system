import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

interface CsrTableProps {
    data: any[];
    isLoading: boolean;
}

export default function CsrTable({ data, isLoading }: CsrTableProps) {
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

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

                if (sortConfig.key === 'id_afs_csr') {
                    aValue = data.findIndex(r => r.id_afs_csr === a.id_afs_csr);
                    bValue = data.findIndex(r => r.id_afs_csr === b.id_afs_csr);
                } else if (sortConfig.key === 'csr_date') {
                    aValue = new Date(a.csr_date).getTime();
                    bValue = new Date(b.csr_date).getTime();
                } else if (sortConfig.key === 'age') {
                    aValue = calculateAgeIn(a.csr_date);
                    bValue = calculateAgeIn(b.csr_date);
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
        return <div className="text-center py-10">Loading CSR data...</div>;
    }

    if (!data || data.length === 0) {
        return <div className="text-center py-10 text-gray-500">No CSR data found.</div>;
    }

    const getNo = (row: any) => {
        const originalIdx = data.findIndex(r => r.id_afs_csr === row.id_afs_csr);
        return data.length - originalIdx;
    };

    return (
        <div className="w-full text-sm">
            <div className="overflow-x-auto border-t border-b border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th onClick={() => handleSort('id_afs_csr')} className="px-4 py-3 text-left font-bold text-gray-600 cursor-pointer group border-r border-gray-200 w-12 hover:bg-gray-100 transition-colors">
                                <div className="flex items-center justify-between">No {getSortIcon('id_afs_csr')}</div>
                            </th>
                            <th onClick={() => handleSort('csr_date')} className="px-4 py-3 text-left font-bold text-gray-600 cursor-pointer group border-r border-gray-200 hover:bg-gray-100 transition-colors">
                                <div className="flex items-center justify-between">Date {getSortIcon('csr_date')}</div>
                            </th>
                            <th onClick={() => handleSort('age')} className="px-4 py-3 text-left font-bold text-gray-600 cursor-pointer group border-r border-gray-200 hover:bg-gray-100 transition-colors">
                                <div className="flex items-center justify-between">Age In {getSortIcon('age')}</div>
                            </th>
                            <th onClick={() => handleSort('csr_code')} className="px-4 py-3 text-left font-bold text-gray-600 cursor-pointer group border-r border-gray-200 hover:bg-gray-100 transition-colors">
                                <div className="flex items-center justify-between">Request {getSortIcon('csr_code')}</div>
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
                            <th onClick={() => handleSort('csr_status')} className="px-4 py-3 text-left font-bold text-gray-600 cursor-pointer group hover:bg-gray-100 transition-colors">
                                <div className="flex items-center justify-between">Status {getSortIcon('csr_status')}</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {sortedData.map((row, idx) => {
                            const urlCode = row.csr_code.replace(/\//g, '.');
                            const editUrl = `/csr/${urlCode}/edit`;
                            const isEven = idx % 2 === 0;

                            return (
                                <tr key={row.id_afs_csr} className={`${isEven ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors`}>
                                    <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                                        <Link to={editUrl} className="text-blue-600">{getNo(row)}</Link>
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                                        <Link to={editUrl} className="hover:text-blue-600">
                                            {new Date(row.csr_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                                        {calculateAgeIn(row.csr_date)}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900">
                                        <Link to={editUrl} className="hover:text-blue-600">{row.csr_code.substring(16)}</Link>
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
                                            <span className="px-3 py-0.5 text-[11px] font-semibold text-white bg-[#2c3e50] rounded-full shadow-sm">{row.csr_status === 'DRAFT' ? 'Draft CSR' : row.csr_status}</span>
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
                    <button className="px-3 py-1.5 bg-white border-r border-gray-200 hover:bg-gray-50 text-gray-500 rounded-l-md disabled:opacity-50">Previous</button>
                    <button className="px-3 py-1.5 bg-blue-400 text-white font-medium">1</button>
                    <button className="px-3 py-1.5 bg-white border-l border-gray-200 hover:bg-gray-50 text-gray-500 rounded-r-md disabled:opacity-50">Next</button>
                </div>
            </div>
        </div>
    );
}
