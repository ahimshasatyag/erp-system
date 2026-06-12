import React, { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePurchaseRequisition } from '../hooks/usePurchaseRequisition';
import PurchaseRequisitionTable from '../components/PurchaseRequisitionTable';
import { useQuery } from '@tanstack/react-query';
import api from '../../../services/api';

const PurchaseRequisitionListPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState<string>('');
    const { purchaseRequisitions, meta, loading, error, updateParams } = usePurchaseRequisition();

    // The menu ID for PR is 10803 according to Cform.php
    const { data: menuInfo } = useQuery({
        queryKey: ["menu", "10803"],
        queryFn: async () => {
            const { data } = await api.get(`/menus/10803`);
            return data;
        },
    });

    const menuTitle = menuInfo?.data?.nm_menu || menuInfo?.nm_menu || 'Purchase Requisition';

    const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            updateParams({ search: searchInput, page: 1 });
        }
    };

    return (
        <div className="w-full min-h-screen py-2 px-6">
            <div className="flex justify-between items-center mb-6 pt-2">
                <p className="text-[32px] font-normal text-[#3f2a2a] tracking-tight">{menuTitle}</p>
                <div className="text-[13px] text-gray-500 font-medium">EMM Master / {menuTitle}</div>
            </div>

            <div className="bg-white rounded shadow-sm border border-gray-200">
                <div className="p-6">
                    <div className="flex justify-start mb-6 gap-2">
                        <Link
                            to="/purchaserequisitions/create"
                            className="bg-[#20c997] hover:bg-[#1ba87e] text-white px-3 py-1.5 rounded text-[13px] font-bold inline-flex items-center"
                        >
                            <span className="font-bold mr-1 text-base leading-none">+</span> Create
                        </Link>
                        {/* List PR button from vformlist.php. For now we will just re-route to list-pr or trigger a filter */}
                        <button
                            onClick={() => navigate('/purchaserequisitions/list-pr')}
                            className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-3 py-1.5 rounded text-[13px] font-bold inline-flex items-center"
                        >
                            List PR
                        </button>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-100 text-red-700 rounded border border-red-400 mb-4">Error: {error}</div>
                    )}

                    <div className="relative">
                        {loading && (
                            <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#20c997]"></div>
                            </div>
                        )}
                        <PurchaseRequisitionTable
                            purchaseRequisitions={purchaseRequisitions}
                            meta={meta}
                            onParamsChange={updateParams}
                            searchElement={
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search PR..."
                                        className="border border-gray-300 rounded px-2 py-1.5 w-56 outline-none font-normal text-sm"
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        onKeyDown={handleSearch}
                                    />
                                    <span className="absolute right-2 top-2 text-gray-400">
                                        <svg className={`w-4 h-4 animate-spin ${loading ? '' : 'hidden'}`} fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
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

export default PurchaseRequisitionListPage;
