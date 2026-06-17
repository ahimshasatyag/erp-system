import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { showAlert } from '../../../components/SweetAlert';
import { fetchProductPrice, updateProductPrice } from '../api/productPriceApi';

const ProductPriceEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    
    const queryParams = new URLSearchParams(location.search);
    const isViewMode = queryParams.get('mode') !== 'edit';
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({
        product_price: '',
        product_price_agent: '',
        kurs_bank: '',
        delivery_term: 'FRANCO JKT',
    });
    const [options, setOptions] = useState<any[]>([]);
    const [history, setHistory] = useState<any[]>([]);
    const [priceBefore, setPriceBefore] = useState<number>(0);
    const [productDetails, setProductDetails] = useState<any>({});

    useEffect(() => {
        const loadData = async () => {
            try {
                if (!id) return;
                const response = await fetchProductPrice(id);
                const data = response.data;
                
                setFormData({
                    product_price: data.product_price || '',
                    product_price_agent: data.product_price_agent || '',
                    kurs_bank: data.kurs_bank || '',
                    delivery_term: data.delivery_term || 'FRANCO JKT',
                });
                
                setProductDetails({
                    id_product: data.id_product,
                    code_product: data.code_product,
                    nm_product: data.nm_product,
                    nm_product_brand: data.nm_product_brand,
                    product_deskripsi: data.product_deskripsi
                });
                
                if (response.options) {
                    setOptions(response.options);
                }
                
                if (response.history) {
                    setHistory(response.history);
                }
                
                if (response.price_before !== undefined) {
                    setPriceBefore(response.price_before);
                }
            } catch (err: any) {
                showAlert.error('Gagal', err.message || 'Gagal mengambil data');
            } finally {
                setLoading(false);
            }
        };
        
        loadData();
    }, [id]);

    const handleOptionAmountChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index].amount = value;
        setOptions(newOptions);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await updateProductPrice(id!, {
                id_product: productDetails.id_product,
                product_price: formData.product_price,
                product_price_agent: formData.product_price_agent,
                kurs_bank: formData.kurs_bank,
                delivery_term: formData.delivery_term,
                options: options.map(opt => ({
                    id_product_price_opt: opt.id_product_price_opt,
                    amount: opt.amount || 0
                }))
            });
            showAlert.success('Berhasil', 'Data berhasil diperbarui', () => {
                navigate('/productprice');
            });
        } catch (error: any) {
            showAlert.error('Gagal', error.message || 'Terjadi kesalahan saat memperbarui');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    const estimationIdr = (Number(formData.product_price) || 0) * (Number(formData.kurs_bank) || 0);

    return (
        <div className="w-full min-h-screen py-2 px-6">
            <div className="flex justify-between items-center mb-6 pt-2">
                <p className="text-[32px] font-normal text-[#3f2a2a] tracking-tight">
                    {isViewMode ? 'Detail Product Price' : 'Edit Product Price'}
                </p>
                <div className="text-[13px] text-gray-500 font-medium">
                    EMM Service / Product Price / {isViewMode ? 'Detail' : 'Edit'}
                </div>
            </div>

            <div className="bg-white rounded shadow-sm border border-gray-200 mb-6 w-full">
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Left Column */}
                        <div>
                            <table className="w-full text-[13px] border-collapse">
                                <tbody>
                                    <tr className="border-b border-gray-100">
                                        <th className="py-2.5 text-left w-1/3 font-medium text-gray-700">Product Code</th>
                                        <th className="py-2.5 text-center w-8">:</th>
                                        <td className="py-2.5 text-gray-800">{productDetails.code_product}</td>
                                    </tr>
                                    <tr className="border-b border-gray-100">
                                        <th className="py-2.5 text-left font-medium text-gray-700">Product Name</th>
                                        <th className="py-2.5 text-center">:</th>
                                        <td className="py-2.5 text-gray-800">{productDetails.nm_product}</td>
                                    </tr>
                                    <tr className="border-b border-gray-100">
                                        <th className="py-2.5 text-left font-medium text-gray-700">Brand</th>
                                        <th className="py-2.5 text-center">:</th>
                                        <td className="py-2.5 text-gray-800">{productDetails.nm_product_brand}</td>
                                    </tr>
                                    <tr className="border-b border-gray-100">
                                        <th className="py-2.5 text-left font-medium text-gray-700">Price USD</th>
                                        <th className="py-2.5 text-center">:</th>
                                        <td className="py-2.5">
                                            <input 
                                                type="number" 
                                                name="product_price" 
                                                className={`w-full border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-[#20c997] ${isViewMode ? 'bg-gray-100' : ''}`} 
                                                value={formData.product_price} 
                                                onChange={handleChange} 
                                                required 
                                                min="0"
                                                disabled={isViewMode} 
                                            />
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-100">
                                        <th className="py-2.5 text-left font-medium text-gray-700">Price Before</th>
                                        <th className="py-2.5 text-center">:</th>
                                        <td className="py-2.5 text-gray-800">{Number(priceBefore).toLocaleString('id-ID')}</td>
                                    </tr>
                                    <tr className="border-b border-gray-100">
                                        <th className="py-2.5 text-left font-medium text-gray-700">Price USD Agent</th>
                                        <th className="py-2.5 text-center">:</th>
                                        <td className="py-2.5">
                                            <input 
                                                type="number" 
                                                name="product_price_agent" 
                                                className={`w-full border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-[#20c997] ${isViewMode ? 'bg-gray-100' : ''}`} 
                                                value={formData.product_price_agent} 
                                                onChange={handleChange} 
                                                required 
                                                min="0"
                                                disabled={isViewMode} 
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Right Column */}
                        <div>
                            <table className="w-full text-[13px] border-collapse">
                                <tbody>
                                    <tr className="border-b border-gray-100">
                                        <th className="py-2.5 text-left w-1/3 font-medium text-gray-700">Est. IDR</th>
                                        <th className="py-2.5 text-center w-8">:</th>
                                        <td className="py-2.5">
                                            <input type="text" className="w-full border border-gray-300 rounded px-2 py-1.5 bg-gray-100 outline-none" value={estimationIdr.toLocaleString('id-ID')} readOnly disabled />
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-100">
                                        <th className="py-2.5 text-left font-medium text-gray-700">Kurs</th>
                                        <th className="py-2.5 text-center">:</th>
                                        <td className="py-2.5">
                                            <input type="number" name="kurs_bank" className="w-full border border-gray-300 rounded px-2 py-1.5 bg-gray-100 outline-none" value={formData.kurs_bank} readOnly disabled />
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-100">
                                        <th className="py-2.5 text-left font-medium text-gray-700">Delivery Term</th>
                                        <th className="py-2.5 text-center">:</th>
                                        <td className="py-2.5">
                                            <select 
                                                name="delivery_term" 
                                                className={`w-full border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-[#20c997] ${isViewMode ? 'bg-gray-100' : ''}`} 
                                                value={formData.delivery_term} 
                                                onChange={handleChange} 
                                                required
                                                disabled={isViewMode}
                                            >
                                                <option value="FRANCO JKT">FRANCO JKT</option>
                                                <option value="FOB CHINA">FOB CHINA</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-100">
                                        <th className="py-2.5 text-left font-medium text-gray-700">Deskripsi</th>
                                        <th className="py-2.5 text-center">:</th>
                                        <td className="py-2.5 text-gray-800">{productDetails.product_deskripsi || '-'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mb-6">
                        <table className="min-w-full border-collapse border border-gray-200 text-[13px]">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="border border-gray-200 px-3 py-2 text-left font-bold text-gray-600 w-16">No</th>
                                    <th className="border border-gray-200 px-3 py-2 text-left font-bold text-gray-600">Nama Option</th>
                                    <th className="border border-gray-200 px-3 py-2 text-left font-bold text-gray-600 w-64">Harga USD</th>
                                </tr>
                            </thead>
                            <tbody>
                                {options.length > 0 ? options.map((opt, index) => (
                                    <tr key={index}>
                                        <td className="border border-gray-200 px-3 py-2 text-center">{index + 1}</td>
                                        <td className="border border-gray-200 px-3 py-2">{opt.nm_product_opt}</td>
                                        <td className="border border-gray-200 px-3 py-2">
                                            <input 
                                                type="number" 
                                                className={`w-full border border-gray-300 rounded px-2 py-1 outline-none focus:border-[#20c997] ${isViewMode ? 'bg-gray-100' : ''}`} 
                                                value={opt.amount} 
                                                onChange={(e) => handleOptionAmountChange(index, e.target.value)} 
                                                min="0"
                                                disabled={isViewMode}
                                            />
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={3} className="border border-gray-200 px-3 py-4 text-center text-gray-500">No Options Available</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex gap-2">
                        {isViewMode ? (
                            <button 
                                type="button" 
                                onClick={() => navigate(`/productprice/edit/${id}?mode=edit`, { state: location.state })} 
                                className="bg-[#0dcaf0] hover:bg-[#31b0d5] text-white px-4 py-1.5 rounded text-[13px] font-medium flex items-center gap-1 shadow-sm"
                            >
                                <i className="fas fa-edit"></i> Edit
                            </button>
                        ) : (
                            <button type="submit" disabled={submitting} className="bg-[#28a745] hover:bg-[#218838] text-white px-4 py-1.5 rounded text-[13px] font-medium disabled:opacity-50 flex items-center gap-1 shadow-sm">
                                {submitting ? 'Updating...' : 'Update'}
                            </button>
                        )}
                        <Link 
                            to={isViewMode ? "/productprice" : `/productprice/edit/${id}`} 
                            state={!isViewMode ? location.state : undefined}
                            className="bg-[#ffc107] hover:bg-[#e0a800] text-black px-4 py-1.5 rounded text-[13px] font-medium flex items-center gap-1 shadow-sm"
                        >
                            Kembali
                        </Link>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded shadow-sm border border-gray-200 w-full mb-6">
                <div className="p-6">
                    <table className="min-w-full border-collapse border border-gray-200 text-[13px]">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="border border-gray-200 px-3 py-2 text-left font-bold text-gray-600">Tgl Modified</th>
                                <th className="border border-gray-200 px-3 py-2 text-right font-bold text-gray-600">Price</th>
                                <th className="border border-gray-200 px-3 py-2 text-left font-bold text-gray-600">Created by</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="border border-gray-200 px-3 py-4 text-center text-gray-500">
                                        No history available.
                                    </td>
                                </tr>
                            ) : (
                                history.map((h, i) => (
                                    <tr key={i}>
                                        <td className="border border-gray-200 px-3 py-2">{new Date(h.waktu).toLocaleString('id-ID')}</td>
                                        <td className="border border-gray-200 px-3 py-2 text-right">
                                            {Number(h.product_price).toLocaleString('id-ID')}
                                        </td>
                                        <td className="border border-gray-200 px-3 py-2 text-left">
                                            {h.nm_users}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductPriceEditPage;
