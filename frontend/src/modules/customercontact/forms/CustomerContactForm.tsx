import React from 'react';
import { Controller } from 'react-hook-form';
import { useCustomerContactForm } from '../hooks/useCustomerContactForm';
import { type CustomerContactFormValues } from '../validation/customerContactValidation';
import SearchablePaginatedSelect from '../../../components/SearchablePaginatedSelect';

interface CustomerContactFormProps {
    id?: string | null;
    isEdit?: boolean;
    onSuccess: () => void;
    onCancel: () => void;
}

const CustomerContactForm: React.FC<CustomerContactFormProps> = ({ id, isEdit, onSuccess, onCancel }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        loading,
        submitForm,
        customers,
        control
    } = useCustomerContactForm(id);

    const onSubmit = async (data: CustomerContactFormValues) => {
        const result = await submitForm(data);
        if (result.success) {
            onSuccess();
        } else {
            alert(result.error);
        }
    };


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white dark:bg-[#1f2028] shadow rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h4 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                        {isEdit ? 'Edit Customer Contact' : 'Tambah Contact'}
                    </h4>
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-[#22c55e] text-white text-[13px] font-medium rounded hover:bg-[#16a34a] transition-colors disabled:opacity-50"
                        >
                            <i className="fas fa-save"></i> Simpan
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex items-center gap-2 px-4 py-2 bg-[#f59e0b] text-white text-[13px] font-medium rounded hover:bg-[#d97706] transition-colors"
                        >
                            <i className="fa fa-undo"></i> Kembali
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Name Contact <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className={`w-full px-3 py-1.5 text-[13px] border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white ${errors.nm_customers_contact ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                placeholder="Enter contact name"
                                {...register('nm_customers_contact')}
                            />
                            {errors.nm_customers_contact && <span className="text-red-500 text-sm mt-1">{errors.nm_customers_contact.message as string}</span>}
                        </div>

                        <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Company name <span className="text-red-500">*</span>
                            </label>
                            <Controller
                                control={control}
                                name="id_customers"
                                render={({ field }) => (
                                    <SearchablePaginatedSelect
                                        value={field.value ? String(field.value) : ''}
                                        onChange={(val) => field.onChange(val ? Number(val) : undefined)}
                                        options={customers.map(c => ({
                                            value: c.id,
                                            label: c.name
                                        }))}
                                        placeholder="Company name"
                                        disabled={loading}
                                        error={errors.id_customers?.message}
                                    />
                                )}
                            />
                        </div>

                        <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1">Position</label>
                            <input
                                type="text"
                                className={`w-full px-3 py-1.5 text-[13px] border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white ${errors.customers_contact_posisi ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                placeholder="Enter position"
                                {...register('customers_contact_posisi')}
                            />
                            {errors.customers_contact_posisi && <span className="text-red-500 text-sm mt-1">{errors.customers_contact_posisi.message as string}</span>}
                        </div>

                        <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                            <input
                                type="text"
                                className={`w-full px-3 py-1.5 text-[13px] border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white ${errors.customers_contact_phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                placeholder="Enter phone number"
                                {...register('customers_contact_phone')}
                            />
                            {errors.customers_contact_phone && <span className="text-red-500 text-sm mt-1">{errors.customers_contact_phone.message as string}</span>}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile</label>
                            <input
                                type="text"
                                className={`w-full px-3 py-1.5 text-[13px] border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white ${errors.customers_contact_mobile ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                placeholder="Enter mobile number"
                                {...register('customers_contact_mobile')}
                            />
                            {errors.customers_contact_mobile && <span className="text-red-500 text-sm mt-1">{errors.customers_contact_mobile.message as string}</span>}
                        </div>

                        <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                            <input
                                type="text"
                                className={`w-full px-3 py-1.5 text-[13px] border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white ${errors.customers_contact_email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                placeholder="Enter email"
                                {...register('customers_contact_email')}
                            />
                            {errors.customers_contact_email && <span className="text-red-500 text-sm mt-1">{errors.customers_contact_email.message as string}</span>}
                        </div>

                        <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                            <textarea
                                className={`w-full px-3 py-1.5 text-[13px] border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white ${errors.customers_contact_address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                rows={3}
                                {...register('customers_contact_address')}
                            />
                            {errors.customers_contact_address && <span className="text-red-500 text-sm mt-1">{errors.customers_contact_address.message as string}</span>}
                        </div>
                    </div>
                </div>


            </div>
        </form>
    );
};

export default CustomerContactForm;
