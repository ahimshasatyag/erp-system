import React from 'react';
import { useParams } from 'react-router-dom';
import { useLogBookCustomerForm } from '../hooks/useLogBookCustomers';
import { LogBookCustomerForm } from '../forms/LogBookCustomerForm';

export default function LogBookCustomerEditPage() {
    const { id } = useParams<{ id: string }>();
    const { initialData, customers, saveLogBook, loading, error } = useLogBookCustomerForm(id);

    return (
        <div className="w-full min-h-screen py-2 px-6">
            <div className="flex justify-between items-center mb-6 pt-2">
                <p className="text-[32px] font-normal text-[#3f2a2a] tracking-tight">Data Log Book Customers</p>
                <div className="text-[13px] text-gray-500 font-medium">EMM Service / Log Book Customers / Data</div>
            </div>

            <div className="bg-white rounded shadow-sm border border-gray-200 p-6">
                {error && <div className="mb-4 p-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200">{error}</div>}
                
                {loading && !initialData ? (
                    <div className="text-center py-8 text-slate-500">Loading data...</div>
                ) : (
                    <LogBookCustomerForm
                        initialData={initialData}
                        customers={customers}
                        onSubmit={saveLogBook}
                        loading={loading}
                        isEdit={true}
                    />
                )}
            </div>
        </div>
    );
}
