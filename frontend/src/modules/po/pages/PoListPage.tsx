import React, { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import PoTable from '../components/PoTable';
import { getPos } from '../api';
import api from '../../../services/api';

export const PoListPage: React.FC = () => {
    const [searchInput, setSearchInput] = useState<string>('');
    const [params, setParams] = useState({ page: 1, per_page: 10, search: '', status: 'ALL' });

    const { data, isLoading, isError } = useQuery({
        queryKey: ['pos', params],
        queryFn: () => getPos(params.page, params.per_page, params.search, params.status),
    });

    const { data: menuInfo } = useQuery({
        queryKey: ["menu", "10804"], 
        queryFn: async () => {
            const res = await api.get(`/menus/10804`);
            return res.data;
        },
    });
    const menuTitle = menuInfo?.data?.nm_menu || menuInfo?.nm_menu || 'Purchase Orders';

    const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setParams(prev => ({ ...prev, search: searchInput, page: 1 }));
        }
    };

    const handleParamsChange = (newParams: any) => {
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
                    {/* Hapus div Add New button sesuai permintaan user sebelumnya, jadi kita tidak menampilkan link Create di sini */}

                    {isError ? (
                        <div className="p-4 bg-red-100 text-red-700 rounded border border-red-400 mb-4">Gagal memuat data</div>
                    ) : null}

                    <div className="relative">
                        {isLoading && (
                            <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#20c997]"></div>
                            </div>
                        )}
                        <PoTable
                            pos={data?.data || []}
                            meta={data?.meta || {}}
                            onParamsChange={handleParamsChange}
                            searchElement={
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
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
