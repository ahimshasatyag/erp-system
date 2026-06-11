import React, { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import SupplierTable from '../components/SupplierTable';
import { useSuppliers } from '../hooks/useSupplier';

const SupplierListPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [params, setParams] = useState<any>({ page: 1, per_page: 10, sort_by: 'date_create', sort_dir: 'desc' });

    const { data: response, isLoading, isFetching, isError } = useSuppliers(params);

    const handleParamsChange = (newParams: any) => {
        setParams((prev: any) => ({ ...prev, ...newParams }));
    };

    const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleParamsChange({ search: searchTerm, page: 1 });
        }
    };

    const menuTitle = 'Supplier';

    return (
        <div className="w-full min-h-screen py-2 px-6">
            <div className="flex justify-between items-center mb-6 pt-2">
                <p className="text-[32px] font-normal text-[#3f2a2a] tracking-tight">{menuTitle}</p>
                <div className="text-[13px] text-gray-500 font-medium">EMM Master / {menuTitle}</div>
            </div>

            <div className="bg-white rounded shadow-sm border border-gray-200">
                <div className="p-6">
                    <div className="flex justify-start mb-6">
                        <Link
                            to="/suppliers/create"
                            className="bg-[#20c997] hover:bg-[#1ba87e] text-white px-3 py-1.5 rounded text-[13px] font-bold inline-flex items-center"
                        >
                            <span className="font-bold mr-1 text-base leading-none">+</span> Add Supplier
                        </Link>
                    </div>

                    {isError && (
                        <div className="p-4 bg-red-100 text-red-700 rounded border border-red-400 mb-4">Error loading suppliers</div>
                    )}

                    <div className="relative">
                        {(isLoading || isFetching) && (
                            <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#20c997]"></div>
                            </div>
                        )}
                        <SupplierTable
                            suppliers={response?.data || []}
                            meta={response?.meta}
                            onParamsChange={handleParamsChange}
                            searchElement={
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="border border-gray-300 rounded px-2 py-1.5 w-56 outline-none font-normal text-sm"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyDown={handleSearch}
                                    />
                                    <span className="absolute right-2 top-2 text-gray-400">
                                        <svg className={`w-4 h-4 animate-spin ${isFetching ? '' : 'hidden'}`} fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    </span>
                                </div>
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupplierListPage;
