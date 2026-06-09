import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import CustomerForm from '../forms/CustomerForm';
import { fetchCustomer, updateCustomer } from '../api/customerApi';
import type { Customer } from '../api/customerApi';
import type { CustomerFormData } from '../validation/customerSchema';
import { showAlert } from '../../../components/SweetAlert';

const CustomerEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [initialData, setInitialData] = useState<Customer | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    const isViewMode = searchParams.get('mode') !== 'edit';

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            try {
                const response = await fetchCustomer(id);
                setInitialData(response.data);
            } catch (error: any) {
                showAlert.error('Error', 'Data Customer tidak ditemukan');
                navigate('/customers');
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [id, navigate]);

    const handleSubmit = async (data: CustomerFormData) => {
        if (!id) return;
        setIsSubmitting(true);
        try {
            const response = await updateCustomer(id, data);
            if (response.success) {
                showAlert.success('Berhasil', 'Customer berhasil diupdate');
                navigate('/customers');
            } else {
                showAlert.error('Gagal', response.message || 'Gagal mengupdate Customer');
            }
        } catch (error: any) {
            showAlert.error('Error', error.response?.data?.message || 'Terjadi kesalahan pada server');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditToggle = () => {
        setSearchParams({ mode: 'edit' }, { state: location.state });
    };

    const handleCancel = () => {
        if (isViewMode) {
            navigate('/customers');
        } else {
            setSearchParams({ mode: 'view' }, { state: location.state });
        }
    };

    if (isLoading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#20c997]"></div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen py-2 px-6">
            <div className="flex justify-between items-center mb-6 pt-2">
                <p className="text-[32px] font-normal text-[#3f2a2a] tracking-tight">
                    {isViewMode ? 'Detail Customer' : 'Edit Customer'}
                </p>
                <div className="text-[13px] text-gray-500 font-medium">EMM Master / Customer {isViewMode ? '/ Detail' : '/ Edit'}</div>
            </div>

            <div className="bg-white rounded shadow-sm border border-gray-200">
                <div className="p-6">
                    <CustomerForm 
                        initialData={initialData} 
                        onSubmit={handleSubmit} 
                        onCancel={handleCancel}
                        onEdit={handleEditToggle}
                        isSubmitting={isSubmitting} 
                        isEditMode={true}
                        isViewMode={isViewMode}
                    />
                </div>
            </div>
        </div>
    );
};

export default CustomerEditPage;
