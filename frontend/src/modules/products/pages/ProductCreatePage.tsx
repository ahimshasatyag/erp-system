import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../forms/ProductForm';

const ProductCreatePage: React.FC = () => {
    const navigate = useNavigate();

    const handleSuccess = () => {
        alert('Product created successfully!');
        navigate('/product');
    };

    return (
        <div className="w-full min-h-screen py-2 px-6">
            <div className="flex justify-between items-center mb-6 pt-2">
                <p className="text-[32px] font-normal text-[#3f2a2a] tracking-tight">Product Add</p>
                <div className="text-[13px] text-gray-500 font-medium">EMM Service / Products / Add</div>
            </div>
            <div className="mb-4">
                <ProductForm onSuccess={handleSuccess} />
            </div>
        </div>
    );
};

export default ProductCreatePage;
