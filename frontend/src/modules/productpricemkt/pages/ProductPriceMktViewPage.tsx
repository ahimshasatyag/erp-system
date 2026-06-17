import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductPriceMktDetail } from '../hooks/useProductPriceMkt';

const formatcemua = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
};

const ProductPriceMktViewPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: detail, isLoading, isError } = useProductPriceMktDetail(id || null);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (isError || !detail) {
        return (
            <div className="p-8 text-center text-red-500 bg-red-50 rounded">
                Gagal memuat detail produk.
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen py-2 px-6">
            <div className="flex justify-between items-center mb-6 pt-2">
                <p className="text-[32px] font-normal text-[#3f2a2a] tracking-tight">
                    Detail Product {detail.code_product}
                </p>
                <div className="text-[13px] text-gray-500 font-medium">EMM Service / Product Price Marketing / View</div>
            </div>

            <div className="bg-white rounded shadow-sm border border-gray-200">
                <div className="p-6">
                    <div className="mb-6">
                        <button
                            onClick={() => navigate('/productpricemkt')}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-[13px] flex items-center gap-2 transition-colors w-fit"
                        >
                            <i className="fas fa-undo"></i> Kembali
                        </button>
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                        {/* Left Column */}
                        <div>
                            <table className="w-full text-sm">
                                <tbody>
                                    <tr>
                                        <th className="py-2 text-left w-[35%] text-[13px] text-gray-600 font-normal">Product Code</th>
                                        <td className="w-4 text-center text-gray-500">:</td>
                                        <td className="py-2">
                                            <input
                                                type="text"
                                                value={detail.code_product}
                                                readOnly
                                                className="w-full px-2 py-1.5 text-[13px] border border-gray-300 rounded outline-none bg-gray-50 text-gray-600 cursor-not-allowed"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="py-2 text-left text-[13px] text-gray-600 font-normal align-top pt-3">Product Name</th>
                                        <td className="w-4 text-center text-gray-500 align-top pt-3">:</td>
                                        <td className="py-2">
                                            <textarea
                                                value={detail.nm_product}
                                                readOnly
                                                rows={2}
                                                className="w-full px-2 py-1.5 text-[13px] border border-gray-300 rounded outline-none bg-gray-50 text-gray-600 cursor-not-allowed resize-none"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="py-2 text-left text-[13px] text-gray-600 font-normal align-top pt-3">Deskripsi</th>
                                        <td className="w-4 text-center text-gray-500 align-top pt-3">:</td>
                                        <td className="py-2">
                                            <textarea
                                                value={detail.product_deskripsi || '-'}
                                                readOnly
                                                rows={2}
                                                className="w-full px-2 py-1.5 text-[13px] border border-gray-300 rounded outline-none bg-gray-50 text-gray-600 cursor-not-allowed resize-none"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="py-2 text-left text-[13px] text-gray-600 font-normal">Kurs</th>
                                        <td className="w-4 text-center text-gray-500">:</td>
                                        <td className="py-2">
                                            <input
                                                type="text"
                                                value={formatcemua(detail.kurs_bank)}
                                                readOnly
                                                className="w-full px-2 py-1.5 text-[13px] border border-gray-300 rounded outline-none bg-gray-50 text-gray-600 cursor-not-allowed text-right"
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Right Column */}
                        <div>
                            <table className="w-full text-sm">
                                <tbody>
                                    <tr>
                                        <th className="py-2 text-left w-[35%] text-[13px] text-gray-600 font-normal">Price</th>
                                        <td className="w-4 text-center text-gray-500">:</td>
                                        <td className="py-2">
                                            <input
                                                type="text"
                                                value={formatcemua(detail.product_price)}
                                                readOnly
                                                className="w-full px-2 py-1.5 text-[13px] border border-gray-300 rounded outline-none bg-gray-50 text-gray-600 cursor-not-allowed text-right"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="py-2 text-left text-[13px] text-gray-600 font-normal">Update Date</th>
                                        <td className="w-4 text-center text-gray-500">:</td>
                                        <td className="py-2">
                                            <input
                                                type="text"
                                                value={detail.date_create}
                                                readOnly
                                                className={`w-full px-2 py-1.5 text-[13px] border border-gray-300 rounded outline-none bg-gray-50 cursor-not-allowed font-medium ${detail.status_waktu === 'green' ? 'text-green-600' : 'text-red-600'}`}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="py-2 text-left text-[13px] text-gray-600 font-normal">Estimation IDR</th>
                                        <td className="w-4 text-center text-gray-500">:</td>
                                        <td className="py-2">
                                            <input
                                                type="text"
                                                value={formatcemua(detail.estimasi)}
                                                readOnly
                                                className="w-full px-2 py-1.5 text-[13px] border border-gray-300 rounded outline-none bg-gray-50 text-gray-600 cursor-not-allowed text-right font-medium"
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Options Table */}
                    {detail.data_options && detail.data_options.length > 0 && (
                        <div className="overflow-x-auto border border-gray-200 rounded">
                            <table className="min-w-full divide-y divide-gray-200 text-[13px] whitespace-nowrap">
                                <thead className="bg-[#f9f9f9] border-b border-gray-200">
                                    <tr>
                                        <th className="px-2 py-1.5 text-center font-bold text-gray-600 border-r border-gray-200 w-16">No</th>
                                        <th className="px-2 py-1.5 text-center font-bold text-gray-600 border-r border-gray-200">Nama Option</th>
                                        <th className="px-2 py-1.5 text-center font-bold text-gray-600 border-r border-gray-200">Harga USD</th>
                                        <th className="px-2 py-1.5 text-center font-bold text-gray-600 border-r border-gray-200">Kurs</th>
                                        <th className="px-2 py-1.5 text-center font-bold text-gray-600">Estimasi IDR</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-[#fcfcfc] divide-y divide-gray-200">
                                    {detail.data_options.map((opt, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="px-2 py-2 border-r border-gray-200 text-center">{idx + 1}</td>
                                            <td className="px-2 py-2 border-r border-gray-200">{opt.nm_product_opt}</td>
                                            <td className="px-2 py-2 border-r border-gray-200 text-center">{formatcemua(opt.amount)}</td>
                                            <td className="px-2 py-2 border-r border-gray-200 text-center">{formatcemua(opt.kurs)}</td>
                                            <td className="px-2 py-2 text-center">{formatcemua(opt.estimasi)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductPriceMktViewPage;
