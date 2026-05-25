import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CsrForm from '../forms/CsrForm';
import { useGetCsrDetail, useCreateCsr, useUpdateCsr } from '../hooks/useCsr';
import { type StoreCsrValues, type UpdateCsrValues } from '../validation/csrSchema';

export default function CsrFormPage() {
    const { code } = useParams<{ code: string }>();
    const navigate = useNavigate();
    const isEditMode = !!code;

    // We only fetch data if we are in edit mode
    const { data: initialData, isLoading: isFetching } = useGetCsrDetail(code || '');
    const createMutation = useCreateCsr();
    const updateMutation = useUpdateCsr();

    if (isEditMode && isFetching) {
        return <div className="text-center py-10">Loading CSR Data...</div>;
    }

    const handleSubmit = async (data: StoreCsrValues | UpdateCsrValues) => {
        try {
            if (isEditMode && code) {
                await updateMutation.mutateAsync({ csrCode: code, payload: data as UpdateCsrValues });
                alert('CSR Updated successfully');
            } else {
                await createMutation.mutateAsync(data as StoreCsrValues);
                alert('CSR Created successfully');
            }
            navigate('/csr');
        } catch (error: any) {
            console.error('Failed to save CSR:', error);
            alert(error?.response?.data?.message || 'Failed to save data.');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Edit CSR' : 'Create New CSR'}</h1>
                <div className="text-sm text-gray-500 mt-1">EMM Service / CSR / {isEditMode ? 'Edit' : 'Create'}</div>
            </div>

            <CsrForm 
                initialData={initialData || {}} 
                isEditMode={isEditMode} 
                onSubmit={handleSubmit} 
                isSubmitting={createMutation.isPending || updateMutation.isPending} 
            />
        </div>
    );
}
