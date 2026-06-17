import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import type { ProductPrice } from '../api/productPriceApi';

interface ProductPriceTableProps {
    products: ProductPrice[];
    meta?: any;
    onToggleStatus?: (ids: string[], status: string) => void;
    onParamsChange?: (params: any) => void;
    searchElement?: React.ReactNode;
    batchActionsElement?: React.ReactNode;
    selectedProducts?: ProductPrice[];
    onSelectionChange?: (products: ProductPrice[]) => void;
    onSelectAll?: (checked: boolean) => void;
}

const ProductPriceTable: React.FC<ProductPriceTableProps> = ({ 
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
                            {/* 1. Code Product */}
                            <th onClick={() => handleSort('code_product')} className="px-3 py-2 text-left font-bold text-gray-600 cursor-pointer group border-r border-gray-200 hover:bg-gray-100 transition-colors whitespace-nowrap">
                                <div className="flex items-center justify-between">Product Code {getSortIcon('code_product')}</div>
                            </th>
                            {/* 2. Product Name */}
                            <th onClick={() => handleSort('nm_product')} className="px-3 py-2 text-left font-bold text-gray-600 cursor-pointer group border-r border-gray-200 hover:bg-gray-100 transition-colors whitespace-nowrap">
                                <div className="flex items-center justify-between">Product Name {getSortIcon('nm_product')}</div>
                            </th>
                            {/* 3. Product Brand */}
                            <th onClick={() => handleSort('nm_product_brand')} className="px-3 py-2 text-left font-bold text-gray-600 cursor-pointer group border-r border-gray-200 hover:bg-gray-100 transition-colors whitespace-nowrap">
                                <div className="flex items-center justify-between">Brand {getSortIcon('nm_product_brand')}</div>
                            </th>
                            {/* 4. Product Price */}
                            <th onClick={() => handleSort('product_price')} className="px-3 py-2 text-center font-bold text-gray-600 cursor-pointer group border-r border-gray-200 hover:bg-gray-100 transition-colors whitespace-nowrap">
                                <div className="flex items-center justify-center gap-1">Product Price {getSortIcon('product_price')}</div>
                            </th>
                            {/* 4.1 Product Price Agent */}
                            <th onClick={() => handleSort('product_price_agent')} className="px-3 py-2 text-center font-bold text-gray-600 cursor-pointer group border-r border-gray-200 hover:bg-gray-100 transition-colors whitespace-nowrap">
                                <div className="flex items-center justify-center gap-1">Price Agent {getSortIcon('product_price_agent')}</div>
                            </th>
                            {/* 5. Waktu (Action Indicator from legacy) */}
                            <th onClick={() => handleSort('waktu')} className="px-3 py-2 text-center font-bold text-gray-600 cursor-pointer group border-r border-gray-200 hover:bg-gray-100 transition-colors whitespace-nowrap">
                                <div className="flex items-center justify-center gap-1">Updated At {getSortIcon('waktu')}</div>
                            </th>
                            {/* 6. Kurs Bank */}
                            <th onClick={() => handleSort('kurs_bank')} className="px-3 py-2 text-center font-bold text-gray-600 cursor-pointer group border-r border-gray-200 hover:bg-gray-100 transition-colors whitespace-nowrap">
                                <div className="flex items-center justify-center gap-1">Kurs {getSortIcon('kurs_bank')}</div>
                            </th>
                            {/* 7. Estimation IDR */}
                            <th className="px-3 py-2 text-center font-bold text-gray-600 border-r border-gray-200 whitespace-nowrap">
                                <div className="flex items-center justify-center gap-1">Estimation IDR</div>
                            </th>
                            {/* 8. Checkbox Status/Action */}
                            <th className="px-3 py-2 text-center font-bold text-gray-600 border-r border-gray-200 whitespace-nowrap">
                                <div className="flex items-center justify-center gap-1">
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
                                <td colSpan={9} className="px-3 py-10 text-center text-gray-500">No product price data found.</td>
                            </tr>
                        ) : (
                            products.map((product, index) => {
                                
                                const isNew = product.is_new_price;
                                const trClass = `border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`;
                                
                                // Legacy code highlighted entire texts if new, we will render it beautifully
                                const textStyle = isNew ? "text-green-600 font-bold" : "text-red-600 font-bold";
                                const priceStyle = isNew ? "text-green-600 font-bold text-[15px]" : "text-red-600 font-bold text-[15px]";

                                return (
                                <tr key={product.id_product} className={trClass}>
                                    <td className="px-3 py-1.5 border-r border-gray-100 whitespace-nowrap">
                                        <Link to={`/productprice/edit/${product.id_product}`} state={{ code: product.code_product }} className="text-gray-600 hover:text-[#3b82f6] font-medium block">
                                            {product.code_product}
                                        </Link>
                                    </td>
                                    <td className="px-3 py-1.5 border-r border-gray-100 whitespace-nowrap">
                                        <Link to={`/productprice/edit/${product.id_product}`} state={{ code: product.code_product }} className="text-gray-600 hover:text-[#3b82f6] block">
                                            {product.nm_product}
                                        </Link>
                                    </td>
                                    <td className="px-3 py-1.5 border-r border-gray-100 whitespace-nowrap">
                                        <Link to={`/productprice/edit/${product.id_product}`} state={{ code: product.code_product }} className="text-gray-600 hover:text-[#3b82f6] block">
                                            {product.nm_product_brand || '-'}
                                        </Link>
                                    </td>
                                    <td className="px-3 py-1.5 text-center border-r border-gray-100 whitespace-nowrap">
                                        <Link to={`/productprice/edit/${product.id_product}`} state={{ code: product.code_product }} className={`${product.waktu ? priceStyle : 'text-gray-600'} hover:text-[#3b82f6] block`}>
                                            {product.product_price_tampil}
                                        </Link>
                                    </td>
                                    <td className="px-3 py-1.5 text-center border-r border-gray-100 whitespace-nowrap">
                                        <Link to={`/productprice/edit/${product.id_product}`} state={{ code: product.code_product }} className="text-gray-600 hover:text-[#3b82f6] block">
                                            {product.product_price_agent_tampil}
                                        </Link>
                                    </td>
                                    <td className="px-3 py-1.5 text-center border-r border-gray-100 whitespace-nowrap">
                                        <Link to={`/productprice/edit/${product.id_product}`} state={{ code: product.code_product }} className={`${product.waktu ? textStyle : 'text-gray-600'} hover:text-[#3b82f6] block`}>
                                            {product.waktu ? new Date(product.waktu).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'}) : '-'}
                                        </Link>
                                    </td>
                                    <td className="px-3 py-1.5 text-center border-r border-gray-100 whitespace-nowrap">
                                        <Link to={`/productprice/edit/${product.id_product}`} state={{ code: product.code_product }} className="text-gray-600 hover:text-[#3b82f6] block">
                                            {product.kurs_bank_tampil}
                                        </Link>
                                    </td>
                                    <td className="px-3 py-1.5 text-center border-r border-gray-100 whitespace-nowrap">
                                        <Link to={`/productprice/edit/${product.id_product}`} state={{ code: product.code_product }} className={`${product.waktu ? textStyle : 'text-gray-600'} hover:text-[#3b82f6] block`}>
                                            {product.estimation_idr}
                                        </Link>
                                    </td>
                                    <td className="px-3 py-1.5 text-center whitespace-nowrap">
                                        <div className="flex items-center justify-center gap-2">
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
                            )})
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

export default ProductPriceTable;
