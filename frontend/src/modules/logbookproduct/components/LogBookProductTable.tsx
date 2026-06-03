import React from 'react';
import type { LogBookProduct } from '../api/logBookProductApi';

interface LogBookProductTableProps {
    logBooks: LogBookProduct[];
}

export const LogBookProductTable: React.FC<LogBookProductTableProps> = ({ logBooks }) => {
    
    return (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-xs text-slate-700 bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-4 py-3 font-bold cursor-pointer hover:bg-slate-100">
                            <div className="flex items-center justify-between">
                                Product Code <i className="fa fa-sort text-slate-400"></i>
                            </div>
                        </th>
                        <th className="px-4 py-3 font-bold cursor-pointer hover:bg-slate-100">
                            <div className="flex items-center justify-between">
                                Product Name <i className="fa fa-sort text-slate-400"></i>
                            </div>
                        </th>
                        <th className="px-4 py-3 font-bold cursor-pointer hover:bg-slate-100">
                            <div className="flex items-center justify-between">
                                Create By <i className="fa fa-sort text-slate-400"></i>
                            </div>
                        </th>
                        <th className="px-4 py-3 font-bold cursor-pointer hover:bg-slate-100">
                            <div className="flex items-center justify-between">
                                Date <i className="fa fa-sort text-slate-400"></i>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                    {logBooks.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="px-4 py-6 text-center text-slate-500">No data available</td>
                        </tr>
                    ) : (
                        logBooks.map((item) => (
                            <tr key={item.id_log_book} className="bg-white hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-3">{item.product?.code_product || '-'}</td>
                                <td className="px-4 py-3">{item.product?.nm_product || '-'}</td>
                                <td className="px-4 py-3">{item.user?.nm_users || item.user?.username || '-'}</td>
                                <td className="px-4 py-3">{item.date_log_book}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};
