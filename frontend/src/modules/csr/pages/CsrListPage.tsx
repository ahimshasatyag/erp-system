import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CsrFilters from '../components/CsrFilters';
import CsrTable from '../components/CsrTable';
import { useGetCsrs, useGetMenuInfo } from '../hooks/useCsr';

export default function CsrListPage() {
    const [draftFilters, setDraftFilters] = useState({
        search: '',
        start_date: '',
        end_date: '',
        status: '',
        all: false
    });

    const [activeFilters, setActiveFilters] = useState({
        search: '',
        start_date: '',
        end_date: '',
        status: '',
        all: false
    });

    const { data, isLoading, isError } = useGetCsrs({
        ...activeFilters,
        all: activeFilters.all ? true : undefined,
    });

    const { data: menuInfo } = useGetMenuInfo('10603');
    const menuTitle = menuInfo?.data?.nm_menu || menuInfo?.nm_menu || 'Customer Request (CSR)';

    const handleFilterChange = (name: string, value: string | boolean) => {
        if (name === 'triggerFilter') {
            setActiveFilters(draftFilters);
            return;
        }
        setDraftFilters(prev => ({ ...prev, [name]: value }));
    };

    // Apply local status filtering if needed, though backend should ideally handle it
    const filteredData = data?.data?.filter((item: any) => {
        if (activeFilters.status && item.csr_status !== activeFilters.status) return false;
        return true;
    });

    return (
        <div className="w-full min-h-screen py-2 px-6">
            <div className="flex justify-between items-center mb-6 pt-2">
                {/* Title - Left */}
                <p className="text-[32px] font-normal text-[#3f2a2a] tracking-tight">{menuTitle}</p>

                {/* Breadcrumb - Right */}
                <div className="text-[13px] text-gray-500 font-medium">EMM Service / CSR / CSR</div>
            </div>

            <div className="bg-white rounded shadow-sm border border-gray-200">
                <div className="p-6">
                    {/* Top Add Button Row - Left */}
                    <div className="flex justify-start mb-6">
                        <Link
                            to="/csr/create"
                            className="bg-[#20c997] hover:bg-[#1ba87e] text-white px-4 py-2 rounded text-sm font-bold inline-flex items-center"
                        >
                            <span className="font-bold mr-1 text-lg leading-none">+</span> Add New
                        </Link>
                    </div>

                    {/* Filter Row - Centered */}
                    <div className="flex justify-center mb-10">
                        <CsrFilters filters={draftFilters} onChange={handleFilterChange} />
                    </div>

                    {/* Show Entries, Copy, Search Row */}
                    <div className="flex justify-between items-center mb-4 text-sm text-gray-600 font-medium">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <span>Show</span>
                                <select className="border border-gray-300 rounded px-2 py-1 outline-none text-gray-700 font-normal">
                                    <option>10</option>
                                    <option>25</option>
                                    <option>50</option>
                                </select>
                                <span>entries</span>
                            </div>
                            <button className="bg-[#6c757d] hover:bg-[#5a6268] text-white px-4 py-1.5 rounded font-normal">Copy</button>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>Search:</span>
                            <div className="relative">
                                <input type="text" className="border border-gray-300 rounded px-2 py-1.5 w-56 outline-none font-normal" />
                                <span className="absolute right-2 top-2 text-gray-400">
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                </span>
                            </div>
                        </div>
                    </div>

                    {isError ? (
                        <div className="bg-red-50 text-red-600 p-4 rounded-md">Error loading CSR data. Please try again later.</div>
                    ) : (
                        <CsrTable data={filteredData || []} isLoading={isLoading} />
                    )}
                </div>
            </div>
        </div>
    );
}
