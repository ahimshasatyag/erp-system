import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { showAlert } from '../../../components/SweetAlert';
import { fetchAvailableProducts, fetchDetailBarang, createProductPrices } from '../api/productPriceApi';
import SearchablePaginatedSelect from '../../../components/SearchablePaginatedSelect';

interface AddItem {
    id: string; // Unique ID for React key
    id_product: string;
    product_price_lama: string | number;
    product_price: string | number;
    product_price_agent: string | number;
    kurs_bank: number;
    estimation_idr: string | number;
    delivery_term: string;
}

const ProductPriceAddPage: React.FC = () => {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [availableProducts, setAvailableProducts] = useState<any[]>([]);
    
    // Simulate getting initial Kurs Bank from backend if necessary, defaulting to 1 for now or we could fetch it.
    const defaultKurs = 15000; // As a fallback if not provided

    const [items, setItems] = useState<AddItem[]>([]);
    const [expandedActionRows, setExpandedActionRows] = useState<Record<number, boolean>>({});

    const toggleActionRow = (index: number) => {
        setExpandedActionRows(prev => ({ ...prev, [index]: !prev[index] }));
    };

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await fetchAvailableProducts();
                setAvailableProducts(data);
            } catch (error: any) {
                showAlert.error('Error', error.message || 'Failed to fetch products');
            }
        };
        loadProducts();
    }, []);

    const handleAddItem = () => {
        setItems([
            ...items,
            {
                id: Math.random().toString(36).substr(2, 9),
                id_product: '',
                product_price_lama: 0,
                product_price: 0,
                product_price_agent: 0,
                kurs_bank: defaultKurs, // We might need to fetch real kurs from backend, assuming 15000 for placeholder
                estimation_idr: 0,
                delivery_term: 'FRANCO JKT',
            }
        ]);
    };

    const handleRemoveItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    const handleItemChange = async (id: string, field: keyof AddItem, value: any) => {
        const newItems = [...items];
        const index = newItems.findIndex(item => item.id === id);
        if (index === -1) return;

        const item = newItems[index];
        (item as any)[field] = value;

        // If product selected, fetch detail_barang
        if (field === 'id_product' && value) {
            try {
                const detail = await fetchDetailBarang(value);
                if (detail && detail.status) {
                    item.product_price_lama = detail.product_price || 0;
                    item.delivery_term = detail.delivery_term || 'FRANCO JKT';
                }
            } catch (err) {
                console.error("Failed to fetch detail", err);
            }
        }

        // Calculate estimation
        if (field === 'product_price' || field === 'kurs_bank' || field === 'id_product') {
            const price = Number(item.product_price) || 0;
            const kurs = Number(item.kurs_bank) || 0;
            item.estimation_idr = price * kurs;
        }

        setItems(newItems);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (items.length === 0) {
            showAlert.warning('Peringatan', 'Silakan tambah barang terlebih dahulu!');
            return;
        }

        const hasEmptyProduct = items.some(item => !item.id_product);
        if (hasEmptyProduct) {
            showAlert.warning('Peringatan', 'Ada baris yang belum memilih barang!');
            return;
        }

        setSubmitting(true);
        try {
            // Reformat payload for backend
            const payload = {
                jml: items.length,
                ...items.reduce((acc: any, item, idx) => {
                    const no = idx + 1;
                    acc[`id_product${no}`] = item.id_product;
                    acc[`product_price${no}`] = item.product_price;
                    acc[`product_price_agent${no}`] = item.product_price_agent;
                    acc[`kurs_bank${no}`] = item.kurs_bank;
                    acc[`delivery_term${no}`] = item.delivery_term;
                    return acc;
                }, {})
            };

            await createProductPrices(payload);
            showAlert.success('Berhasil', 'Data berhasil disimpan', () => {
                navigate('/productprice');
            });
        } catch (error: any) {
            showAlert.error('Gagal', error.message || 'Terjadi kesalahan');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full min-h-screen py-2 px-6">
            <div className="flex justify-between items-center mb-6 pt-2">
                <p className="text-[32px] font-normal text-[#3f2a2a] tracking-tight">Add Product Price</p>
                <div className="text-[13px] text-gray-500 font-medium">EMM Service / Product Price / Add</div>
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
                                {submitting ? 'Menyimpan...' : 'Simpan'}
                            </button>
                            <button
                                type="button"
                                onClick={handleAddItem}
                                className="bg-[#17a2b8] hover:bg-[#138496] text-white px-3 py-1.5 rounded text-[13px] font-medium"
                            >
                                Tambah Barang
                            </button>
                            <Link
                                to="/productprice"
                                className="bg-[#ffc107] hover:bg-[#e0a800] text-black px-3 py-1.5 rounded text-[13px] font-medium flex items-center gap-1"
                            >
                                <i className="fa fa-undo"></i> Kembali
                            </Link>
                        </div>

                        <div className="overflow-visible pb-40">
                            <table className="min-w-full divide-y divide-gray-200 text-[13px]">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2 text-center font-bold text-gray-600 border border-gray-200 w-[5%]">No</th>
                                        <th className="px-3 py-2 text-center font-bold text-gray-600 border border-gray-200 w-64">Product Name</th>
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
                                                Belum ada barang yang ditambahkan.
                                            </td>
                                        </tr>
                                    ) : (
                                        items.map((item, index) => (
                                            <React.Fragment key={item.id}>
                                                <tr>
                                                    <td className="px-3 py-2 text-center border border-gray-200">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleActionRow(index)}
                                                                className={`text-white w-[18px] h-[18px] min-w-[18px] rounded-full flex items-center justify-center text-[10px] shadow-sm transition-colors ${expandedActionRows[index] ? 'bg-[#ff6b6b] hover:bg-[#fa5252]' : 'bg-[#22c55e] hover:bg-[#16a34a]'}`}
                                                            >
                                                                <i className={`fas fa-${expandedActionRows[index] ? 'minus' : 'plus'}`}></i>
                                                            </button>
                                                            <span>{index + 1}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-2 border border-gray-200">
                                                        <SearchablePaginatedSelect
                                                            value={item.id_product}
                                                            onChange={(val) => handleItemChange(item.id, 'id_product', val)}
                                                            options={availableProducts.map((p) => ({
                                                                value: String(p.id_product),
                                                                label: p.nm_product,
                                                                subLabel: p.code_product
                                                            }))}
                                                            placeholder="Pilih Barang"
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2 border border-gray-200">
                                                        <input
                                                            type="text"
                                                            className="w-full border border-gray-300 rounded px-2 py-1 bg-gray-100 outline-none"
                                                            value={item.product_price_lama}
                                                            readOnly
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2 border border-gray-200">
                                                        <input
                                                            type="number"
                                                            className="w-full border border-gray-300 rounded px-2 py-1 outline-none"
                                                            value={item.product_price}
                                                            onChange={(e) => handleItemChange(item.id, 'product_price', e.target.value)}
                                                            required
                                                            min="0"
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2 border border-gray-200">
                                                        <input
                                                            type="number"
                                                            className="w-full border border-gray-300 rounded px-2 py-1 outline-none"
                                                            value={item.product_price_agent}
                                                            onChange={(e) => handleItemChange(item.id, 'product_price_agent', e.target.value)}
                                                            required
                                                            min="0"
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2 border border-gray-200">
                                                        <input
                                                            type="number"
                                                            className="w-full border border-gray-300 rounded px-2 py-1 bg-gray-100 outline-none"
                                                            value={item.kurs_bank}
                                                            onChange={(e) => handleItemChange(item.id, 'kurs_bank', e.target.value)}
                                                            required
                                                            readOnly
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2 border border-gray-200">
                                                        <input
                                                            type="number"
                                                            className="w-full border border-gray-300 rounded px-2 py-1 bg-gray-100 outline-none"
                                                            value={item.estimation_idr}
                                                            readOnly
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2 border border-gray-200">
                                                        <select
                                                            className="w-full border border-gray-300 rounded px-2 py-1 outline-none"
                                                            value={item.delivery_term}
                                                            onChange={(e) => handleItemChange(item.id, 'delivery_term', e.target.value)}
                                                            required
                                                        >
                                                            <option value="FRANCO JKT">FRANCO JKT</option>
                                                            <option value="FOB CHINA">FOB CHINA</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                                {expandedActionRows[index] && (
                                                    <tr className="bg-gray-50/50">
                                                        <td className="px-3 py-2 text-center font-semibold text-gray-700 border-r border-b border-gray-200">
                                                            Aksi
                                                        </td>
                                                        <td colSpan={7} className="px-3 py-2 border-b border-gray-200">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveItem(item.id)}
                                                                className="text-white bg-[#ff6b6b] hover:bg-[#fa5252] w-8 h-8 rounded flex items-center justify-center shadow-sm"
                                                                title="Hapus baris"
                                                            >
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
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

export default ProductPriceAddPage;
