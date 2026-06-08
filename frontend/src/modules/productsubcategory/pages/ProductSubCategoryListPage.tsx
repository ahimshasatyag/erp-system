import React, { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { useProductSubCategory } from '../hooks/useProductSubCategory';
import ProductSubCategoryTable from '../components/ProductSubCategoryTable';
import { getMenuInfo } from '../api/productSubCategoryApi';
import { useQuery } from '@tanstack/react-query';

const ProductSubCategoryListPage: React.FC = () => {
    const [searchInput, setSearchInput] = useState<string>('');
    const { subCategories, meta, loading, error, updateParams } = useProductSubCategory();

    const { data: menuInfo } = useQuery({
        queryKey: ["menu", "10503"], // id_menu = 10503 from Cform.php
        queryFn: () => getMenuInfo("10503"),
    });
    const menuTitle = menuInfo?.data?.nm_menu || menuInfo?.nm_menu || 'Product Subcategory';

    const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            updateParams({ search: { value: searchInput }, page: 1 });
        }
    };

    return (
        <div className="w-full min-h-screen py-2 px-6">
            <div className="flex justify-between items-center mb-6 pt-2">
                <p className="text-[32px] font-normal text-[#3f2a2a] tracking-tight">{menuTitle}</p>
                <div className="text-[13px] text-gray-500 font-medium">EMM Service / {menuTitle}</div>
            </div>

            <div className="bg-white rounded shadow-sm border border-gray-200">
                <div className="p-6">
                    <div className="flex justify-start mb-6">
                        <Link
                            to="/productsubcategory/create"
                            className="bg-[#20c997] hover:bg-[#1ba87e] text-white px-3 py-1.5 rounded text-[13px] font-bold inline-flex items-center"
                        >
                            <span className="font-bold mr-1 text-base leading-none">+</span> Add {menuTitle}
                        </Link>
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
                        <ProductSubCategoryTable
                            subCategories={subCategories}
                            meta={meta}
                            onParamsChange={updateParams}
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

export default ProductSubCategoryListPage;
