import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';

interface IncomingTableProps {
    data: any[];
    meta?: any;
    onParamsChange?: (params: any) => void;
    searchElement?: React.ReactNode;
}

const IncomingTable: React.FC<IncomingTableProps> = ({
    data = [],
    meta = {},
    onParamsChange,
    searchElement
}) => {
    const [sortBy, setSortBy] = useState<string>('id_incoming');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
    const [length, setLength] = useState<number>(10);

    const handleSort = (column: string) => {
        const newDir = (sortBy === column && sortDir === 'asc') ? 'desc' : 'asc';
        setSortBy(column);
        setSortDir(newDir);
        if (onParamsChange) {
            onParamsChange({ sort_by: column, sort_dir: newDir, page: 1 });
        }
    };

    const handleLengthChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const newLength = parseInt(e.target.value, 10);
        setLength(newLength);
        if (onParamsChange) {
            onParamsChange({ length: newLength, page: 1 });
        }
    };

    const handlePageChange = (page: number) => {
        if (onParamsChange) {
            onParamsChange({ page });
        }
    };

    const currentPage = meta?.current_page ? parseInt(meta.current_page.toString(), 10) : 1;
    const perPage = meta?.per_page ? parseInt(meta.per_page.toString(), 10) : 10;
    const total = meta?.total ? parseInt(meta.total.toString(), 10) : data.length;
    const lastPage = meta?.last_page ? parseInt(meta.last_page.toString(), 10) : 1;

    const getSortIcon = (key: string) => {
        if (sortBy !== key) {
            return <span className="text-gray-400 font-normal text-[10px]">⇅</span>;
        }
        if (sortDir === 'asc') {
            return <span className="text-blue-600 font-bold text-[12px]">↑</span>;
        }
        return <span className="text-blue-600 font-bold text-[12px]">↓</span>;
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
                            value={length} 
                            onChange={handleLengthChange}
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
                            <th onClick={() => handleSort('code')} className="px-2 py-1.5 text-left font-bold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors">
                                <div className="flex items-center justify-between">Code {getSortIcon('code')}</div>
                            </th>
                            <th onClick={() => handleSort('nm_suppliers')} className="px-2 py-1.5 text-left font-bold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors">
                                <div className="flex items-center justify-between">Supplier {getSortIcon('nm_suppliers')}</div>
                            </th>
                            <th onClick={() => handleSort('code_po')} className="px-2 py-1.5 text-left font-bold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors">
                                <div className="flex items-center justify-between">PO Code {getSortIcon('code_po')}</div>
                            </th>
                            <th onClick={() => handleSort('date_create')} className="px-2 py-1.5 text-left font-bold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors">
                                <div className="flex items-center justify-between">Creation Date {getSortIcon('date_create')}</div>
                            </th>
                            <th onClick={() => handleSort('status_incoming')} className="px-2 py-1.5 text-center font-bold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors">
                                <div className="flex items-center justify-center">Status {getSortIcon('status_incoming')}</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-2 py-6 text-center text-gray-500">Tidak ada data yang ditemukan.</td>
                            </tr>
                        ) : (
                            data.map((row, index) => (
                                <tr key={row.id_incoming || index} className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                    <td className="px-2 py-1.5 whitespace-nowrap">
                                        <Link to={`/incshipment/${row.id}`} state={{ name: row.code }} className="text-gray-900 hover:text-blue-600 block font-medium">
                                            {row.code}
                                        </Link>
                                    </td>
                                    <td className="px-2 py-1.5 text-gray-600 truncate max-w-[200px]" title={row.nm_suppliers}>
                                        {row.nm_suppliers}
                                    </td>
                                    <td className="px-2 py-1.5 whitespace-nowrap text-gray-600">
                                        {row.code_po}
                                    </td>
                                    <td className="px-2 py-1.5 whitespace-nowrap text-gray-600">
                                        {row.date_create ? new Date(row.date_create).toLocaleDateString('id-ID', {
                                            day: '2-digit', month: '2-digit', year: 'numeric',
                                            hour: '2-digit', minute: '2-digit'
                                        }) : '-'}
                                    </td>
                                    <td className="px-2 py-1.5 whitespace-nowrap text-center">
                                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                            row.status_incoming === 'RECEIVED' ? 'bg-[#d4edda] text-[#155724]' : 'bg-[#fff3cd] text-[#856404]'
                                        }`}>
                                            {row.status_incoming}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-3 pb-2 px-1 text-[13px] text-gray-600">
                <div>
                    Showing {((currentPage - 1) * perPage) + (data.length > 0 ? 1 : 0)} to {Math.min(currentPage * perPage, total)} of {total} entries
                </div>
                <div className="flex space-x-1">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-2 py-1 text-gray-600 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed hover:bg-gray-100 rounded"
                    >
                        Previous
                    </button>
                    {getPageNumbers().map((p, i) => (
                        <button
                            key={i}
                            onClick={() => typeof p === 'number' ? handlePageChange(p) : undefined}
                            className={`px-2 py-1 rounded cursor-pointer ${
                                p === currentPage 
                                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                                    : p === '...' 
                                        ? 'cursor-default' 
                                        : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === lastPage}
                        className="px-2 py-1 text-gray-600 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed hover:bg-gray-100 rounded"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IncomingTable;
