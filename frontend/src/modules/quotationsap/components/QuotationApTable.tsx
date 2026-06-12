import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';

interface QuotationApTableProps {
    quotationAps: any[];
    meta?: any;
    onParamsChange?: (params: any) => void;
    searchElement?: React.ReactNode;
}

const QuotationApTable: React.FC<QuotationApTableProps> = ({
    quotationAps = [],
    meta = {},
    onParamsChange,
    searchElement
}) => {
    const [sortBy, setSortBy] = useState<string>('id_po');
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
    const total = meta?.total ? parseInt(meta.total.toString(), 10) : quotationAps.length;
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
                            <th onClick={() => handleSort('code_po')} className="px-3 py-2 text-left font-bold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors">
                                <div className="flex items-center justify-between">Quotation Number {getSortIcon('code_po')}</div>
                            </th>
                            <th onClick={() => handleSort('date_po')} className="px-3 py-2 text-left font-bold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors">
                                <div className="flex items-center justify-between">Date {getSortIcon('date_po')}</div>
                            </th>
                            <th onClick={() => handleSort('status_po')} className="px-3 py-2 text-left font-bold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors">
                                <div className="flex items-center justify-between">Status {getSortIcon('status_po')}</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {quotationAps.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-3 py-10 text-center text-gray-500">Tidak ada data yang ditemukan.</td>
                            </tr>
                        ) : (
                            quotationAps.map((po, index) => (
                                <tr key={po.id_po} className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                    <td className="px-3 py-1.5 whitespace-nowrap">
                                        <Link to={`/quotationsap/${po.id_po}/edit`} state={{ name: po.code_po }} className="text-gray-900 hover:text-blue-600 block">
                                            {po.code_po}
                                        </Link>
                                    </td>
                                    <td className="px-3 py-1.5 whitespace-nowrap">
                                        <Link to={`/quotationsap/${po.id_po}/edit`} state={{ name: po.code_po }} className="text-gray-900 hover:text-blue-600 block">
                                            {new Date(po.date_po).toLocaleDateString('id-ID')}
                                        </Link>
                                    </td>
                                    <td className="px-3 py-1.5 whitespace-nowrap">
                                        <Link to={`/quotationsap/${po.id_po}/edit`} state={{ name: po.code_po }} className="text-gray-900 hover:text-blue-600 block">
                                            {po.status_po}
                                        </Link>
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
                    Showing {((currentPage - 1) * perPage) + (quotationAps.length > 0 ? 1 : 0)} to {Math.min(currentPage * perPage, total)} of {total} entries
                </div>
                <div className="flex shadow-sm rounded border border-gray-200 text-[12px]">
                    <button 
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="px-2.5 py-1 bg-white border-r border-gray-200 hover:bg-gray-50 text-gray-500 rounded-l disabled:opacity-50"
                    >
                        Previous
                    </button>
                    {getPageNumbers().map((page, index) => (
                        <button
                            key={index}
                            disabled={page === '...'}
                            onClick={() => typeof page === 'number' && handlePageChange(page)}
                            className={`px-2.5 py-1 ${currentPage === page ? 'bg-[#3b82f6] text-white font-medium' : 'bg-white hover:bg-gray-50 text-gray-500 border-r border-gray-200'} ${page === '...' ? 'cursor-default' : ''}`}
                        >
                            {page}
                        </button>
                    ))}
                    <button 
                        disabled={currentPage === lastPage || lastPage === 0}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="px-2.5 py-1 bg-white hover:bg-gray-50 text-gray-500 rounded-r disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuotationApTable;
