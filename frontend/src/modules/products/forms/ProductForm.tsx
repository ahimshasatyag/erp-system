import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import { useProductForm } from '../hooks/useProductForm';
import type { ProductFormValues } from '../hooks/useProductForm';
import CreateBrandModal from '../components/CreateBrandModal';

interface ProductFormProps {
    productId?: string | null;
    isDuplicate?: boolean;
    isEdit?: boolean;
    onSuccess: () => void;
    headerButtons?: React.ReactNode;
}

const ProductForm: React.FC<ProductFormProps> = ({ productId = null, isDuplicate = false, isEdit = false, onSuccess, headerButtons }) => {
    const {
        register,
        handleSubmit,
        errors,
        loading,
        submitForm,
        subCategories,
        fotoPreview,
        handlePhotoChange,
        handleBrosurChange,
        optionFields,
        appendOption,
        removeOption,
        setValue
    } = useProductForm(productId, isDuplicate);

    const [isBrandModalOpen, setIsBrandModalOpen] = useState<boolean>(false);
    const [newBrandName, setNewBrandName] = useState<string>('');
    const [brands, setBrands] = useState<{id: string, name: string}[]>([]); 
    const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
    const [units, setUnits] = useState<{id: string, name: string}[]>([]);

    const onSubmit = async (data: ProductFormValues) => {
        const result = await submitForm(data);
        if (result.success) {
            onSuccess();
        } else {
            alert(result.error);
        }
    };

    const handleBrandChange = (e: ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value === 'create_new') {
            setNewBrandName('');
            setIsBrandModalOpen(true);
        } else {
            setValue('id_product_brand', e.target.value);
        }
    };

    const handleBrandCreated = (newBrand: {id: string, name: string}) => {
        setBrands(prev => [...prev, newBrand]);
        setValue('id_product_brand', newBrand.id);
    };

    if (loading && productId) return <div>Loading product data...</div>;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white dark:bg-[#1f2028] shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h4 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                        {isEdit ? 'Edit Product' : 'Tambah Product'}
                    </h4>
                    <div className="flex gap-2">
                        {headerButtons}
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#22c55e] text-white text-[13px] font-medium rounded hover:bg-[#16a34a] transition-colors disabled:opacity-50" type="submit" disabled={loading}>
                            <i className="fas fa-save"></i>
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Photo Upload */}
                    <div className="col-span-1 lg:col-span-2 flex flex-col items-center">
                        <label htmlFor="link_foto" className="cursor-pointer">
                            <img 
                                src={fotoPreview || "/assets/images/placeholder.png"} 
                                className="w-full h-auto object-cover rounded border border-gray-200 dark:border-gray-700 shadow-sm" 
                                alt="Product"
                            />
                        </label>
                        <input 
                            type="file" 
                            className="hidden" 
                            id="link_foto" 
                            accept="image/*"
                            onChange={handlePhotoChange}
                        />
                        <span className="text-xs text-gray-500 mt-2">Click image to upload</span>
                    </div>

                    {/* Main Details */}
                    <div className="col-span-1 lg:col-span-4 space-y-4">
                        <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1">Product Code</label>
                            <input 
                                type="text" 
                                className={`w-full px-3 py-1.5 text-[13px] border rounded focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white ${errors.code_product ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                {...register('code_product')}
                                disabled={isEdit && !isDuplicate} 
                            />
                            {errors.code_product && <span className="text-red-500 text-sm mt-1">{errors.code_product.message as string}</span>}
                        </div>
                        <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
                            <input 
                                type="text" 
                                className={`w-full px-3 py-1.5 text-[13px] border rounded focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white ${errors.nm_product ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                {...register('nm_product')}
                            />
                            {errors.nm_product && <span className="text-red-500 text-sm mt-1">{errors.nm_product.message as string}</span>}
                        </div>
                        <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                            <select 
                                className={`w-full px-3 py-1.5 text-[13px] border rounded focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white ${errors.id_product_kategori ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                {...register('id_product_kategori')}
                            >
                                <option value="">Select Category</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1">Sub Category</label>
                            <select 
                                className={`w-full px-3 py-1.5 text-[13px] border rounded focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white ${errors.id_product_sub_kategori ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                {...register('id_product_sub_kategori')}
                            >
                                <option value="">Select Sub Category</option>
                                {subCategories.map((sc: any) => <option key={sc.id_product_sub_kategori} value={sc.id_product_sub_kategori}>{sc.nm_product_sub_kategori}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1">Product Reference</label>
                            <input 
                                type="text" 
                                className={`w-full px-3 py-1.5 text-[13px] border rounded focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white ${errors.product_refference ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                {...register('product_refference')}
                            />
                        </div>
                    </div>

                    {/* Brand, Unit, Description */}
                    <div className="col-span-1 lg:col-span-4 space-y-4">
                        <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1">Brand</label>
                            <select 
                                className={`w-full px-3 py-1.5 text-[13px] border rounded focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white ${errors.id_product_brand ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                {...register('id_product_brand')}
                                onChange={handleBrandChange}
                            >
                                <option value="">Select Brand</option>
                                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                <option value="create_new">-- Create New --</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1">Satuan</label>
                            <select 
                                className={`w-full px-3 py-1.5 text-[13px] border rounded focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white ${errors.id_product_satuan ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                {...register('id_product_satuan')}
                            >
                                <option value="">Select Satuan</option>
                                {units.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1">Deskripsi</label>
                            <textarea 
                                className={`w-full px-3 py-1.5 text-[13px] border rounded focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white ${errors.product_deskripsi ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                rows={4}
                                {...register('product_deskripsi')}
                            />
                        </div>
                    </div>

                    {/* Brosur */}
                    <div className="col-span-1 lg:col-span-2 space-y-4">
                        <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1">Brosur</label>
                            <div className="flex flex-col gap-2">
                                <label className="inline-block text-center px-3 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 cursor-pointer text-[13px] transition" htmlFor="link_brosur">Upload Brosur</label>
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    id="link_brosur" 
                                    accept="application/pdf"
                                    onChange={handleBrosurChange}
                                />
                                <span className="text-xs text-gray-500">PDF Only</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dynamic Options */}
            <div className="bg-white dark:bg-[#1f2028] shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 p-6">
                <div className="mb-4">
                    <button 
                        type="button" 
                        className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium text-[13px]"
                        onClick={() => appendOption({ value: '' })}
                    >
                        + Tambah Options
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-[13px] text-left border border-gray-200 dark:border-gray-700">
                        <thead className="text-[12px] text-gray-500 uppercase bg-[#f8f9fa] dark:bg-gray-800 dark:text-gray-300 font-medium border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-2 py-1.5 border-r border-gray-100 dark:border-gray-700 w-12 text-center">No</th>
                                <th className="px-2 py-1.5 border-r border-gray-100 dark:border-gray-700">Nama Option</th>
                                <th className="px-2 py-1.5 text-center w-20">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {optionFields.map((field, index) => (
                                <tr key={field.id} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <td className="px-2 py-1 text-center border-r border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300">{index + 1}</td>
                                    <td className="px-2 py-1 border-r border-gray-100 dark:border-gray-700">
                                        <input 
                                            type="text" 
                                            className="w-full px-2 py-1 text-[13px] border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                                            {...register(`options.${index}.value` as const)}
                                            required 
                                        />
                                    </td>
                                    <td className="px-2 py-1 text-center">
                                        <button 
                                            type="button" 
                                            className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-[12px]"
                                            onClick={() => removeOption(index)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {optionFields.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-2 py-2 text-[13px] text-center text-gray-500">No options added</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <CreateBrandModal 
                isOpen={isBrandModalOpen}
                onClose={() => setIsBrandModalOpen(false)}
                onBrandCreated={handleBrandCreated}
                initialBrandName={newBrandName}
            />
        </form>
    );
};

export default ProductForm;
