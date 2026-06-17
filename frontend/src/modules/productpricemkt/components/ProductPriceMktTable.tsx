import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProductPriceMktList, useProductPriceMktDetail, useAddToCart } from '../hooks/useProductPriceMkt';
import SearchablePaginatedSelect from '../../../components/SearchablePaginatedSelect';

const formatcemua = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
};

const ProductPriceMktTable: React.FC = () => {
    const navigate = useNavigate();
    const { data: productList, isLoading: isListLoading } = useProductPriceMktList();
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const { data: detail, isLoading: isDetailLoading } = useProductPriceMktDetail(selectedProductId);
    const { mutate: addToCart } = useAddToCart();

    const handleOpenPdf = () => {
        if (detail?.id_product_global) {
            window.open(`/productpricemkt/pdf/${detail.id_product_global}`, '_blank');
        }
    };

    const handleOpenBrosur = () => {
        if (detail?.link_brosur) {
            window.open(`http://localhost/erp-system/assets/upload/${detail.link_brosur}`, '_blank'); // Adjust path as needed
        }
    };

    return (
        <div className="w-full">
            <div className="flex flex-col gap-4 mb-4">
                <div className="flex gap-2 items-center">
                    <div className="w-64">
                        <SearchablePaginatedSelect
                            value={selectedProductId || ''}
                            onChange={(val) => setSelectedProductId(val)}
                            options={productList?.map(p => ({
                                value: String(p.id_product),
                                label: `${p.code_product} - ${p.nm_product}`,
                                subLabel: ''
                            })) || []}
                            placeholder="Search Product"
                        />
                    </div>

                    {isDetailLoading && <span className="text-sm text-gray-500 animate-pulse">Loading detail...</span>}

                    {detail && (
                        <>
                            <button
                                onClick={handleOpenPdf}
                                className="bg-gray-800 hover:bg-gray-900 text-white px-3 py-1.5 rounded text-sm flex items-center gap-1"
                            >
                                <i className="fas fa-print"></i> Save PDF
                            </button>
                            {detail.link_brosur && (
                                <button
                                    onClick={handleOpenBrosur}
                                    className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-1.5 rounded text-sm flex items-center gap-1"
                                >
                                    <i className="fas fa-download"></i> Download Brosur
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {isListLoading || isDetailLoading ? (
                <div className="flex justify-center my-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto border border-gray-200 rounded mb-6">
                        <table className="min-w-full divide-y divide-gray-200 text-[13px] whitespace-nowrap">
                            <thead className="bg-[#f9f9f9] border-b border-gray-200">
                                <tr>
                                    <th className="px-2 py-1.5 text-center font-bold text-gray-600 border-r border-gray-200">Product Code</th>
                                    <th className="px-2 py-1.5 text-center font-bold text-gray-600 border-r border-gray-200">Product Name</th>
                                    <th className="px-2 py-1.5 text-center font-bold text-gray-600 border-r border-gray-200">Price</th>
                                    <th className="px-2 py-1.5 text-center font-bold text-gray-600 border-r border-gray-200">Last Modified</th>
                                    <th className="px-2 py-1.5 text-center font-bold text-gray-600 border-r border-gray-200">Kurs</th>
                                    <th className="px-2 py-1.5 text-center font-bold text-gray-600 border-r border-gray-200">Estimation IDR</th>
                                    <th className="px-2 py-1.5 text-center font-bold text-gray-600">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-[#fcfcfc] divide-y divide-gray-200">
                                {detail ? (
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-2 py-2 border-r border-gray-200 text-center">
                                            <Link 
                                                to={`/productpricemkt/view/${detail.id_product}`} 
                                                state={{ code: detail.code_product }}
                                                className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
                                            >
                                                {detail.code_product}
                                            </Link>
                                        </td>
                                        <td className="px-2 py-2 border-r border-gray-200">{detail.nm_product}</td>
                                        <td className="px-2 py-2 border-r border-gray-200 text-center">
                                            <span className={`font-bold text-[15px] ${detail.status_waktu === 'green' ? 'text-green-600' : 'text-red-600'}`}>
                                                {formatcemua(detail.product_price)}
                                            </span>
                                        </td>
                                        <td className="px-2 py-2 border-r border-gray-200 text-center">{detail.date_create}</td>
                                        <td className="px-2 py-2 border-r border-gray-200 text-center">{formatcemua(detail.kurs_bank)}</td>
                                        <td className="px-2 py-2 border-r border-gray-200 text-center">
                                            <span className={`font-bold ${detail.status_waktu === 'green' ? 'text-green-600' : 'text-red-600'}`}>
                                                {formatcemua(detail.estimasi)}
                                            </span>
                                        </td>
                                        <td className="px-2 py-2 text-center">
                                            <button
                                                onClick={() => addToCart(detail.id_product)}
                                                className="text-green-600 hover:text-green-800"
                                                title="Add to Cart"
                                            >
                                                <i className="fas fa-shopping-cart fa-lg"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                                            No data available in table
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="overflow-x-auto border border-gray-200 rounded">
                        <table className="min-w-full divide-y divide-gray-200 text-[13px] whitespace-nowrap">
                            <thead className="bg-[#f9f9f9] border-b border-gray-200">
                                <tr>
                                    <th className="px-2 py-1.5 text-center font-bold text-gray-600 border-r border-gray-200">Nama Options</th>
                                    <th className="px-2 py-1.5 text-center font-bold text-gray-600 border-r border-gray-200">Harga USD</th>
                                    <th className="px-2 py-1.5 text-center font-bold text-gray-600 border-r border-gray-200">Kurs</th>
                                    <th className="px-2 py-1.5 text-center font-bold text-gray-600">Estimation IDR</th>
                                </tr>
                            </thead>
                            <tbody className="bg-[#fcfcfc] divide-y divide-gray-200">
                                {detail && detail.data_options && detail.data_options.length > 0 ? (
                                    detail.data_options.map((opt, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="px-2 py-2 border-r border-gray-200">{opt.nm_product_opt}</td>
                                            <td className="px-2 py-2 border-r border-gray-200 text-center">{formatcemua(opt.amount)}</td>
                                            <td className="px-2 py-2 border-r border-gray-200 text-center">{formatcemua(opt.kurs)}</td>
                                            <td className="px-2 py-2 text-center">{formatcemua(opt.estimasi)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                                            No data available in table
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProductPriceMktTable;
