import React from 'react';

interface DeliverySectionProps {
    register: any;
    errors: any;
    isEditMode: boolean;
    isViewMode: boolean;
    warrantyEndDisplay: string;
    warrantyStatus: { text: string; color: string } | null;
}

export default function DeliverySection({
    register,
    errors,
    isEditMode,
    isViewMode,
    warrantyEndDisplay,
    warrantyStatus
}: DeliverySectionProps) {
    return (
        <div className="space-y-3">
            <div className="border-b border-gray-200 dark:border-gray-800 pb-2">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white tracking-wide">Delivery Info</h3>
            </div>
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
                <table className="w-full text-sm text-gray-800 dark:text-gray-300 border-collapse table-fixed">
                    <tbody>
                        <tr className="bg-white dark:bg-[#1e202b] hover:bg-gray-50 dark:hover:bg-[#232733]/30">
                            <td className="py-2.5 px-4 font-semibold text-gray-700 dark:text-gray-400 w-[30%] text-left">Delivery Order</td>
                            <td className="py-2.5 px-1 text-center w-[5%]">:</td>
                            <td className="py-2.5 px-4">
                                <input
                                    type="text"
                                    {...register('do_code')}
                                    disabled={isEditMode || isViewMode}
                                    placeholder="Enter DO Nomor"
                                    className="w-full bg-white dark:bg-[#161821] text-gray-800 dark:text-white border border-gray-350 dark:border-gray-800 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </td>
                        </tr>
                        <tr className="bg-gray-50 dark:bg-[#16171d]/50 hover:bg-gray-100 dark:hover:bg-[#232733]/30">
                            <td className="py-2.5 px-4 font-semibold text-gray-700 dark:text-gray-400 text-left">Warranty Start</td>
                            <td className="py-2.5 px-1 text-center">:</td>
                            <td className="py-2.5 px-4">
                                <input
                                    type="date"
                                    {...register('tgl_delivered')}
                                    disabled={isEditMode || isViewMode}
                                    className="w-full bg-white dark:bg-[#161821] text-gray-800 dark:text-white border border-gray-350 dark:border-gray-800 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#1e202b] hover:bg-gray-50 dark:hover:bg-[#232733]/30">
                            <td className="py-2.5 px-4 font-semibold text-gray-700 dark:text-gray-400 text-left">Warranty Time</td>
                            <td className="py-2.5 px-1 text-center">:</td>
                            <td className="py-2.5 px-4">
                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                    <span className="font-bold text-gray-800 dark:text-white">12</span> Month <span>{warrantyEndDisplay}</span>
                                </div>
                            </td>
                        </tr>
                        <tr className="bg-gray-50 dark:bg-[#16171d]/50 hover:bg-gray-100 dark:hover:bg-[#232733]/30">
                            <td className="py-2.5 px-4 font-semibold text-gray-700 dark:text-gray-400 text-left">Warranty Status</td>
                            <td className="py-2.5 px-1 text-center">:</td>
                            <td className="py-2.5 px-4">
                                {warrantyStatus ? (
                                    <span className={`px-3 py-1 rounded text-xs font-bold ${warrantyStatus.color}`}>
                                        {warrantyStatus.text}
                                    </span>
                                ) : (
                                    <span className="text-xs text-gray-500">-</span>
                                )}
                            </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#1e202b] hover:bg-gray-50 dark:hover:bg-[#232733]/30">
                            <td className="py-2.5 px-4 font-semibold text-gray-700 dark:text-gray-400 text-left">Status SO</td>
                            <td className="py-2.5 px-1 text-center">:</td>
                            <td className="py-2.5 px-4">
                                <input
                                    type="text"
                                    readOnly
                                    {...register('status')}
                                    placeholder="SO Status"
                                    className="w-1/2 bg-gray-50 dark:bg-[#161821] text-gray-500 border border-gray-300 dark:border-gray-800 rounded px-3 py-1 text-xs focus:outline-none"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
