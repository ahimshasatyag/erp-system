import React from 'react';
import type { SerialNumberHistory } from '../api/cekSerialNumberApi';

interface CekSerialNumberHistoryProps {
    history: SerialNumberHistory[];
}

export default function CekSerialNumberHistory({ history }: CekSerialNumberHistoryProps) {
    return (
        <div className="bg-white dark:bg-[#1e202b] rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 overflow-hidden mb-6">
            <div className="bg-slate-50 dark:bg-[#161821] px-5 py-4 border-b border-slate-200 dark:border-gray-800">
                <h5 className="font-bold text-slate-800 dark:text-white">History Services</h5>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    <thead className="text-xs uppercase bg-slate-50 dark:bg-gray-800 text-slate-700 dark:text-slate-400 border-b border-slate-200 dark:border-gray-700">
                        <tr>
                            <th className="px-5 py-3 font-semibold">No CST</th>
                            <th className="px-5 py-3 font-semibold">CST Date</th>
                            <th className="px-5 py-3 font-semibold">Catatan Kerusakan</th>
                            <th className="px-5 py-3 font-semibold">Total Realisasi</th>
                            <th className="px-5 py-3 font-semibold">Laporan Akhir</th>
                            <th className="px-5 py-3 font-semibold">Teknisi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history && history.length > 0 ? (
                            history.map((row, index) => (
                                <tr 
                                    key={index} 
                                    className="border-b border-slate-100 dark:border-gray-800 last:border-0 hover:bg-slate-50 dark:hover:bg-[#161821] transition-colors"
                                >
                                    <td className="px-5 py-3 font-medium text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                                        {row.cst_code}
                                    </td>
                                    <td className="px-5 py-3">{row.cst_date}</td>
                                    <td className="px-5 py-3 max-w-xs truncate" title={row.catatan_kerusakan}>{row.catatan_kerusakan}</td>
                                    <td className="px-5 py-3 text-center">
                                        <span className="px-2 py-1 bg-slate-100 dark:bg-gray-700 rounded-md text-xs font-medium">
                                            {row.total_realisasi}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 max-w-xs truncate" title={row.laporan_akhir}>{row.laporan_akhir}</td>
                                    <td className="px-5 py-3">{row.teknisi}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-5 py-8 text-center text-slate-500 dark:text-slate-400 italic">
                                    No history services found for this serial number.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
