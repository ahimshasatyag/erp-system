import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import axios from 'axios'; 

interface ProductUploadFormProps {
    onBack: () => void;
}

const ProductUploadForm: React.FC<ProductUploadFormProps> = ({ onBack }) => {
    const [file, setFile] = useState<File | null>(null);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleView = async () => {
        if (!file) {
            alert('Please select a file!');
            return;
        }

        setLoading(true);
        setError(null);
        
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post('/api/products/upload-view', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            if (response.data.status) {
                setPreviewData(response.data.data);
            } else {
                setError('Upload validation failed');
            }
        } catch (err) {
            setError('Error uploading file');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!window.confirm("Apakah anda yakin ingin menyimpan data ini ?")) return;

        setSaving(true);
        try {
            await axios.post('/api/products/simpan-multi', { products: previewData });
            alert("Data saved successfully!");
            onBack();
        } catch (err) {
            alert("Failed to save data");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="w-full">
            <div className="bg-white dark:bg-[#1f2028] shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 p-6">
                {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded border border-red-400">{error}</div>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1">Choose File CSV</label>
                        <input 
                            type="file" 
                            className="w-full px-3 py-1.5 text-[13px] border border-gray-300 dark:border-gray-600 rounded focus:outline-none dark:bg-gray-800 dark:text-white" 
                            onChange={handleFileChange} 
                        />
                    </div>
                    <div>
                        <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1">Example File</label>
                        <div>
                            <a href="/assets/upload/template_upload_product.xlsx" className="inline-block px-3 py-1.5 bg-gray-700 text-white rounded hover:bg-gray-800 transition text-[13px]">
                                Download Template
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-6 mb-6 flex gap-2">
                    <button className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition font-medium text-[13px]" onClick={handleView} disabled={loading}>
                        {loading ? 'Loading...' : 'View Data'}
                    </button>
                    <button className="px-3 py-1.5 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition font-medium text-[13px]" onClick={onBack}>
                        Kembali
                    </button>
                </div>

                {previewData.length > 0 && (
                    <div className="mt-4">
                        <div className="overflow-x-auto">
                            <table className="w-full text-[13px] text-left border border-gray-200 dark:border-gray-700">
                                <thead className="text-[12px] text-gray-500 uppercase bg-[#f8f9fa] dark:bg-gray-800 dark:text-gray-300 border-b border-gray-200 font-medium">
                                    <tr>
                                        <th className="px-3 py-1.5 border-r border-gray-100 dark:border-gray-700 text-center w-12">No</th>
                                        <th className="px-3 py-1.5 border-r border-gray-100 dark:border-gray-700">Product Code</th>
                                        <th className="px-3 py-1.5 border-r border-gray-100 dark:border-gray-700">Product Name</th>
                                        <th className="px-3 py-1.5 border-r border-gray-100 dark:border-gray-700">Kategori</th>
                                        <th className="px-3 py-1.5 border-r border-gray-100 dark:border-gray-700">Sub Kategori</th>
                                        <th className="px-3 py-1.5 border-r border-gray-100 dark:border-gray-700">Brand</th>
                                        <th className="px-3 py-1.5 border-r border-gray-100 dark:border-gray-700">Deskripsi</th>
                                        <th className="px-3 py-1.5 border-r border-gray-100 dark:border-gray-700">Error Message</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {previewData.map((item, idx) => (
                                        <tr key={idx} className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 ${item.f_ada === false ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200'}`}>
                                            <td className="px-3 py-1 border-r border-gray-100 text-center">{idx + 1}</td>
                                            <td className="px-3 py-1 border-r border-gray-100">{item.code_product}</td>
                                            <td className="px-3 py-1 border-r border-gray-100">{item.nm_product}</td>
                                            <td className="px-3 py-1 border-r border-gray-100">{item.nm_product_kategori}</td>
                                            <td className="px-3 py-1 border-r border-gray-100">{item.nm_product_sub_kategori}</td>
                                            <td className="px-3 py-1 border-r border-gray-100">{item.nm_product_brand}</td>
                                            <td className="px-3 py-1 border-r border-gray-100">{item.product_deskripsi}</td>
                                            <td className="px-3 py-1 border-r border-gray-100">{item.error_message}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4">
                            <button className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium text-[13px]" onClick={handleSave} disabled={saving}>
                                {saving ? 'Saving...' : 'Simpan Data'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductUploadForm;
