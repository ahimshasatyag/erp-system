import React from 'react';
import { Controller } from 'react-hook-form';
import SearchablePaginatedSelect from '../../../components/SearchablePaginatedSelect';

interface CustomerSectionProps {
    control: any;
    register: any;
    errors: any;
    isViewMode: boolean;
    formData: any;
    initialData?: any;
}

export default function CustomerSection({
    control,
    register,
    errors,
    isViewMode,
    formData,
    initialData
}: CustomerSectionProps) {
    return (
        <div className="space-y-3">
            <div className="border-b border-gray-200 dark:border-gray-800 pb-2">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white tracking-wide">Customer</h3>
            </div>
            <div className="rounded-lg border border-gray-200 dark:border-gray-800">
                <table className="w-full text-sm text-gray-800 dark:text-gray-300 border-collapse table-fixed">
                    <tbody>
                        <tr className="bg-white dark:bg-[#1e202b] hover:bg-gray-50 dark:hover:bg-[#232733]/30">
                            <td className="py-2.5 px-4 font-semibold text-gray-700 dark:text-gray-400 w-[30%] text-left">Customers Name</td>
                            <td className="py-2.5 px-1 text-center w-[5%]">:</td>
                            <td className="py-2.5 px-4">
                                <Controller
                                    control={control}
                                    name="customers"
                                    render={({ field }) => (
                                        <SearchablePaginatedSelect
                                            value={field.value || ''}
                                            onChange={(val) => {
                                                field.onChange(val);
                                            }}
                                            options={formData?.customers?.map((c: any) => ({
                                                value: String(c.id_customers),
                                                label: c.nm_customers,
                                                subLabel: c.customers_address || undefined
                                            })) || []}
                                            placeholder="----- Select Customers -----"
                                            disabled={isViewMode}
                                            error={errors.customers?.message}
                                        />
                                    )}
                                />
                            </td>
                        </tr>
                        <tr className="bg-gray-50 dark:bg-[#16171d]/50 hover:bg-gray-100 dark:hover:bg-[#232733]/30">
                            <td className="py-2.5 px-4 font-semibold text-gray-700 dark:text-gray-400 text-left">Date Request</td>
                            <td className="py-2.5 px-1 text-center">:</td>
                            <td className="py-2.5 px-4">
                                <input
                                    type="date"
                                    {...register('date_request')}
                                    disabled={isViewMode}
                                    className="w-full bg-white dark:bg-[#161821] text-gray-800 dark:text-white border border-gray-350 dark:border-gray-800 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                {errors.date_request && <p className="mt-1 text-xs text-rose-500">{errors.date_request.message}</p>}
                            </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#1e202b] hover:bg-gray-50 dark:hover:bg-[#232733]/30">
                            <td className="py-2.5 px-4 font-semibold text-gray-700 dark:text-gray-400 text-left">Created Date</td>
                            <td className="py-2.5 px-1 text-center">:</td>
                            <td className="py-2.5 px-4 font-semibold text-gray-700 dark:text-white">
                                {initialData?.csr_input_date ?
                                    new Date(initialData.csr_input_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')
                                    : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
