import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import ProductForm from '../forms/ProductForm';
import { fetchProduct } from '../api/productApi';
import type { Product } from '../api/productApi';

const ProductEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const isDuplicate = location.pathname.includes('/duplicate/');
    const isCreate = location.pathname.includes('/create') || !id;

    const [isEditMode, setIsEditMode] = useState<boolean>(() => {
        if (isCreate || isDuplicate) return true;
        const searchParams = new URLSearchParams(location.search);
        return searchParams.get('mode') === 'edit';
    });
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setIsEditMode(isCreate || isDuplicate || new URLSearchParams(location.search).get('mode') === 'edit');
    }, [isCreate, isDuplicate, id, location.search]);

    useEffect(() => {
        if (id && !isCreate && !isDuplicate && !isEditMode) {
            setLoading(true);
            fetchProduct(id).then(res => {
                setProduct(res.data);
            }).catch(console.error).finally(() => setLoading(false));
        }
    }, [id, isCreate, isDuplicate, isEditMode]);

    const handleSuccess = () => {
        alert(isCreate ? 'Product created successfully!' : 'Product updated successfully!');
        navigate('/product');
    };

    const headerButtons = (
        <>
            {!isCreate && !isDuplicate && id && (
                <button
                    onClick={() => {
                        const newMode = !isEditMode;
                        const searchParams = new URLSearchParams(location.search);
                        if (newMode) searchParams.set('mode', 'edit');
                        else searchParams.delete('mode');
                        navigate({ search: searchParams.toString() }, { replace: true, state: location.state });
                    }}
                    className={`flex items-center gap-2 px-4 py-2 text-white text-[13px] font-medium rounded transition-colors ${isEditMode ? 'bg-[#f59e0b] hover:bg-[#d97706]' : 'bg-[#0ea5e9] hover:bg-[#0284c7]'}`}
                >
                    <i className={isEditMode ? "fas fa-undo" : "fas fa-edit"}></i>
                    {isEditMode ? 'Batal Edit' : 'Edit'}
                </button>
            )}
            {(isCreate || isDuplicate) && (
                <button
                    type="button"
                    onClick={() => navigate('/product')}
                    className="flex items-center gap-2 px-4 py-2 bg-[#f59e0b] text-white text-[13px] font-medium rounded hover:bg-[#d97706] transition-colors"
                >
                    <i className="fas fa-undo"></i>
                    Kembali
                </button>
            )}
            {!isEditMode && (
                <>
                    <button type="button" onClick={() => navigate('/product/create')} className="flex items-center gap-2 px-4 py-2 bg-[#eab308] text-white text-[13px] font-medium rounded hover:bg-[#ca8a04] transition-colors"><i className="fas fa-plus"></i> Tambah</button>
                    {id && !isCreate && (
                        <button type="button" onClick={() => navigate(`/product/duplicate/${id}`, { state: { code: product?.code_product } })} className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white text-[13px] font-medium rounded hover:bg-purple-600 transition-colors">Duplikat</button>
                    )}
                </>
            )}
        </>
    );

    return (
        <div className="w-full min-h-screen py-2 px-6">
            <div className="flex justify-between items-center mb-6 pt-2">
                <p className="text-[32px] font-normal text-[#3f2a2a] tracking-tight">Product {isDuplicate ? 'Duplicate' : isCreate ? 'Add' : isEditMode ? 'Edit' : 'Detail'}</p>
                <div className="text-[13px] text-gray-500 font-medium">EMM Service / Products / {isDuplicate ? 'Duplicate' : isCreate ? 'Add' : isEditMode ? 'Edit' : 'Detail'}</div>
            </div>
            {isEditMode ? (
                <ProductForm
                    productId={id}
                    isEdit={!isCreate && !isDuplicate}
                    isDuplicate={isDuplicate}
                    onSuccess={() => navigate('/product')}
                    headerButtons={headerButtons}
                />
            ) : loading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : product ? (
                <div className="space-y-6">
                    {/* Info Card */}
                    <div className="bg-white dark:bg-[#1f2028] p-6 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                Product Details
                            </h4>
                            <div className="flex gap-2">
                                {headerButtons}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Photo */}
                            <div className="col-span-1 lg:col-span-2 flex flex-col items-center">
                                <div className="w-full aspect-square border border-gray-200 dark:border-gray-700 flex items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-400 p-2 rounded">
                                    {product.link_foto ? (
                                        <img src={product.link_foto} alt={product.nm_product} className="w-full h-full object-contain" />
                                    ) : (
                                        <svg className="w-16 h-16 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                            <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2"></line>
                                        </svg>
                                    )}
                                </div>
                            </div>

                            {/* Main Details */}
                            <div className="col-span-1 lg:col-span-4 space-y-4">
                                <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-0.5">Product Code</div>
                                    <div className="text-gray-800 dark:text-gray-200">{product.code_product}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-0.5">Product Name</div>
                                    <div className="text-gray-800 dark:text-gray-200">{product.nm_product}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-0.5">Category</div>
                                    <div className="text-gray-800 dark:text-gray-200">{product.category?.name || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-0.5">Sub Category</div>
                                    <div className="text-gray-800 dark:text-gray-200">{product.sub_category?.name || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-0.5">Product Reference</div>
                                    <div className="text-gray-800 dark:text-gray-200">{product.product_refference || '-'}</div>
                                </div>
                            </div>

                            {/* Brand/Satuan/Desc */}
                            <div className="col-span-1 lg:col-span-4 space-y-4">
                                <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-0.5">Brand</div>
                                    <div className="text-gray-800 dark:text-gray-200">{product.brand?.name || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-0.5">Satuan</div>
                                    <div className="text-gray-800 dark:text-gray-200">{product.unit?.name || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-0.5">Deskripsi</div>
                                    <div className="text-gray-800 dark:text-gray-200">{product.product_deskripsi || '-'}</div>
                                </div>
                            </div>

                            {/* Brosur */}
                            <div className="col-span-1 lg:col-span-2">
                                <div className="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-1">Brosur</div>
                                {product.link_brosur ? (
                                    <a href={product.link_brosur} target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-1.5 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition">
                                        Download Brosur
                                    </a>
                                ) : (
                                    <span className="text-gray-400 text-sm">No Brosur</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Options Card */}
                    <div className="bg-white dark:bg-[#1f2028] p-6 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border border-gray-200 dark:border-gray-700">
                                <thead className="text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 w-16">No</th>
                                        <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">Nama Option</th>
                                        <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 w-24">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {product.options && product.options.length > 0 ? (
                                        product.options.map((opt, index) => (
                                            <tr key={opt.id_product_price_opt || index} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                                                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">{index + 1}</td>
                                                <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{opt.nm_product_opt}</td>
                                                <td className="px-4 py-3"></td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="px-4 py-4 text-center text-gray-500 bg-gray-50 dark:bg-gray-900">No data available in table</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-8 text-red-500">Product not found</div>
            )}
        </div>
    );
};

export default ProductEditPage;
