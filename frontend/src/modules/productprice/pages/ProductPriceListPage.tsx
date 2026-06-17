import React, { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useProductPrice } from '../hooks/useProductPrice';
import ProductPriceTable from '../components/ProductPriceTable';
import { getMenuInfo } from '../api/productPriceApi';
import type { ProductPrice } from '../api/productPriceApi';
import { showAlert } from '../../../components/SweetAlert';

const ProductPriceListPage: React.FC = () => {
    const [searchInput, setSearchInput] = useState<string>('');
    const [selectedProducts, setSelectedProducts] = useState<ProductPrice[]>([]);
    const { products, meta, loading, error, updateParams, toggleStatus, fetchAllMatching } = useProductPrice();
    const navigate = useNavigate();

    const { data: menuInfo } = useQuery({
        queryKey: ["menu", "10401"],
        queryFn: () => getMenuInfo("10401"),
    });
    const menuTitle = menuInfo?.data?.nm_menu || menuInfo?.nm_menu || 'Product Price';

    const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            updateParams({ search: { value: searchInput }, page: 1 });
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            showAlert.confirm(
                'Pilih Semua Data?',
                'Apakah Anda ingin memilih SEMUA data di seluruh halaman (sesuai pencarian saat ini)?',
                async () => {
                    const allData = await fetchAllMatching();
                    setSelectedProducts(allData);
                },
                'Hanya Halaman Ini',
                'Ya, Pilih Semua',
                () => {
                    setSelectedProducts([...products]);
                }
            );
        } else {
            setSelectedProducts([]);
        }
    };

    const handleEditMulti = () => {
        if (selectedProducts.length === 0) {
            showAlert.warning('Peringatan', 'Silakan pilih minimal satu produk terlebih dahulu!');
            return;
        }
        
        // Pass the selected items to the Multi Edit Page
        navigate('/productprice/edit-multi', { state: { selectedProducts } });
    };

    const batchActions = (
        <>
            <button
                onClick={handleEditMulti}
                className="bg-[#17a2b8] hover:bg-[#138496] text-white px-2.5 py-1 rounded text-[13px] shadow-sm transition-colors"
            >
                Multiple Update
            </button>
        </>
    );

    return (
        <div className="w-full min-h-screen py-2 px-6">
            <div className="flex justify-between items-center mb-6 pt-2">
                <p className="text-[32px] font-normal text-[#3f2a2a] tracking-tight">{menuTitle}</p>
                <div className="text-[13px] text-gray-500 font-medium">EMM Service / {menuTitle}</div>
            </div>

            <div className="bg-white rounded shadow-sm border border-gray-200">
                <div className="p-6">
                    <div className="flex justify-start mb-6 gap-2">
                        <Link
                            to="/productprice/create"
                            className="bg-[#20c997] hover:bg-[#1ba87e] text-white px-3 py-1.5 rounded text-[13px] font-bold inline-flex items-center"
                        >
                            <span className="font-bold mr-1 text-base leading-none">+</span> Add New
                        </Link>
                        <Link
                            to="/productprice/upload"
                            className="bg-[#20c997] hover:bg-[#1ba87e] text-white px-3 py-1.5 rounded text-[13px] font-bold inline-flex items-center"
                        >
                            Upload
                        </Link>
                    </div>

                    {error ? (
                        <div className="p-4 bg-red-100 text-red-700 rounded border border-red-400 mb-4">Error: {error}</div>
                    ) : null}

                    <div className="relative">
                        {loading && (
                            <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#20c997]"></div>
                            </div>
                        )}
                        <ProductPriceTable
                            products={products}
                            meta={meta}
                            onToggleStatus={toggleStatus}
                            onParamsChange={updateParams}
                            selectedProducts={selectedProducts}
                            onSelectionChange={setSelectedProducts}
                            onSelectAll={handleSelectAll}
                            batchActionsElement={batchActions}
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

export default ProductPriceListPage;
