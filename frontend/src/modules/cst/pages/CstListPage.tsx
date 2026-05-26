import React, { useState } from 'react';
import CstFilters from '../components/CstFilters';
import CstTable from '../components/CstTable';
import { useGetCsts, useGetMenuInfo } from '../hooks/useCst';

export default function CstListPage() {
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

    const { data, isLoading, isError } = useGetCsts({
        ...activeFilters,
        all: activeFilters.all ? true : undefined,
    });

    const { data: menuInfo } = useGetMenuInfo('10604');
    const menuTitle = menuInfo?.data?.nm_menu || menuInfo?.nm_menu || 'Customer Service Ticket (CST)';

    const handleFilterChange = (name: string, value: string | boolean) => {
        if (name === 'triggerFilter') {
            setActiveFilters(draftFilters);
            return;
        }
        setDraftFilters(prev => ({ ...prev, [name]: value }));
    };

    // Local filter override to cover status filtering on query results
    const filteredData = data?.data?.filter((item: any) => {
        if (activeFilters.status && item.status !== activeFilters.status) return false;
        return true;
    });

    return (
        <div className="w-full min-h-screen py-2 px-6">
            <div className="flex justify-between items-center mb-6 pt-2">
                {/* Title - Left */}
                <p className="text-[32px] font-normal text-[#3f2a2a] tracking-tight">{menuTitle}</p>

                {/* Breadcrumb - Right */}
                <div className="text-[13px] text-gray-500 font-medium">EMM Service / CST / CST</div>
            </div>

            <div className="bg-white rounded shadow-sm border border-gray-200">
                <div className="p-6">
                    {/* Filter Row - Centered */}
                    <div className="flex justify-center mb-10 mt-2">
                        <CstFilters filters={draftFilters} onChange={handleFilterChange} />
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
                                <input 
                                    type="text" 
                                    className="border border-gray-300 rounded px-2 py-1.5 w-56 outline-none font-normal" 
                                    value={draftFilters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleFilterChange('triggerFilter', true);
                                        }
                                    }}
                                />
                                {isLoading && (
                                    <span className="absolute right-2 top-2 text-gray-400">
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {isError ? (
                        <div className="bg-red-50 text-red-600 p-4 rounded-md">Error loading CST data. Please try again later.</div>
                    ) : (
                        <CstTable data={filteredData || []} isLoading={isLoading} />
                    )}
                </div>
            </div>
        </div>
    );
}
