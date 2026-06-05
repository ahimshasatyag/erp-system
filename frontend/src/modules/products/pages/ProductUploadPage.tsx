import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductUploadForm from '../forms/ProductUploadForm';

const ProductUploadPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full min-h-screen py-2 px-6">
            <div className="flex justify-between items-center mb-6 pt-2">
                <p className="text-[32px] font-normal text-[#3f2a2a] tracking-tight">Product Upload</p>
                <div className="text-[13px] text-gray-500 font-medium">EMM Service / Products / Upload</div>
            </div>
            <div className="mb-4">
                <ProductUploadForm onBack={() => navigate('/product')} />
            </div>
        </div>
    );
};

export default ProductUploadPage;
