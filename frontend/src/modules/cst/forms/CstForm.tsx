import React, { useEffect, useState } from 'react';

interface CstFormProps {
    initialData?: any;
    actionToolbar?: React.ReactNode;
}

export default function CstForm({ initialData, actionToolbar }: CstFormProps) {
    const [warrantyStatus, setWarrantyStatus] = useState<{ text: string; color: string } | null>(null);

    useEffect(() => {
        if (initialData?.waranty_end && initialData?.csr_date) {
            const end = new Date(initialData.waranty_end).getTime();
            const start = new Date(initialData.csr_date).getTime();
            
            if (end >= start) {
                setWarrantyStatus({ text: 'GARANSI', color: 'text-emerald-600' });
            } else {
                setWarrantyStatus({ text: 'TIDAK GARANSI', color: 'text-rose-600' });
            }
        } else {
            setWarrantyStatus(null);
        }
    }, [initialData]);

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
    };

    return (
        <div className="space-y-6 text-sm text-gray-800">
            {/* Action Toolbar */}
            {actionToolbar && (
                <div className="flex flex-wrap items-center gap-3 pb-6 border-b border-gray-250 dark:border-gray-800 transition-colors duration-200">
                    {actionToolbar}
                </div>
            )}

            {/* 1. Customer Section */}
            <div className="space-y-3">
                <div className="pb-1 border-b border-gray-300">
                    <h3 className="text-base font-bold text-gray-800 tracking-wide">Customer</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {/* Left Column */}
                    <div className="border border-gray-200 rounded overflow-hidden">
                        <table className="w-full border-collapse">
                            <tbody>
                                <tr className="bg-[#f9f9f9] border-b border-gray-200">
                                    <td className="py-2.5 px-3 font-semibold text-gray-700 w-[30%] text-left">Customers Name</td>
                                    <td className="py-2.5 px-1 text-center w-[5%]">:</td>
                                    <td className="py-2.5 px-3">
                                        <div className="font-semibold text-gray-900">{initialData?.nm_customers || '-'}</div>
                                        <div className="text-xs text-gray-500 italic mt-0.5">{initialData?.customers_address || ''}</div>
                                    </td>
                                </tr>
                                <tr className="bg-white">
                                    <td className="py-2.5 px-3 font-semibold text-gray-700 text-left">Requestor</td>
                                    <td className="py-2.5 px-1 text-center">:</td>
                                    <td className="py-2.5 px-3 text-gray-900 font-medium">
                                        {initialData?.nm_karyawan || '-'}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Right Column */}
                    <div className="border border-gray-200 rounded overflow-hidden h-fit">
                        <table className="w-full border-collapse">
                            <tbody>
                                <tr className="bg-white border-b border-gray-200">
                                    <td className="py-2 px-3 font-semibold text-gray-700 w-[35%] text-left">CSR Code</td>
                                    <td className="py-2 px-1 text-center w-[5%]">:</td>
                                    <td className="py-2 px-3 text-gray-900 font-medium">
                                        {initialData?.csr_code || '-'}
                                    </td>
                                </tr>
                                <tr className="bg-[#f9f9f9] border-b border-gray-200">
                                    <td className="py-2 px-3 font-semibold text-gray-700 text-left">Date Request</td>
                                    <td className="py-2 px-1 text-center">:</td>
                                    <td className="py-2 px-3 text-gray-950 font-medium">
                                        {formatDate(initialData?.csr_date)}
                                    </td>
                                </tr>
                                <tr className="bg-[#f9f9f9] border-b border-gray-200">
                                    <td className="py-2 px-3 font-semibold text-gray-700 text-left">Lokasi</td>
                                    <td className="py-2 px-1 text-center">:</td>
                                    <td className="py-2 px-3 text-gray-950 font-medium">
                                        {initialData?.lokasi || '-'}
                                    </td>
                                </tr>
                                <tr className="bg-white">
                                    <td className="py-2 px-3 font-semibold text-gray-700 text-left valign-top">Status Pemasangan <span className="text-rose-500">*</span></td>
                                    <td className="py-2 px-1 text-center valign-top">:</td>
                                    <td className="py-2 px-3 text-gray-900 font-medium">
                                        <div className="flex flex-col gap-1 text-xs text-gray-600">
                                            <label className="flex items-center gap-2 cursor-not-allowed">
                                                <input type="checkbox" checked={String(initialData?.sts_pasang) === '1'} disabled className="h-3.5 w-3.5 border-gray-300 rounded text-blue-600" />
                                                <span>Pasang Baru</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-not-allowed">
                                                <input type="checkbox" checked={String(initialData?.sts_pasang) === '0'} disabled className="h-3.5 w-3.5 border-gray-300 rounded text-blue-600" />
                                                <span>Service</span>
                                            </label>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* 2. Laporan Kerusakan Section */}
            <div className="space-y-3">
                <div className="pb-1 border-b border-gray-300">
                    <h3 className="text-base font-bold text-gray-800 tracking-wide">Laporan Kerusakan</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {/* Left Column */}
                    <div className="border border-gray-200 rounded overflow-hidden h-fit">
                        <table className="w-full border-collapse">
                            <tbody>
                                <tr className="bg-[#f9f9f9]">
                                    <td className="py-4 px-3 font-semibold text-gray-700 w-[30%] text-left valign-top">Catatan Kerusakan</td>
                                    <td className="py-4 px-1 text-center w-[5%] valign-top">:</td>
                                    <td className="py-4 px-3 text-gray-900 font-medium whitespace-pre-wrap">
                                        {initialData?.lap_kerusakan || '-'}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Right Column */}
                    <div className="border border-gray-200 rounded overflow-hidden">
                        <table className="w-full border-collapse">
                            <tbody>
                                <tr className="bg-white">
                                    <td className="py-4 px-3 font-semibold text-gray-700 w-[35%] text-left valign-top">Images</td>
                                    <td className="py-4 px-1 text-center w-[5%] valign-top">:</td>
                                    <td className="py-4 px-3">
                                        {initialData?.image ? (
                                            <img 
                                                src={`${window.location.origin}/assets/upload/afs/${initialData.image}`}
                                                alt="cst damage preview"
                                                className="max-h-24 max-w-full rounded border border-gray-300 shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
                                                onClick={() => window.open(`${window.location.origin}/assets/upload/afs/${initialData.image}`, '_blank')}
                                            />
                                        ) : (
                                            <div className="w-[100px] h-[100px] bg-white border border-gray-200 rounded flex items-center justify-center shadow-sm">
                                                <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="1.2" />
                                                </svg>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* 3. Product To Service Section */}
            <div className="space-y-3">
                <div className="pb-1 border-b border-gray-300">
                    <h3 className="text-base font-bold text-gray-800 tracking-wide">Product To Service</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {/* Left Column */}
                    <div className="border border-gray-200 rounded overflow-hidden">
                        <table className="w-full border-collapse">
                            <tbody>
                                <tr className="bg-white border-b border-gray-200">
                                    <td className="py-2.5 px-3 font-semibold text-gray-700 w-[30%] text-left">Serial Number</td>
                                    <td className="py-2.5 px-1 text-center w-[5%]">:</td>
                                    <td className="py-2.5 px-3 text-gray-900 font-medium">
                                        {initialData?.barcode || '-'}
                                    </td>
                                </tr>
                                <tr className="bg-[#f9f9f9] border-b border-gray-200">
                                    <td className="py-2.5 px-3 font-semibold text-gray-700 text-left">Product Name</td>
                                    <td className="py-2.5 px-1 text-center">:</td>
                                    <td className="py-2.5 px-3 text-gray-900 font-medium">
                                        {initialData?.code_product ? `${initialData.code_product} ${initialData.nm_product ? '- ' + initialData.nm_product : ''}` : '-'}
                                    </td>
                                </tr>
                                <tr className="bg-white border-b border-gray-200">
                                    <td className="py-2.5 px-3 font-semibold text-gray-700 text-left">Product Category</td>
                                    <td className="py-2.5 px-1 text-center">:</td>
                                    <td className="py-2.5 px-3 text-gray-900 font-medium">
                                        {initialData?.nm_product_kategori || '-'}
                                    </td>
                                </tr>
                                <tr className="bg-[#f9f9f9]">
                                    <td className="py-2.5 px-3 font-semibold text-gray-700 text-left">Delivery Order</td>
                                    <td className="py-2.5 px-1 text-center">:</td>
                                    <td className="py-2.5 px-3 text-gray-900 font-medium">
                                        {initialData?.do_code || '-'}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Right Column */}
                    <div className="border border-gray-200 rounded overflow-hidden">
                        <table className="w-full border-collapse">
                            <tbody>
                                <tr className="bg-white border-b border-gray-200">
                                    <td className="py-2 px-3 font-semibold text-gray-700 w-[35%] text-left">Warranty Start</td>
                                    <td className="py-2 px-1 text-center w-[5%]">:</td>
                                    <td className="py-2 px-3 text-gray-900 font-medium">
                                        {formatDate(initialData?.waranty_start)}
                                    </td>
                                </tr>
                                <tr className="bg-[#f9f9f9] border-b border-gray-200">
                                    <td className="py-2 px-3 font-semibold text-gray-700 text-left">Warranty Time</td>
                                    <td className="py-2 px-1 text-center">:</td>
                                    <td className="py-2 px-3 text-gray-950 font-medium">
                                        {initialData?.waranty_time ? `${initialData.waranty_time} Month` : '-'}
                                    </td>
                                </tr>
                                <tr className="bg-white border-b border-gray-200">
                                    <td className="py-2 px-3 font-semibold text-gray-700 text-left">Warranty End</td>
                                    <td className="py-2 px-1 text-center">:</td>
                                    <td className="py-2 px-3 text-gray-950 font-medium">
                                        {formatDate(initialData?.waranty_end)}
                                    </td>
                                </tr>
                                <tr className="bg-[#f9f9f9] border-b border-gray-200">
                                    <td className="py-2 px-3 font-semibold text-gray-700 text-left">Warranty Status</td>
                                    <td className="py-2 px-1 text-center">:</td>
                                    <td className="py-2 px-3 font-bold">
                                        {warrantyStatus ? (
                                            <span className={warrantyStatus.color}>
                                                {warrantyStatus.text}
                                            </span>
                                        ) : '-'}
                                    </td>
                                </tr>
                                <tr className="bg-white">
                                    <td className="py-2 px-3 font-semibold text-gray-700 text-left">Keterangan SO</td>
                                    <td className="py-2 px-1 text-center">:</td>
                                    <td className="py-2 px-3 text-gray-900 font-medium">
                                        {initialData?.keterangan || '-'}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
