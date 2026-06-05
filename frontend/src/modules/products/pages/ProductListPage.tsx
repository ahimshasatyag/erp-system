import React, { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductTable from '../components/ProductTable';
import { getMenuInfo } from '../api/productApi';
import type { Product } from '../api/productApi';
import { showAlert } from '../../../components/SweetAlert';
import { useQuery } from '@tanstack/react-query';

const ProductListPage: React.FC = () => {
    const [searchInput, setSearchInput] = useState<string>('');
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const { products, meta, loading, error, updateParams, toggleStatus, fetchAllMatching } = useProducts();

    const { data: menuInfo } = useQuery({
        queryKey: ["menu", "10501"],
        queryFn: () => getMenuInfo("10501"),
    });
    const menuTitle = menuInfo?.data?.nm_menu || menuInfo?.nm_menu || 'Product';

    const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            updateParams({ search: { value: searchInput }, page: 1 });
        }
    };

    const activeCount = selectedProducts.filter(p => String(p.flag_active) === 'Y' || String(p.flag_active) === '1').length;
    const inactiveCount = selectedProducts.length - activeCount;

    const showActiveBtn = selectedProducts.length === 0 || (activeCount === 0 && inactiveCount > 0);
    const showInactiveBtn = selectedProducts.length === 0 || (activeCount > 0 && inactiveCount === 0);

    const handleBatchToggle = (status: string) => {
        if (selectedProducts.length === 0) {
            showAlert.warning('Peringatan', 'Silakan pilih minimal satu produk terlebih dahulu!');
            return;
        }
        showAlert.confirm(
            'Konfirmasi',
            `Anda yakin ingin merubah status ${selectedProducts.length} produk?`,
            async () => {
                const ids = selectedProducts.map(p => p.id_product);
                const success = await toggleStatus(ids, status);
                if (success) {
                    setSelectedProducts([]);
                }
            }
        );
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

    const batchActions = (
        <>
            {showActiveBtn && (
                <button
                    onClick={() => handleBatchToggle('1')}
                    className="bg-[#f8f9fa] border border-[#ccc] hover:bg-[#e2e6ea] text-[#333] px-2.5 py-1 rounded text-[13px] shadow-sm transition-colors"
                >
                    Aktif
                </button>
            )}
            {showInactiveBtn && (
                <button
                    onClick={() => handleBatchToggle('0')}
                    className="bg-[#f8f9fa] border border-[#ccc] hover:bg-[#e2e6ea] text-[#333] px-2.5 py-1 rounded text-[13px] shadow-sm transition-colors"
                >
                    Tidak Aktif
                </button>
            )}
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
                            to="/product/create"
                            className="bg-[#20c997] hover:bg-[#1ba87e] text-white px-3 py-1.5 rounded text-[13px] font-bold inline-flex items-center"
                        >
                            <span className="font-bold mr-1 text-base leading-none">+</span> Add New
                        </Link>
                        <Link
                            to="/product/upload"
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
                        <ProductTable
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

export default ProductListPage;
