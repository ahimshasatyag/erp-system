import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import ProductBrandForm from '../forms/ProductBrandForm';
import { fetchProductBrand, updateProductBrand } from '../api/productBrandApi';
import type { ProductBrand } from '../api/productBrandApi';
import type { ProductBrandFormData } from '../validation/productBrandSchema';
import { showAlert } from '../../../components/SweetAlert';

const ProductBrandEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [initialData, setInitialData] = useState<ProductBrand | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    const isViewMode = searchParams.get('mode') !== 'edit';

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            try {
                const response = await fetchProductBrand(id);
                setInitialData(response.data);
            } catch (error: any) {
                showAlert.error('Error', 'Data Product Brand tidak ditemukan');
                navigate('/productbrand');
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [id, navigate]);

    const handleSubmit = async (data: ProductBrandFormData) => {
        if (!id) return;
        setIsSubmitting(true);
        try {
            const payload = {
                ...data,
                id_product_brand: id
            };
            const response = await updateProductBrand(id, payload);
            if (response.success) {
                showAlert.success('Berhasil', 'Product Brand berhasil diupdate');
                navigate('/productbrand');
            } else {
                showAlert.error('Gagal', response.message || 'Gagal mengupdate Product Brand');
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
            navigate('/productbrand');
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
                    {isViewMode ? 'Detail Brand' : 'Edit Brand'}
                </p>
                <div className="text-[13px] text-gray-500 font-medium">EMM Service / Brand {isViewMode ? '/ Detail' : '/ Edit'}</div>
            </div>

            <div className="bg-white rounded shadow-sm border border-gray-200">
                <div className="p-6">
                    <ProductBrandForm
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

export default ProductBrandEditPage;
