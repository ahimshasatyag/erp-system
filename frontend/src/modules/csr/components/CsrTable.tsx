import React from 'react';
import { Link } from 'react-router-dom';

interface CsrTableProps {
    data: any[];
    isLoading: boolean;
}

export default function CsrTable({ data, isLoading }: CsrTableProps) {
    if (isLoading) {
        return <div className="text-center py-10">Loading CSR data...</div>;
    }

    if (!data || data.length === 0) {
        return <div className="text-center py-10 text-gray-500">No CSR data found.</div>;
    }

    const calculateAgeIn = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - date.getTime());
        return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'DRAFT':
                return <span className="px-2 py-1 text-xs font-semibold leading-5 text-gray-800 bg-gray-100 rounded-full">Draft CSR</span>;
            case 'OUTSTANDING':
                return <span className="px-2 py-1 text-xs font-semibold leading-5 text-yellow-800 bg-yellow-100 rounded-full">Outstanding</span>;
            case 'CANCEL':
                return <span className="px-2 py-1 text-xs font-semibold leading-5 text-red-800 bg-red-100 rounded-full">CANCELED</span>;
            case 'DONE':
                return <span className="px-2 py-1 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">DONE</span>;
            default:
                return <span className="px-2 py-1 text-xs font-semibold leading-5 text-blue-800 bg-blue-100 rounded-full">{status}</span>;
        }
    };

    return (
        <div className="w-full text-sm">
            <div className="overflow-x-auto border-t border-b border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left font-bold text-gray-600 cursor-pointer group border-r border-gray-200 w-12">
                                <div className="flex items-center justify-between">No <span className="text-gray-400 font-normal text-[10px]">⇅</span></div>
                            </th>
                            <th className="px-4 py-3 text-left font-bold text-gray-600 cursor-pointer group border-r border-gray-200">
                                <div className="flex items-center justify-between">Date <span className="text-gray-400 font-normal text-[10px]">⇅</span></div>
                            </th>
                            <th className="px-4 py-3 text-left font-bold text-gray-600 cursor-pointer group border-r border-gray-200">
                                <div className="flex items-center justify-between">Age In <span className="text-gray-400 font-normal text-[10px]">⇅</span></div>
                            </th>
                            <th className="px-4 py-3 text-left font-bold text-gray-600 cursor-pointer group border-r border-gray-200">
                                <div className="flex items-center justify-between">Request <span className="text-gray-400 font-normal text-[10px]">⇅</span></div>
                            </th>
                            <th className="px-4 py-3 text-left font-bold text-gray-600 cursor-pointer group border-r border-gray-200">
                                <div className="flex items-center justify-between">Customers <span className="text-gray-400 font-normal text-[10px]">⇅</span></div>
                            </th>
                            <th className="px-4 py-3 text-left font-bold text-gray-600 cursor-pointer group border-r border-gray-200">
                                <div className="flex items-center justify-between">Product Name <span className="text-gray-400 font-normal text-[10px]">⇅</span></div>
                            </th>
                            <th className="px-4 py-3 text-left font-bold text-gray-600 cursor-pointer group border-r border-gray-200">
                                <div className="flex items-center justify-between">User <span className="text-gray-400 font-normal text-[10px]">⇅</span></div>
                            </th>
                            <th className="px-4 py-3 text-left font-bold text-gray-600 cursor-pointer group">
                                <div className="flex items-center justify-between">Status <span className="text-gray-400 font-normal text-[10px]">⇅</span></div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {data.map((row, idx) => {
                            const urlCode = row.csr_code.replace(/\//g, '.');
                            const editUrl = `/csr/${urlCode}/edit`;
                            const isEven = idx % 2 === 0;

                            return (
                                <tr key={row.id_afs_csr} className={`${isEven ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors`}>
                                    <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                                        <Link to={editUrl} className="text-blue-600">{data.length - idx}</Link>
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
