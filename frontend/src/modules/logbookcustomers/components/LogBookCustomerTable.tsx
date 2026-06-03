import React from 'react';
import { type LogBookCustomerData } from '../api/logBookCustomerApi';
import { Link } from 'react-router-dom';

interface LogBookCustomerTableProps {
    data: LogBookCustomerData[];
}

export const LogBookCustomerTable: React.FC<LogBookCustomerTableProps> = ({ data }) => {
    return (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-xs text-slate-700 bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-4 py-3 font-bold cursor-pointer hover:bg-slate-100">
                            <div className="flex items-center justify-between">
                                Customers Name <i className="fa fa-sort text-slate-400"></i>
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
                        <th className="px-4 py-3 font-bold text-center">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                                No records found.
                            </td>
                        </tr>
                    ) : (
                        data.map((item, index) => (
                            <tr key={item.id_log_book || index} className="hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-3 font-medium text-slate-900">{item.nm_customers}</td>
                                <td className="px-4 py-3">{item.nm_users}</td>
                                <td className="px-4 py-3">{item.date_log_book}</td>
                                <td className="px-4 py-3 text-center">
                                    <Link 
                                        to={`/logbookcustomers/${item.id_log_book}/edit`} 
                                        className="text-blue-500 hover:text-blue-700 p-1"
                                        title="View/Edit Details"
                                    >
                                        <i className="fa fa-edit"></i>
                                    </Link>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};
