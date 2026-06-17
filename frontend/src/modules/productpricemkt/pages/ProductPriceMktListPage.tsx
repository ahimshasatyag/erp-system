import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMenuInfo } from '../api/productPriceMktApi';
import ProductPriceMktTable from '../components/ProductPriceMktTable';

const ProductPriceMktListPage: React.FC = () => {
    const { data: menuInfo } = useQuery({
        queryKey: ["menu", "10402"],
        queryFn: () => getMenuInfo("10402"),
    });
    const menuTitle = menuInfo?.data?.nm_menu || menuInfo?.nm_menu || 'Product Price Mkt';

    return (
        <div className="w-full min-h-screen py-2 px-6">
            <div className="flex justify-between items-center mb-6 pt-2">
                <p className="text-[32px] font-normal text-[#3f2a2a] tracking-tight">{menuTitle}</p>
                <div className="text-[13px] text-gray-500 font-medium">EMM Service / {menuTitle}</div>
            </div>

            <div className="bg-white rounded shadow-sm border border-gray-200">
                <div className="p-6">
                    <ProductPriceMktTable />
                </div>
            </div>
        </div>
    );
};

export default ProductPriceMktListPage;
