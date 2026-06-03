import React from 'react';
import { useLogBookCustomerForm } from '../hooks/useLogBookCustomers';
import { LogBookCustomerForm } from '../forms/LogBookCustomerForm';

export default function LogBookCustomerAddPage() {
    const { customers, saveLogBook, loading, error } = useLogBookCustomerForm();

    return (
        <div className="w-full min-h-screen py-2 px-6">
            <div className="flex justify-between items-center mb-6 pt-2">
                <p className="text-[32px] font-normal text-[#3f2a2a] tracking-tight">Tambah Log Book Customers</p>
                <div className="text-[13px] text-gray-500 font-medium">EMM Service / Log Book Customers / Tambah</div>
            </div>

            <div className="bg-white rounded shadow-sm border border-gray-200 p-6">
                {error && <div className="mb-4 p-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200">{error}</div>}
                
                {loading && customers.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">Loading form data...</div>
                ) : (
                    <LogBookCustomerForm
                        customers={customers}
                        onSubmit={saveLogBook}
                        loading={loading}
                        isEdit={false}
                    />
                )}
            </div>
        </div>
    );
}
