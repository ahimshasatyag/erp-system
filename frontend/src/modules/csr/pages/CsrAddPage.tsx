import React from 'react';
import { useNavigate } from 'react-router-dom';
import CsrForm from '../forms/CsrForm';
import { showAlert } from '../../../components/SweetAlert';
import { useCreateCsr } from '../hooks/useCsr';
import { type StoreCsrValues } from '../validation/csrSchema';

export default function CsrAddPage() {
    const navigate = useNavigate();
    const createMutation = useCreateCsr();

    const handleSubmit = async (data: any) => {
        try {
            const payload = { ...data };

            // Extract file from FileList if selected
            if (data.link_foto && data.link_foto instanceof FileList && data.link_foto.length > 0) {
                payload.link_foto = data.link_foto[0];
            } else {
                delete payload.link_foto;
            }
            await createMutation.mutateAsync(payload as StoreCsrValues);
            showAlert.success('Berhasil', 'CSR Created successfully');
            navigate('/csr');
        } catch (error: any) {
            console.error('Failed to create CSR:', error);
            showAlert.error('Gagal', error?.response?.data?.message || 'Failed to create CSR. Please try again.');
        }
    };

    return (
        <div className="w-full min-h-screen py-2 px-6 text-sm text-gray-800 dark:text-gray-300 transition-colors duration-200">
            <div className="flex justify-between items-center mb-6 pt-2">
                <div>
                    <h2 className="text-[32px] font-normal text-gray-900 dark:text-white tracking-tight">Tambah Customer Service Request</h2>
                </div>
                <div className="text-[13px] text-gray-500 font-medium">EMM Service / CSR / Create</div>
            </div>

            <div className="max-w-4xl">
                <CsrForm
                    onSubmit={handleSubmit}
                    isSubmitting={createMutation.isPending}
                    actionToolbar={
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => navigate('/csr')}
                                className="bg-white dark:bg-[#161821] text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-5 py-2 rounded-lg text-xs font-bold border border-gray-300 dark:border-gray-855 hover:bg-gray-50 dark:hover:bg-[#232733] transition-all duration-200 cursor-pointer shadow-sm"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={createMutation.isPending}
                                className="bg-[#20c997] hover:bg-[#1ba87e] disabled:bg-[#20c997]/20 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all duration-200 disabled:cursor-not-allowed cursor-pointer shadow-md"
                            >
                                {createMutation.isPending ? (
                                    <div className="flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Saving...
                                    </div>
                                ) : 'Save CSR'}
                            </button>
                        </div>
                    }
                />
            </div>
        </div>
    );
}
