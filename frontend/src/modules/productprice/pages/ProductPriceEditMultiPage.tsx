import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { showAlert } from '../../../components/SweetAlert';
import { updateProductPrice } from '../api/productPriceApi';
import type { ProductPrice } from '../api/productPriceApi';

interface EditItem {
    id_product: string;
    nm_product: string;
    code_product: string;
    product_price_lama: string | number;
    product_price: string | number;
    product_price_agent: string | number;
    kurs_bank: number;
    estimation_idr: string | number;
    delivery_term: string;
}

const ProductPriceEditMultiPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [submitting, setSubmitting] = useState(false);
    const [items, setItems] = useState<EditItem[]>([]);

    useEffect(() => {
        const state = location.state as { selectedProducts?: ProductPrice[] };
        if (!state?.selectedProducts || state.selectedProducts.length === 0) {
            navigate('/productprice');
            return;
        }

        const initialItems = state.selectedProducts.map(p => ({
            id_product: p.id_product,
            nm_product: p.nm_product,
            code_product: p.code_product,
            product_price_lama: p.product_price, // existing price
            product_price: p.product_price,
            product_price_agent: p.product_price_agent || 0,
            kurs_bank: p.kurs_bank || 15000,
            estimation_idr: Number(p.product_price) * Number(p.kurs_bank || 15000),
            delivery_term: p.delivery_term || 'FRANCO JKT',
        }));

        setItems(initialItems);
    }, [location.state, navigate]);

    const handleItemChange = (id_product: string, field: keyof EditItem, value: any) => {
        const newItems = [...items];
        const index = newItems.findIndex(item => item.id_product === id_product);
        if (index === -1) return;

        const item = newItems[index];
        (item as any)[field] = value;

        // Calculate estimation
        if (field === 'product_price' || field === 'kurs_bank') {
            const price = Number(item.product_price) || 0;
            const kurs = Number(item.kurs_bank) || 0;
            item.estimation_idr = price * kurs;
        }

        setItems(newItems);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (items.length === 0) return;

        setSubmitting(true);
        try {
            // For multi edit, we might need a specific endpoint, or we loop through updates.
            // Since there's no specific multi-update endpoint in API, we'll update one by one, 
            // or we can adjust backend to accept array. Let's assume loop for now, or adapt if backend supports array.
            
            // To match CodeIgniter update_multi:
            // Assuming we added a multi-update action or we can just iterate the `updateProductPrice` API.
            for (const item of items) {
                await updateProductPrice(item.id_product, {
                    product_price: item.product_price,
                    product_price_agent: item.product_price_agent,
                    kurs_bank: item.kurs_bank,
                    delivery_term: item.delivery_term,
                    // If we need to send the old price for reference or logging
                    product_price_lama: item.product_price_lama,
                });
            }

            showAlert.success('Berhasil', 'Data berhasil diperbarui', () => {
                navigate('/productprice');
            });
        } catch (error: any) {
            showAlert.error('Gagal', error.message || 'Terjadi kesalahan saat memperbarui');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full min-h-screen py-2 px-6">
            <div className="flex justify-between items-center mb-6 pt-2">
                <p className="text-[32px] font-normal text-[#3f2a2a] tracking-tight">Edit Multiple Product Prices</p>
                <div className="text-[13px] text-gray-500 font-medium">EMM Service / Product Price / Edit Multi</div>
            </div>

            <div className="bg-white rounded shadow-sm border border-gray-200">
                <div className="p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6 flex gap-2">
                            <button
                                type="submit"
                                disabled={submitting || items.length === 0}
                                className="bg-[#28a745] hover:bg-[#218838] text-white px-3 py-1.5 rounded text-[13px] font-medium disabled:opacity-50"
                            >
                                {submitting ? 'Menyimpan...' : 'Simpan Semua'}
                            </button>
                            <Link
                                to="/productprice"
                                className="bg-[#ffc107] hover:bg-[#e0a800] text-black px-3 py-1.5 rounded text-[13px] font-medium flex items-center gap-1"
                            >
                                <i className="fa fa-undo"></i> Kembali
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 text-[13px]">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2 text-center font-bold text-gray-600 border border-gray-200">No</th>
                                        <th className="px-3 py-2 text-center font-bold text-gray-600 border border-gray-200">Product Name</th>
                                        <th className="px-3 py-2 text-center font-bold text-gray-600 border border-gray-200">Price Now</th>
                                        <th className="px-3 py-2 text-center font-bold text-gray-600 border border-gray-200">Price Update</th>
                                        <th className="px-3 py-2 text-center font-bold text-gray-600 border border-gray-200">Price Update Agent</th>
                                        <th className="px-3 py-2 text-center font-bold text-gray-600 border border-gray-200">Kurs</th>
                                        <th className="px-3 py-2 text-center font-bold text-gray-600 border border-gray-200">Estimation IDR</th>
                                        <th className="px-3 py-2 text-center font-bold text-gray-600 border border-gray-200">Delivery Term</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-3 py-4 text-center text-gray-500 border border-gray-200">
                                                Tidak ada data yang dipilih.
                                            </td>
                                        </tr>
                                    ) : (
                                        items.map((item, index) => (
                                            <tr key={item.id_product}>
                                                <td className="px-3 py-2 text-center border border-gray-200">{index + 1}</td>
                                                <td className="px-3 py-2 border border-gray-200">
                                                    {item.code_product} - {item.nm_product}
                                                </td>
                                                <td className="px-3 py-2 border border-gray-200 text-center bg-gray-50">
                                                    {Number(item.product_price_lama).toLocaleString('id-ID')}
                                                </td>
                                                <td className="px-3 py-2 border border-gray-200">
                                                    <input
                                                        type="number"
                                                        className="w-full border border-gray-300 rounded px-2 py-1 outline-none"
                                                        value={item.product_price}
                                                        onChange={(e) => handleItemChange(item.id_product, 'product_price', e.target.value)}
                                                        required
                                                        min="0"
                                                    />
                                                </td>
                                                <td className="px-3 py-2 border border-gray-200">
                                                    <input
                                                        type="number"
                                                        className="w-full border border-gray-300 rounded px-2 py-1 outline-none"
                                                        value={item.product_price_agent}
                                                        onChange={(e) => handleItemChange(item.id_product, 'product_price_agent', e.target.value)}
                                                        required
                                                        min="0"
                                                    />
                                                </td>
                                                <td className="px-3 py-2 border border-gray-200">
                                                    <input
                                                        type="number"
                                                        className="w-full border border-gray-300 rounded px-2 py-1 outline-none bg-gray-50"
                                                        value={item.kurs_bank}
                                                        readOnly
                                                        // onChange={(e) => handleItemChange(item.id_product, 'kurs_bank', e.target.value)}
                                                        // In legacy edit multi, kurs_bank is readonly
                                                    />
                                                </td>
                                                <td className="px-3 py-2 border border-gray-200">
                                                    <input
                                                        type="text"
                                                        className="w-full border border-gray-300 rounded px-2 py-1 bg-gray-100 outline-none"
                                                        value={Number(item.estimation_idr).toLocaleString('id-ID')}
                                                        readOnly
                                                    />
                                                </td>
                                                <td className="px-3 py-2 border border-gray-200">
                                                    <select
                                                        className="w-full border border-gray-300 rounded px-2 py-1 outline-none"
                                                        value={item.delivery_term}
                                                        onChange={(e) => handleItemChange(item.id_product, 'delivery_term', e.target.value)}
                                                        required
                                                    >
                                                        <option value="FRANCO JKT">FRANCO JKT</option>
                                                        <option value="FOB CHINA">FOB CHINA</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductPriceEditMultiPage;
