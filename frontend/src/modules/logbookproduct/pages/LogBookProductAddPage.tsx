import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogBookProductForm } from '../hooks/useLogBookProductForm';
import { LogBookProductForm } from '../forms/LogBookProductForm';

export default function LogBookProductAddPage() {
    const navigate = useNavigate();
    const { formData, errors, isSubmitting, handleChange, submitForm } = useLogBookProductForm();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submitForm(() => {
            navigate('/logbookproduct');
        });
    };

    const handleCancel = () => {
        navigate('/logbookproduct');
    };

    return (
        <div className="w-full p-4 md:p-6">
            <div className="mb-6">
                <h4 className="text-xl font-bold text-slate-800">Tambah Log Book Product</h4>
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
}
