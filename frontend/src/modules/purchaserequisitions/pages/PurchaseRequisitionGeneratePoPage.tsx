import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getListPr, generatePoFromPr } from '../api/purchaseRequisitionApi';
import { showAlert } from '../../../components/SweetAlert';

interface PrDetailItem {
    id_pr_dtl: number;
    id_pr: number;
    id_product: number;
    code_pr: string;
    nm_users: string;
    code_product: string;
    nm_product: string;
    qty: number;
    qty_po: number; // For the input
    checked: boolean;
}

const PurchaseRequisitionGeneratePoPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    const [items, setItems] = useState<PrDetailItem[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                setLoading(true);
                const response = await getListPr();
                const data = response.data || response;
                
                if (Array.isArray(data)) {
                    setItems(data.map((item: any) => ({
                        id_pr_dtl: item.id_pr_dtl,
                        id_pr: item.id_pr,
                        id_product: item.id_product,
                        code_pr: item.code_pr,
                        nm_users: item.nm_users,
                        code_product: item.code_product,
                        nm_product: item.nm_product,
                        qty: item.qty,
                        qty_po: item.qty, // Default Qty App is the original qty
                        checked: false
                    })));
                } else {
                    setItems([]);
                }
            } catch (error: any) {
                showAlert.error('Error', error.message || 'Gagal memuat list PR');
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    const handleCheckboxChange = (index: number) => {
        setItems(prev => prev.map((item, i) => i === index ? { ...item, checked: !item.checked } : item));
    };

    const handleQtyChange = (index: number, value: string) => {
        const val = parseInt(value, 10);
        setItems(prev => prev.map((item, i) => {
            if (i === index) {
                // Ensure qty_po does not exceed original qty
                const validQty = isNaN(val) ? 0 : (val > item.qty ? item.qty : val);
                return { ...item, qty_po: validQty };
            }
            return item;
        }));
    };

    const handleSubmit = async () => {
        const selectedItems = items.filter(item => item.checked);

        if (selectedItems.length === 0) {
            showAlert.error('Gagal!', 'Pilih PR Minimal 1');
            return;
        }

        const data_baru = selectedItems.map(item => ({
            id_pr_dtl: item.id_pr_dtl,
            id_pr: item.id_pr,
            id_product: item.id_product,
            qty_po: item.qty_po
        }));

        setIsSubmitting(true);
        try {
            const response = await generatePoFromPr(data_baru);
            if (response.success || response.status) {
                const poCode = response.code_po || response.data?.code_po || 'Berhasil';
                showAlert.success('Berhasil Menyimpan Quotation', `Code PO : ${poCode}`);
                
                // Navigate to the PO edit page if it exists in the future.
                // Assuming it might be under quotationsap or purchase-orders
                // For now, redirect back to PR list
                navigate('/purchaserequisitions');
            } else {
                showAlert.error('Gagal!', 'Gagal Menyimpan Quotation');
            }
        } catch (error: any) {
            showAlert.error('Error', error.response?.data?.message || 'Terjadi kesalahan pada server');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full min-h-screen py-2 px-6">
            <div className="flex justify-between items-center mb-6 pt-2">
                <p className="text-[32px] font-normal text-[#3f2a2a] tracking-tight">List PR</p>
                <div className="text-[13px] text-gray-500 font-medium">EMM Master / List PR</div>
            </div>

            <div className="bg-white rounded shadow-sm border border-gray-200">
                <div className="p-6">
                    <div className="flex justify-start mb-6">
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || loading}
                            className="bg-[#22c55e] hover:bg-[#16a34a] text-white px-3 py-1.5 rounded text-[13px] font-bold inline-flex items-center disabled:opacity-50"
                        >
                            {isSubmitting ? 'Processing...' : 'Create Quotation'}
                        </button>
                        <button
                            onClick={() => navigate('/purchaserequisitions')}
                            className="ml-2 bg-[#f59e0b] hover:bg-[#d97706] text-white px-3 py-1.5 rounded text-[13px] font-bold inline-flex items-center"
                        >
                            Kembali
                        </button>
                    </div>

                    <div className="relative">
                        {loading && (
                            <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center min-h-[200px]">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#20c997]"></div>
                            </div>
                        )}

                        <div className="overflow-x-auto border border-gray-200 rounded">
                            <table className="min-w-full divide-y divide-gray-200 text-[13px] whitespace-nowrap">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2 text-left font-bold text-gray-600 border-r border-gray-200 w-[100px]">PR Code</th>
                                        <th className="px-3 py-2 text-left font-bold text-gray-600 border-r border-gray-200 w-[150px]">PR Request (User)</th>
                                        <th className="px-3 py-2 text-left font-bold text-gray-600 border-r border-gray-200">Product Name</th>
                                        <th className="px-3 py-2 text-center font-bold text-gray-600 border-r border-gray-200 w-[60px]">Qty</th>
                                        <th className="px-3 py-2 text-center font-bold text-gray-600 border-r border-gray-200 w-[80px]">Qty App</th>
                                        <th className="px-3 py-2 text-center font-bold text-gray-600 w-[60px]">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {!loading && items.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-3 py-10 text-center text-gray-500">Tidak ada data PR yang tersedia.</td>
                                        </tr>
                                    ) : (
                                        items.map((item, index) => (
                                            <tr key={item.id_pr_dtl} className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                                <td className="px-3 py-1.5 whitespace-nowrap border-r border-gray-100">{item.code_pr}</td>
                                                <td className="px-3 py-1.5 whitespace-nowrap border-r border-gray-100">{item.nm_users}</td>
                                                <td className="px-3 py-1.5 whitespace-nowrap border-r border-gray-100">{item.code_product} - {item.nm_product}</td>
                                                <td className="px-3 py-1.5 whitespace-nowrap text-center border-r border-gray-100 font-medium">{item.qty}</td>
                                                <td className="px-2 py-1.5 whitespace-nowrap border-r border-gray-100">
                                                    <input 
                                                        type="number" 
                                                        className="w-full text-center border border-gray-300 rounded outline-none py-1 px-1 text-[13px]"
                                                        value={item.qty_po}
                                                        onChange={(e) => handleQtyChange(index, e.target.value)}
                                                        min="0"
                                                        max={item.qty}
                                                    />
                                                </td>
                                                <td className="px-3 py-1.5 whitespace-nowrap text-center">
                                                    <input 
                                                        type="checkbox" 
                                                        className="rounded w-4 h-4 cursor-pointer"
                                                        checked={item.checked}
                                                        onChange={() => handleCheckboxChange(index)}
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseRequisitionGeneratePoPage;
