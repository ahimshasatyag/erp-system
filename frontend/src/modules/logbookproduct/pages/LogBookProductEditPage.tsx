import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLogBookProductForm } from '../hooks/useLogBookProductForm';
import { LogBookProductForm } from '../forms/LogBookProductForm';

export default function LogBookProductEditPage() {
    const navigate = useNavigate();
    const { code } = useParams<{ code: string }>();
    
    // For demonstration, parse code to number if needed or use as string
    const id = code ? parseInt(code, 10) : 0;
    
    const { formData, errors, isSubmitting, isLoading, handleChange, submitForm } = useLogBookProductForm(id);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submitForm(() => {
            navigate('/logbookproduct');
        });
    };

    const handleCancel = () => {
        navigate('/logbookproduct');
    };

    if (isLoading) {
        return <div className="text-center py-4">Loading data...</div>;
    }

    return (
        <div className="w-full p-4 md:p-6">
            <div className="mb-6">
                <h4 className="text-xl font-bold text-slate-800">Edit Log Book Product</h4>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <LogBookProductForm
                    formData={formData}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    handleChange={handleChange}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
};
