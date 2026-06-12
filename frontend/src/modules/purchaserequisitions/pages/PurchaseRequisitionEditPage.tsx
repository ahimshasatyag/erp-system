import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PurchaseRequisitionForm from '../forms/PurchaseRequisitionForm';
import { getPurchaseRequisition, updatePurchaseRequisition, ajukanPurchaseRequisition } from '../api/purchaseRequisitionApi';
import type { PurchaseRequisitionFormData } from '../validation/purchaseRequisitionSchema';
import { showAlert } from '../../../components/SweetAlert';
import { useQuery } from '@tanstack/react-query';
import api from '../../../services/api';

const PurchaseRequisitionEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isViewMode, setIsViewMode] = useState(true);

    const { data: menuInfo } = useQuery({
        queryKey: ["menu", "10803"],
        queryFn: async () => {
            const { data } = await api.get(`/menus/10803`);
            return data;
        },
    });

    const menuTitle = menuInfo?.data?.nm_menu || menuInfo?.nm_menu || 'Purchase Requisition';

    useEffect(() => {
        const fetchPR = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const response = await getPurchaseRequisition(id);
                // Extract data depending on API response format
                const prData = response.data || response;
                setInitialData(prData);
            } catch (err: any) {
                setError(err.message || 'Gagal memuat data Purchase Requisition');
                showAlert.error('Error', 'Gagal memuat data');
            } finally {
                setLoading(false);
            }
        };

        fetchPR();
    }, [id]);

    const handleSubmit = async (data: PurchaseRequisitionFormData) => {
        if (!id) return;
        setIsSubmitting(true);
        try {
            const response = await updatePurchaseRequisition(id, data);
            if (response.success) {
                showAlert.success('Berhasil', 'Purchase Requisition berhasil diupdate');
                setIsViewMode(true);
                // Refresh data if needed or rely on local state update
            } else {
                showAlert.error('Gagal', response.message || 'Gagal mengupdate Purchase Requisition');
            }
        } catch (error: any) {
            showAlert.error('Error', error.response?.data?.message || 'Terjadi kesalahan pada server');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirm = async () => {
        if (!id) return;
        
        // Use sweet alert confirm
        showAlert.confirm(
            'Konfirmasi Ajukan',
            'Apakah Anda yakin ingin mengajukan Purchase Requisition ini?',
            async () => {
                setIsSubmitting(true);
                try {
                    const response = await ajukanPurchaseRequisition(id);
                    if (response.success) {
                        showAlert.success('Berhasil', 'Purchase Requisition berhasil diajukan');
                        navigate('/purchaserequisitions');
                    } else {
                        showAlert.error('Gagal', response.message || 'Gagal mengajukan Purchase Requisition');
                    }
                } catch (error: any) {
                    showAlert.error('Error', error.response?.data?.message || 'Terjadi kesalahan pada server');
                } finally {
                    setIsSubmitting(false);
                }
            }
        );
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen py-2 px-6 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#20c997]"></div>
            </div>
        );
    }

    if (error || !initialData) {
        return (
            <div className="w-full min-h-screen py-2 px-6 flex flex-col items-center justify-center">
                <p className="text-red-500 mb-4">{error || 'Data tidak ditemukan'}</p>
                <button onClick={() => navigate('/purchaserequisitions')} className="px-4 py-2 bg-gray-200 rounded">Kembali</button>
            </div>
        );
    }

    // Usually can only edit if status is DRAFT
    // But we let form handle the view mode logic based on its props
    return (
        <div className="w-full min-h-screen py-2 px-6">
            <div className="flex justify-between items-center mb-6 pt-2">
                <p className="text-[32px] font-normal text-[#3f2a2a] tracking-tight">{isViewMode ? `Detail ${menuTitle}` : `Edit ${menuTitle}`}</p>
                <div className="text-[13px] text-gray-500 font-medium">EMM Master / {menuTitle} / {isViewMode ? 'Detail' : 'Edit'}</div>
            </div>

            <div className="bg-white rounded shadow-sm border border-gray-200">
                <div className="p-6">
                    <PurchaseRequisitionForm 
                        initialData={initialData} 
                        onSubmit={handleSubmit} 
                        isSubmitting={isSubmitting} 
                        isEditMode={!isViewMode}
                        isViewMode={isViewMode}
                        onEdit={() => setIsViewMode(false)}
                        onCancel={() => {
                            if (!isViewMode) {
                                setIsViewMode(true); // Cancel edit
                            } else {
                                navigate('/purchaserequisitions'); // Go back to list
                            }
                        }}
                        onConfirm={handleConfirm}
                    />
                </div>
            </div>
        </div>
    );
};

export default PurchaseRequisitionEditPage;
