import React from 'react';
import type { SerialNumberDetail } from '../api/cekSerialNumberApi';

interface CekSerialNumberDetailProps {
    data: SerialNumberDetail;
}

export default function CekSerialNumberDetail({ data }: CekSerialNumberDetailProps) {

    // Determine warranty status
    const renderWarrantyStatus = () => {
        if (!data.waranty_end_raw) return <span className="text-slate-500">-</span>;
        
        const today = new Date().toISOString().split('T')[0];
        const isWarranty = today <= data.waranty_end_raw;
        
        if (isWarranty) {
            return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-bold rounded">GARANSI</span>;
        } else {
            return <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold rounded">TIDAK GARANSI</span>;
        }
    };

    const InfoRow = ({ label, value }: { label: string, value: React.ReactNode }) => (
        <tr className="border-b border-slate-100 dark:border-gray-800 last:border-0 hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors">
            <th className="py-2.5 px-4 text-left font-medium text-slate-600 dark:text-slate-400 w-2/5 bg-slate-50 dark:bg-[#161821] text-xs uppercase tracking-wider">{label}</th>
            <td className="py-2.5 px-4 text-slate-800 dark:text-slate-200 text-sm font-medium">{value || '-'}</td>
        </tr>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Product Information */}
            <div className="bg-white dark:bg-[#1e202b] rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 overflow-hidden">
                <div className="bg-slate-50 dark:bg-[#161821] px-5 py-3 border-b border-slate-200 dark:border-gray-800">
                    <h5 className="font-bold text-slate-800 dark:text-white">Product Information</h5>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <tbody>
                            <InfoRow label="Code Product" value={data.code_product} />
                            <InfoRow label="Name Product" value={data.nm_product} />
                            <InfoRow label="Description" value={data.product_deskripsi} />
                            <InfoRow label="Delivery Order" value={data.do_code} />
                            <InfoRow label="Warranty Start" value={data.waranty_start} />
                            <InfoRow label="Warranty Time" value={data.waranty_time ? `${data.waranty_time} Month` : '-'} />
                            <InfoRow label="Warranty End" value={data.waranty_end} />
                            <InfoRow label="Warranty Status" value={renderWarrantyStatus()} />
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white dark:bg-[#1e202b] rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 overflow-hidden">
                <div className="bg-slate-50 dark:bg-[#161821] px-5 py-3 border-b border-slate-200 dark:border-gray-800">
                    <h5 className="font-bold text-slate-800 dark:text-white">Customer Information</h5>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <tbody>
                            <InfoRow label="Customer" value={data.customer} />
                            <InfoRow label="Address" value={data.customer_address} />
                            <InfoRow label="Kabupaten/Kota" value={data.kabupaten} />
                            <InfoRow label="Provinsi" value={data.provinsi} />
                            <InfoRow label="Phone" value={data.customer_phone} />
                            <InfoRow label="Mobile" value={data.customer_mobile} />
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
