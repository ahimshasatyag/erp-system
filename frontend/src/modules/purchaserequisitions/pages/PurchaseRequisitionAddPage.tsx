import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PurchaseRequisitionForm from '../forms/PurchaseRequisitionForm';
import { createPurchaseRequisition } from '../api/purchaseRequisitionApi';
import type { PurchaseRequisitionFormData } from '../validation/purchaseRequisitionSchema';
import { showAlert } from '../../../components/SweetAlert';
import { useQuery } from '@tanstack/react-query';
import api from '../../../services/api';

const PurchaseRequisitionAddPage: React.FC = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: menuInfo } = useQuery({
        queryKey: ["menu", "10803"],
        queryFn: async () => {
            const { data } = await api.get(`/menus/10803`);
            return data;
        },
    });

    const menuTitle = menuInfo?.data?.nm_menu || menuInfo?.nm_menu || 'Purchase Requisition';

    const handleSubmit = async (data: PurchaseRequisitionFormData) => {
        setIsSubmitting(true);
        try {
            const response = await createPurchaseRequisition(data);
            if (response.success) {
                showAlert.success('Berhasil', 'Purchase Requisition berhasil ditambahkan');
                navigate('/purchaserequisitions');
            } else {
                showAlert.error('Gagal', response.message || 'Gagal menambahkan Purchase Requisition');
            }
        } catch (error: any) {
            showAlert.error('Error', error.response?.data?.message || 'Terjadi kesalahan pada server');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full min-h-screen py-2 px-4">
            <div className="flex justify-between items-center mb-4 pt-2">
                <p className="text-2xl font-semibold text-[#3f2a2a] tracking-tight">Tambah {menuTitle}</p>
                <div className="text-[12px] text-gray-500 font-medium">EMM Master / {menuTitle} / Tambah</div>
            </div>

            <div className="bg-white rounded shadow-sm border border-gray-200">
                <div className="p-2">
                    <PurchaseRequisitionForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
                </div>
            </div>
        </div>
    );
};

export default PurchaseRequisitionAddPage;
