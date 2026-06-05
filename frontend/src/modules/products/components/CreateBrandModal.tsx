import React, { useState } from 'react';
import { createBrand } from '../api/productApi';

interface CreateBrandModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBrandCreated: (brand: { id: string; name: string }) => void;
    initialBrandName?: string;
}

const CreateBrandModal: React.FC<CreateBrandModalProps> = ({ isOpen, onClose, onBrandCreated, initialBrandName = '' }) => {
    const [brandName, setBrandName] = useState<string>(initialBrandName);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async () => {
        if (!brandName.trim()) {
            setError('Brand name cannot be empty');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await createBrand(brandName.trim());
            if (data.status) {
                onBrandCreated({ id: data.id_product_brand, name: data.id_product_brand });
                onClose();
            } else {
                setError('Brand already exists');
            }
        } catch (err) {
            setError('Failed to create brand');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
            <div className="bg-white dark:bg-[#1f2028] rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-[#181920]">
                    <h5 className="text-lg font-bold text-gray-800 dark:text-gray-100">Tambah Brand Product</h5>
                    <button type="button" className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 text-2xl leading-none" onClick={onClose}>&times;</button>
                </div>
                <div className="p-6">
                    {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-400">{error}</div>}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Brand Name</label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                            placeholder="Enter new brand"
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value.toUpperCase())}
                        />
                    </div>
                </div>
                <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2 bg-gray-50 dark:bg-[#181920]">
                    <button type="button" className="px-4 py-2 text-gray-700 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md transition" onClick={onClose} disabled={loading}>Close</button>
                    <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition" onClick={handleSave} disabled={loading}>
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateBrandModal;
