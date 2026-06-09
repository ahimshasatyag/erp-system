import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerForm from '../forms/CustomerForm';
import { createCustomer } from '../api/customerApi';
import type { CustomerFormData } from '../validation/customerSchema';
import { showAlert } from '../../../components/SweetAlert';

const CustomerAddPage: React.FC = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (data: CustomerFormData) => {
        setIsSubmitting(true);
        try {
            const response = await createCustomer(data);
            if (response.success) {
                showAlert.success('Berhasil', 'Customer berhasil ditambahkan');
                navigate('/customers');
            } else {
                showAlert.error('Gagal', response.message || 'Gagal menambahkan Customer');
            }
        } catch (error: any) {
            showAlert.error('Error', error.response?.data?.message || 'Terjadi kesalahan pada server');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full min-h-screen py-2 px-6">
            <div className="flex justify-between items-center mb-6 pt-2">
                <p className="text-[32px] font-normal text-[#3f2a2a] tracking-tight">Tambah Customer</p>
                <div className="text-[13px] text-gray-500 font-medium">EMM Master / Customer / Tambah</div>
            </div>

            <div className="bg-white rounded shadow-sm border border-gray-200">
                <div className="p-6">
                    <CustomerForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
                </div>
            </div>
        </div>
    );
};

export default CustomerAddPage;
