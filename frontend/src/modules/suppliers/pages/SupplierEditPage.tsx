import React, { useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import SupplierForm from '../forms/SupplierForm';
import { useSupplier, useUpdateSupplier } from '../hooks/useSupplier';
import type { SupplierFormValues } from '../validation/supplierSchema';

const SupplierEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Check mode
    const isEditMode = searchParams.get('mode') === 'edit';

    const { data: response, isLoading, isError } = useSupplier(id || '');
    const updateMutation = useUpdateSupplier();

    const supplier = response?.data;

    useEffect(() => {
        if (!isEditMode && !searchParams.get('mode')) {
            // Default to view mode if not specified
        }
    }, [isEditMode, searchParams]);

    useEffect(() => {
        if (supplier && (!location.state || location.state.name !== supplier.nm_suppliers)) {
            navigate(location.pathname + location.search, { replace: true, state: { ...location.state, name: supplier.nm_suppliers } });
        }
    }, [supplier, location.state, location.pathname, location.search, navigate]);

    const handleSubmit = async (data: SupplierFormValues) => {
        if (!id) return;
        try {
            await updateMutation.mutateAsync({ id, data });
            // After successful update, switch back to view mode
            setSearchParams({});
        } catch (error) {
            console.error('Failed to update supplier:', error);
            alert('Failed to update supplier. Please try again.');
        }
    };

    const handleEditClick = () => {
        setSearchParams({ mode: 'edit' });
    };

    const handleCancelClick = () => {
        setSearchParams({});
    };

    const handleBackClick = () => {
        navigate('/suppliers');
    };

    if (isLoading) {
        return <div className="text-center py-8 text-gray-500">Loading...</div>;
    }

    if (isError || !supplier) {
        return <div className="p-4 text-red-500">Error loading supplier data.</div>;
    }

    return (
        <div className="w-full min-h-screen py-2 px-6">
            <div className="flex justify-between items-center mb-6 pt-2">
                <p className="text-[32px] font-normal text-[#3f2a2a] tracking-tight">Supplier {isEditMode ? 'Edit' : 'Detail'}</p>
                <div className="text-[13px] text-gray-500 font-medium">EMM Master / Supplier / {isEditMode ? 'Edit' : 'Detail'}</div>
            </div>

            <div className="mb-4">
                <SupplierForm
                    initialData={supplier}
                    onSubmit={handleSubmit}
                    isLoading={updateMutation.isPending}
                    isEditMode={isEditMode}
                    onCancel={handleCancelClick}
                    onEdit={handleEditClick}
                    onBack={handleBackClick}
                />
            </div>
        </div>
    );
};

export default SupplierEditPage;
