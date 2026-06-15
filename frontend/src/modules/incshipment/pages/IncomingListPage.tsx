import React, { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useIncShipments } from '../hooks/useIncshipment';
import IncomingTable from '../components/IncomingTable';
import { useQuery } from '@tanstack/react-query';
import api from '../../../services/api';

const IncomingListPage: React.FC = () => {
    const [searchInput, setSearchInput] = useState<string>('');
    const [params, setParams] = useState({ page: 1, length: 10, search: '', status: 'ALL' });

    const { data, isLoading, isError } = useIncShipments(params.page, params.length, params.search, params.status);

    const { data: menuInfo } = useQuery({
        queryKey: ["menu", "10805"],
        queryFn: async () => {
            try {
                const res = await api.get(`/menus/10805`);
                return res.data;
            } catch (e) {
                return { nm_menu: 'Incoming Shipments' };
            }
        },
    });
    const menuTitle = menuInfo?.data?.nm_menu || menuInfo?.nm_menu || 'Incoming Shipments';

    const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setParams(prev => ({ ...prev, search: searchInput, page: 1 }));
        }
    };

    const handleParamsChange = (newParams: any) => {
        // incoming pagination uses perPage, but to stay compatible with Quotation pattern we map length -> perPage
        setParams(prev => ({ ...prev, ...newParams }));
    };

    return (
        <div className="w-full min-h-screen py-2 px-4">
            <div className="flex justify-between items-center mb-4 pt-2">
                <p className="text-2xl font-semibold text-[#3f2a2a] tracking-tight">{menuTitle}</p>
                <div className="text-[12px] text-gray-500 font-medium">EMM Master / {menuTitle}</div>
            </div>

            <div className="bg-white rounded shadow-sm border border-gray-200">
                <div className="p-4">
                    {isError ? (
                        <div className="p-4 bg-red-100 text-red-700 rounded border border-red-400 mb-4">Gagal memuat data</div>
                    ) : null}

                    <div className="relative">
                        {isLoading && (
                            <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#20c997]"></div>
                            </div>
                        )}
                        <IncomingTable
                            data={data?.data || []}
                            meta={data?.meta || {}}
                            onParamsChange={handleParamsChange}
                            searchElement={
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            className="border border-gray-300 rounded px-2 py-1.5 w-56 outline-none font-normal text-sm"
                                            value={searchInput}
                                            onChange={(e) => setSearchInput(e.target.value)}
                                            onKeyDown={handleSearch}
                                        />
                                        <span className="absolute right-2 top-2 text-gray-400">
                                            <svg className={`w-4 h-4 animate-spin ${isLoading ? '' : 'hidden'}`} fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        </span>
                                    </div>
                                </div>
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IncomingListPage;
