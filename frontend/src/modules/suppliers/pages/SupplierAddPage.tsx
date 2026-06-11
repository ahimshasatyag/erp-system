import React from 'react';
import { useNavigate } from 'react-router-dom';
import SupplierForm from '../forms/SupplierForm';
import { useCreateSupplier } from '../hooks/useSupplier';
import type { SupplierFormValues } from '../validation/supplierSchema';

const SupplierAddPage: React.FC = () => {
    const navigate = useNavigate();
    const createMutation = useCreateSupplier();

    const handleSubmit = async (data: SupplierFormValues) => {
        try {
            await createMutation.mutateAsync(data);
            navigate('/suppliers');
        } catch (error) {
            console.error('Failed to create supplier:', error);
            alert('Failed to create supplier. Please try again.');
        }
    };

    return (
        <div className="w-full min-h-screen py-2 px-6">
            <div className="flex justify-between items-center mb-6 pt-2">
                <p className="text-[32px] font-normal text-[#3f2a2a] tracking-tight">Supplier Add</p>
                <div className="text-[13px] text-gray-500 font-medium">EMM Master / Supplier / Add</div>
            </div>

            <div className="mb-4">
                <SupplierForm
                    onSubmit={handleSubmit}
                    isLoading={createMutation.isPending}
                    isEditMode={true}
                    onCancel={() => navigate('/suppliers')}
                />
            </div>
        </div>
    );
};

export default SupplierAddPage;
