import React, { useState } from 'react';
import { useSerialNumberDetail } from '../hooks/useCekSerialNumber';
import CekSerialNumberSearch from '../components/CekSerialNumberSearch';
import CekSerialNumberDetail from '../components/CekSerialNumberDetail';
import CekSerialNumberHistory from '../components/CekSerialNumberHistory';

export default function CekSerialNumberPage() {
    const [searchedBarcode, setSearchedBarcode] = useState<string>('');

    const { data: response, isLoading, isError, error } = useSerialNumberDetail(searchedBarcode);

    const handleSearch = (barcode: string) => {
        setSearchedBarcode(barcode);
    };

    return (
        <div className="w-full min-h-screen py-2 px-6 text-sm text-gray-800 dark:text-gray-300 transition-colors duration-200">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6 pt-2">
                <div>
                    <h2 className="text-[32px] font-normal text-gray-900 dark:text-white tracking-tight">Cek Serial Number</h2>
                </div>
                <div className="text-[13px] text-gray-500 font-medium">EMM Service / Cek Serial Number</div>
            </div>

            <div className="max-w-6xl">
                {/* Search Component */}
                <CekSerialNumberSearch onSearch={handleSearch} isLoading={isLoading} />

                {/* Loading State Skeleton (Alternative to simple text) */}
                {isLoading && (
                    <div className="animate-pulse space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="h-64 bg-slate-200 dark:bg-gray-800 rounded-xl"></div>
                            <div className="h-64 bg-slate-200 dark:bg-gray-800 rounded-xl"></div>
                        </div>
                        <div className="h-48 bg-slate-200 dark:bg-gray-800 rounded-xl"></div>
                    </div>
                )}

                {/* Error State */}
                {isError && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-200 dark:border-red-800 text-center flex flex-col items-center justify-center gap-2">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="font-medium">
                            {/* @ts-ignore */}
                            {error?.response?.data?.message || 'Gagal mencari data. Pastikan Serial Number benar dan coba lagi.'}
                        </p>
                    </div>
                )}

                {/* Results View */}
                {!isLoading && !isError && response?.status === true && response?.data?.[0] && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <CekSerialNumberDetail data={response.data[0]} />
                        <CekSerialNumberHistory history={response.history || []} />
                    </div>
                )}
                
                {/* Initial Empty State / Not Found (Handled implicitly by isError for 404, but just in case it returns 200 with status=false) */}
                {!isLoading && !isError && searchedBarcode && response?.status === false && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 p-8 rounded-xl border border-amber-200 dark:border-amber-800 text-center">
                        <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="font-medium text-lg">Data Tidak Ditemukan</p>
                        <p className="text-sm mt-1 opacity-80">Serial Number "{searchedBarcode}" tidak terdaftar di sistem.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
