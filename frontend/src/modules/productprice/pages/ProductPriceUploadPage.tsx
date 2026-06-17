import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { showAlert } from '../../../components/SweetAlert';
import { uploadExcel } from '../api/productPriceApi';

const ProductPriceUploadPage: React.FC = () => {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!file) {
            showAlert.warning('Peringatan', 'Silakan pilih file Excel (.xls atau .xlsx) terlebih dahulu!');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setSubmitting(true);
        try {
            await uploadExcel(formData);
            showAlert.success('Berhasil', 'File berhasil diunggah', () => {
                navigate('/productprice');
            });
        } catch (error: any) {
            showAlert.error('Gagal', error.message || 'Terjadi kesalahan saat mengunggah');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full min-h-screen py-2 px-6">
            <div className="flex justify-between items-center mb-6 pt-2">
                <p className="text-[32px] font-normal text-[#3f2a2a] tracking-tight">Upload Product Price</p>
                <div className="text-[13px] text-gray-500 font-medium">EMM Service / Product Price / Upload</div>
            </div>

            <div className="bg-white rounded shadow-sm border border-gray-200 w-full">
                <div className="p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 mt-2">
                            {/* Choose File Column */}
                            <div className="flex items-center">
                                <label className="w-1/3 text-[13px] font-medium text-gray-700">Choose File Xls</label>
                                <div className="w-2/3">
                                    <input
                                        type="file"
                                        accept=".xls,.xlsx"
                                        onChange={handleFileChange}
                                        className="block w-full text-[13px] text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-[13px] file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 border border-gray-300 rounded outline-none"
                                    />
                                </div>
                            </div>

                            {/* Example File Column */}
                            <div className="flex items-center">
                                <label className="w-1/3 text-[13px] font-medium text-gray-700">Example File</label>
                                <div className="w-2/3">
                                    <a 
                                        href="/assets/upload/template_upload.xls" 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="bg-[#343a40] hover:bg-[#23272b] text-white px-3 py-1.5 rounded text-[13px] shadow-sm inline-flex items-center gap-1"
                                    >
                                        <i className="fa fa-download"></i> Download
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={submitting || !file}
                                className="bg-[#28a745] hover:bg-[#218838] text-white px-4 py-1.5 rounded text-[13px] font-medium disabled:opacity-50 flex items-center gap-2 shadow-sm"
                            >
                                {submitting ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Mengunggah...
                                    </>
                                ) : 'Upload'}
                            </button>
                            <Link
                                to="/productprice"
                                className="bg-[#ffc107] hover:bg-[#e0a800] text-black px-4 py-1.5 rounded text-[13px] font-medium flex items-center gap-1 shadow-sm"
                            >
                                <i className="fa fa-undo"></i> Kembali
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductPriceUploadPage;
