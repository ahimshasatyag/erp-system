import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../api/productApi';

interface ProductTableProps {
    products: Product[];
    meta?: any;
    onToggleStatus: (ids: string[], status: string) => void;
    onParamsChange?: (params: any) => void;
    searchElement?: React.ReactNode;
    batchActionsElement?: React.ReactNode;
    selectedProducts?: Product[];
    onSelectionChange?: (products: Product[]) => void;
    onSelectAll?: (checked: boolean) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ 
    products = [], 
    meta = {}, 
    onToggleStatus, 
    onParamsChange, 
    searchElement,
    batchActionsElement,
    selectedProducts = [],
    onSelectionChange,
    onSelectAll
}) => {
    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
    const [length, setLength] = useState<number>(10);

    const handleSingleStatusToggle = (product: Product) => {
        const newStatus = (product.flag_active === 'Y' || product.flag_active === '1') ? '0' : '1';
        if (window.confirm(`Anda yakin ingin merubah status produk ${product.nm_product}?`)) {
            onToggleStatus([product.id_product], newStatus);
        }
    };

    const handleSort = (column: string) => {
        const newDir = (sortBy === column && sortDir === 'asc') ? 'desc' : 'asc';
        setSortBy(column);
        setSortDir(newDir);
        if (onParamsChange) {
            onParamsChange({ sort_by: column, sort_dir: newDir, page: 1 });
        }
    };

    const handleLengthChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const newLength = parseInt(e.target.value, 10);
        setLength(newLength);
        if (onParamsChange) {
            onParamsChange({ length: newLength, page: 1 });
        }
    };

    const handlePageChange = (page: number) => {
        if (onParamsChange) {
            onParamsChange({ page });
        }
    };

    const currentPage = meta?.current_page ? parseInt(meta.current_page.toString(), 10) : 1;
    const perPage = meta?.per_page ? parseInt(meta.per_page.toString(), 10) : 10;
    const total = meta?.total ? parseInt(meta.total.toString(), 10) : products.length;
    const lastPage = meta?.last_page ? parseInt(meta.last_page.toString(), 10) : 1;

    const getSortIcon = (key: string) => {
        if (sortBy !== key) {
            return <span className="text-gray-400 font-normal text-[10px]">⇅</span>;
        }
        if (sortDir === 'asc') {
            return <span className="text-blue-600 font-bold text-[12px]">↑</span>;
        }
        return <span className="text-blue-600 font-bold text-[12px]">↓</span>;
    };

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        if (lastPage <= 7) {
            for (let i = 1; i <= lastPage; i++) pages.push(i);
        } else {
            if (currentPage <= 4) {
                for (let i = 1; i <= 5; i++) pages.push(i);
                pages.push('...');
                pages.push(lastPage);
            } else if (currentPage >= lastPage - 3) {
                pages.push(1);
                pages.push('...');
                for (let i = lastPage - 4; i <= lastPage; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(lastPage);
            }
        }
        return pages;
    };

    return (
        <div className="w-full">
            <div className="flex flex-col mb-4">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-2 min-h-[38px]">
                        {batchActionsElement}
                    </div>
                    <div>
                        {searchElement}
                    </div>
                </div>
                <div className="flex justify-start items-center">
                    <div className="flex items-center gap-2 text-[13px] text-gray-600">
                        Tampilkan
                        <select 
                            value={length} 
                            onChange={(e) => {
                                setLength(Number(e.target.value));
                                onParamsChange?.({ length: Number(e.target.value), page: 1 });
                            }}
                            className="border border-gray-300 rounded px-1.5 py-0.5 outline-none text-[13px]"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                        Data
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto border-t border-b border-gray-200 mt-2">
                <table className="min-w-full divide-y divide-gray-200 text-[13px] whitespace-nowrap">
                    <thead className="bg-gray-50">
                        <tr>
                            <th onClick={() => handleSort('code_product')} className="px-3 py-2 text-left font-bold text-gray-600 cursor-pointer group border-r border-gray-200 hover:bg-gray-100 transition-colors whitespace-nowrap">
                                <div className="flex items-center justify-between">Product Code {getSortIcon('code_product')}</div>
                            </th>
                            <th onClick={() => handleSort('nm_product')} className="px-3 py-2 text-left font-bold text-gray-600 cursor-pointer group border-r border-gray-200 hover:bg-gray-100 transition-colors whitespace-nowrap">
                                <div className="flex items-center justify-between">Product Name {getSortIcon('nm_product')}</div>
                            </th>
                            <th onClick={() => handleSort('category')} className="px-3 py-2 text-left font-bold text-gray-600 cursor-pointer group border-r border-gray-200 hover:bg-gray-100 transition-colors whitespace-nowrap">
                                <div className="flex items-center justify-between">Category {getSortIcon('category')}</div>
                            </th>
                            <th onClick={() => handleSort('sub_category')} className="px-3 py-2 text-center font-bold text-gray-600 cursor-pointer group border-r border-gray-200 hover:bg-gray-100 transition-colors whitespace-nowrap">
                                <div className="flex items-center justify-center gap-1">Sub Category {getSortIcon('sub_category')}</div>
                            </th>
                            <th onClick={() => handleSort('unit')} className="px-3 py-2 text-center font-bold text-gray-600 cursor-pointer group border-r border-gray-200 hover:bg-gray-100 transition-colors whitespace-nowrap">
                                <div className="flex items-center justify-center gap-1">Satuan {getSortIcon('unit')}</div>
                            </th>
                            <th onClick={() => handleSort('brand')} className="px-3 py-2 text-center font-bold text-gray-600 cursor-pointer group border-r border-gray-200 hover:bg-gray-100 transition-colors whitespace-nowrap">
                                <div className="flex items-center justify-center gap-1">Brand {getSortIcon('brand')}</div>
                            </th>
                            <th onClick={() => handleSort('link_brosur')} className="px-3 py-2 text-center font-bold text-gray-600 cursor-pointer group border-r border-gray-200 hover:bg-gray-100 transition-colors whitespace-nowrap">
                                <div className="flex items-center justify-center gap-1">Link Brosur {getSortIcon('link_brosur')}</div>
                            </th>
                            <th className="px-3 py-2 text-center font-bold text-gray-600 border-r border-gray-200 whitespace-nowrap">
                                <div className="flex items-center justify-center gap-1">
                                    <span onClick={() => handleSort('flag_active')} className="cursor-pointer group hover:bg-gray-100 transition-colors flex items-center gap-1">Status {getSortIcon('flag_active')}</span>
                                    | 
                                    <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300 ml-1"
                                        checked={products.length > 0 && selectedProducts?.length >= products.length}
                                        onChange={(e) => {
                                            if (onSelectAll) {
                                                onSelectAll(e.target.checked);
                                            } else {
                                                if (e.target.checked) {
                                                    onSelectionChange?.([...products]);
                                                } else {
                                                    onSelectionChange?.([]);
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-3 py-10 text-center text-gray-500">No product data found.</td>
                            </tr>
                        ) : (
                            products.map((product, index) => (
                                <tr key={product.id_product} className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                    <td className="px-3 py-1.5 border-r border-gray-100 whitespace-nowrap">
                                        <Link to={`/product/edit/${product.id_product}`} state={{ code: product.code_product }} className="text-gray-600 hover:text-[#3b82f6] font-medium block">
                                            {product.code_product}
                                        </Link>
                                    </td>
                                    <td className="px-3 py-1.5 border-r border-gray-100 whitespace-nowrap">
                                        <Link to={`/product/edit/${product.id_product}`} state={{ code: product.code_product }} className="text-gray-600 hover:text-[#3b82f6] block">
                                            {product.nm_product}
                                        </Link>
                                    </td>
                                    <td className="px-3 py-1.5 border-r border-gray-100 whitespace-nowrap">
                                        <Link to={`/product/edit/${product.id_product}`} state={{ code: product.code_product }} className="text-gray-600 hover:text-[#3b82f6] block">
                                            {product.category?.name || '-'}
                                        </Link>
                                    </td>
                                    <td className="px-3 py-1.5 text-center border-r border-gray-100 whitespace-nowrap">
                                        <Link to={`/product/edit/${product.id_product}`} state={{ code: product.code_product }} className="text-gray-600 hover:text-[#3b82f6] block">
                                            {product.sub_category?.name || '-'}
                                        </Link>
                                    </td>
                                    <td className="px-3 py-1.5 text-center border-r border-gray-100 whitespace-nowrap">
                                        <Link to={`/product/edit/${product.id_product}`} state={{ code: product.code_product }} className="text-gray-600 hover:text-[#3b82f6] block">
                                            {product.unit?.name || '-'}
                                        </Link>
                                    </td>
                                    <td className="px-3 py-1.5 text-center border-r border-gray-100 whitespace-nowrap">
                                        <Link to={`/product/edit/${product.id_product}`} state={{ code: product.code_product }} className="text-gray-600 hover:text-[#3b82f6] block">
                                            {product.brand?.name || '-'}
                                        </Link>
                                    </td>
                                    <td className="px-3 py-1.5 text-center border-r border-gray-100 whitespace-nowrap">
                                        {product.link_brosur ? (
                                            <a 
                                                href={
                                                    product.link_brosur.startsWith('http') 
                                                        ? product.link_brosur 
                                                        : (product.link_brosur.includes('.com') || product.link_brosur.includes('www.') || product.link_brosur.includes('drive.google'))
                                                            ? `https://${product.link_brosur}`
                                                            : `http://localhost:8000/api/products/brosur/${product.link_brosur}`
                                                } 
                                                target="_blank" 
                                                rel="noreferrer" 
                                                className="text-blue-500 hover:underline"
                                            >
                                                Link
                                            </a>
                                        ) : null}
                                    </td>
                                    <td className="px-3 py-1.5 text-center whitespace-nowrap">
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="text-gray-600">{(String(product.flag_active) === 'Y' || String(product.flag_active) === '1') ? 'Aktif' : 'Tidak Aktif'}</span>
                                            <input 
                                                type="checkbox" 
                                                className="rounded border-gray-300"
                                                checked={selectedProducts?.some(p => p.id_product === product.id_product) || false}
                                                onChange={(e) => {
                                                    if (!selectedProducts || !onSelectionChange) return;
                                                    if (e.target.checked) {
                                                        onSelectionChange([...selectedProducts, product]);
                                                    } else {
                                                        onSelectionChange(selectedProducts.filter(p => p.id_product !== product.id_product));
                                                    }
                                                }}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-3 pb-2 px-1 text-[13px] text-gray-600">
                <div>
                    Showing {((currentPage - 1) * perPage) + (products.length > 0 ? 1 : 0)} to {Math.min(currentPage * perPage, total)} of {total} entries
                </div>
                <div className="flex shadow-sm rounded border border-gray-200 text-[12px]">
                    <button 
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="px-2.5 py-1 bg-white border-r border-gray-200 hover:bg-gray-50 text-gray-500 rounded-l disabled:opacity-50"
                    >
                        Previous
                    </button>
                    {getPageNumbers().map((page, index) => (
                        <button
                            key={index}
                            disabled={page === '...'}
                            onClick={() => typeof page === 'number' && handlePageChange(page)}
                            className={`px-2.5 py-1 ${currentPage === page ? 'bg-[#3b82f6] text-white font-medium' : 'bg-white hover:bg-gray-50 text-gray-500 border-r border-gray-200'} ${page === '...' ? 'cursor-default' : ''}`}
                        >
                            {page}
                        </button>
                    ))}
                    <button 
                        disabled={currentPage === lastPage}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="px-2.5 py-1 bg-white hover:bg-gray-50 text-gray-500 rounded-r disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductTable;
