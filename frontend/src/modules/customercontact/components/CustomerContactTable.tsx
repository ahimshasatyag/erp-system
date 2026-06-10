import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface CustomerContactTableProps {
    data: any[];
    meta?: {
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
    };
    isLoading?: boolean;
    onParamsChange?: (params: any) => void;
    searchElement?: React.ReactNode;
}

export default function CustomerContactTable({ 
    data, 
    meta,
    isLoading, 
    onParamsChange = () => {},
    searchElement
}: CustomerContactTableProps) {
    const navigate = useNavigate();
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

    const currentPage = meta?.current_page ? parseInt(meta.current_page.toString(), 10) : 1;
    const perPage = meta?.per_page ? parseInt(meta.per_page.toString(), 10) : 10;
    const total = meta?.total ? parseInt(meta.total.toString(), 10) : data.length;
    const lastPage = meta?.last_page ? parseInt(meta.last_page.toString(), 10) : 1;

    const sortedData = useMemo(() => {
        if (!data) return [];
        let sortableItems = [...data];
        if (sortConfig !== null) {
            sortableItems.sort((a: any, b: any) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                if (sortConfig.key === 'customer_name') {
                    aValue = a.customer?.nm_customers || '';
                    bValue = b.customer?.nm_customers || '';
                } else if (sortConfig.key === 'id_customers_contact') {
                    aValue = data.findIndex(r => r.id_customers_contact === a.id_customers_contact);
                    bValue = data.findIndex(r => r.id_customers_contact === b.id_customers_contact);
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

    const getNo = (row: any) => {
        const originalIdx = data.findIndex(r => r.id_customers_contact === row.id_customers_contact);
        return ((currentPage - 1) * perPage) + originalIdx + 1;
    };



    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        if (lastPage <= 7) {
            for (let i = 1; i <= lastPage; i++) pages.push(i);
        } else {
            if (currentPage <= 4) {
                for (let i = 1; i <= 5; i++) pages.push(i);
                pages.push('...');
                pages.push(lastPage);
            } else if (currentPage >= lastPage - 3) {
                pages.push(1);
                pages.push('...');
                for (let i = lastPage - 4; i <= lastPage; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(lastPage);
            }
        }
        return pages;
    };

    return (
        <div className="w-full">
            <div className="flex flex-col mb-4">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-2 min-h-[38px]"></div>
                    <div>{searchElement}</div>
                </div>
                <div className="flex justify-start items-center">
                    <div className="flex items-center gap-2 text-[13px] text-gray-600">
                        Tampilkan
                        <select 
                            value={perPage} 
                            onChange={(e) => onParamsChange({ per_page: parseInt(e.target.value, 10), page: 1 })}
                            className="border border-gray-300 rounded px-1.5 py-0.5 outline-none text-[13px]"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                        Data
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto border-t border-b border-gray-200 mt-2">
                <table className="min-w-full divide-y divide-gray-200 text-[13px] whitespace-nowrap">
                    <thead className="bg-gray-50">
                        <tr>
                            <th onClick={() => handleSort('nm_customers_contact')} className="px-3 py-2 text-left font-bold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors">
                                <div className="flex items-center justify-between">Contact Name {getSortIcon('nm_customers_contact')}</div>
                            </th>
                            <th onClick={() => handleSort('customer_name')} className="px-3 py-2 text-left font-bold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors">
                                <div className="flex items-center justify-between">Company Name {getSortIcon('customer_name')}</div>
                            </th>
                            <th onClick={() => handleSort('customers_contact_posisi')} className="px-3 py-2 text-left font-bold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors">
                                <div className="flex items-center justify-between">Job Position {getSortIcon('customers_contact_posisi')}</div>
                            </th>
                            <th onClick={() => handleSort('customers_contact_phone')} className="px-3 py-2 text-left font-bold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors">
                                <div className="flex items-center justify-between">Phone {getSortIcon('customers_contact_phone')}</div>
                            </th>
                            <th onClick={() => handleSort('customers_contact_email')} className="px-3 py-2 text-left font-bold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors">
                                <div className="flex items-center justify-between">Email {getSortIcon('customers_contact_email')}</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {sortedData.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-3 py-10 text-center text-gray-500">Tidak ada data yang ditemukan.</td>
                            </tr>
                        ) : (
                            sortedData.map((row, idx) => {
                                const editUrl = `/customerscontact/edit/${row.id_customers_contact}`;
                                const isEven = idx % 2 === 0;

                                return (
                                    <tr key={row.id_customers_contact} className={`border-b border-gray-100 hover:bg-gray-50 ${isEven ? 'bg-white' : 'bg-gray-50/50'}`}>
                                        <td className="px-3 py-1.5 whitespace-nowrap">
                                            <Link to={editUrl} state={{ name: row.nm_customers_contact }} className="text-gray-800 hover:text-blue-600 block w-full">{row.nm_customers_contact}</Link>
                                        </td>
                                        <td className="px-3 py-1.5 whitespace-nowrap">
                                            <Link to={editUrl} state={{ name: row.nm_customers_contact }} className="text-gray-800 hover:text-blue-600 block w-full">{row.customer?.nm_customers}</Link>
                                        </td>
                                        <td className="px-3 py-1.5 whitespace-nowrap">
                                            <Link to={editUrl} state={{ name: row.nm_customers_contact }} className="text-gray-800 hover:text-blue-600 block w-full">{row.customers_contact_posisi}</Link>
                                        </td>
                                        <td className="px-3 py-1.5 whitespace-nowrap">
                                            <Link to={editUrl} state={{ name: row.nm_customers_contact }} className="text-gray-800 hover:text-blue-600 block w-full">{row.customers_contact_phone}</Link>
                                        </td>
                                        <td className="px-3 py-1.5 whitespace-nowrap">
                                            <Link to={editUrl} state={{ name: row.nm_customers_contact }} className="text-gray-800 hover:text-blue-600 block w-full">{row.customers_contact_email}</Link>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-3 pb-2 px-1 text-[13px] text-gray-600">
                <div>
                    Showing {data.length > 0 ? ((currentPage - 1) * perPage) + 1 : 0} to {Math.min(currentPage * perPage, total)} of {total} entries
                </div>
                <div className="flex shadow-sm rounded border border-gray-200 text-[12px]">
                    <button 
                        disabled={currentPage === 1}
                        onClick={() => onParamsChange({ page: currentPage - 1 })}
                        className="px-2.5 py-1 bg-white border-r border-gray-200 hover:bg-gray-50 text-gray-500 rounded-l disabled:opacity-50"
                    >
                        Previous
                    </button>
                    {getPageNumbers().map((pageNum, index) => (
                        <button
                            key={index}
                            disabled={pageNum === '...'}
                            onClick={() => typeof pageNum === 'number' && onParamsChange({ page: pageNum })}
                            className={`px-2.5 py-1 ${currentPage === pageNum ? 'bg-[#3b82f6] text-white font-medium' : 'bg-white hover:bg-gray-50 text-gray-500 border-r border-gray-200'} ${pageNum === '...' ? 'cursor-default' : ''}`}
                        >
                            {pageNum}
                        </button>
                    ))}
                    <button 
                        disabled={currentPage === lastPage || lastPage === 0}
                        onClick={() => onParamsChange({ page: currentPage + 1 })}
                        className="px-2.5 py-1 bg-white hover:bg-gray-50 text-gray-500 rounded-r disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
