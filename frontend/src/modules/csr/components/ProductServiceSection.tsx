import React from 'react';
import { Controller } from 'react-hook-form';
import SearchablePaginatedSelect from '../../../components/SearchablePaginatedSelect';

interface ProductServiceSectionProps {
    register: any;
    control: any;
    errors: any;
    isEditMode: boolean;
    isViewMode: boolean;
    formData: any;
    isiOtomatisPending: boolean;
    onBarcodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProductServiceSection({
    register,
    control,
    errors,
    isEditMode,
    isViewMode,
    formData,
    isiOtomatisPending,
    onBarcodeChange
}: ProductServiceSectionProps) {
    return (
        <div className="space-y-3">
            <div className="border-b border-gray-200 dark:border-gray-800 pb-2">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white tracking-wide">Product To Service</h3>
            </div>
            <div className="rounded-lg border border-gray-200 dark:border-gray-800">
                <table className="w-full text-sm text-gray-800 dark:text-gray-300 border-collapse table-fixed">
                    <tbody>
                        <tr className="bg-white dark:bg-[#1e202b] hover:bg-gray-50 dark:hover:bg-[#232733]/30">
                            <td className="py-2.5 px-4 font-semibold text-gray-700 dark:text-gray-400 w-[30%] text-left">Serial Number</td>
                            <td className="py-2.5 px-1 text-center w-[5%]">:</td>
                            <td className="py-2.5 px-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        {...register('sn_number')}
                                        onChange={(e) => {
                                            register('sn_number').onChange(e);
                                            onBarcodeChange(e);
                                        }}
                                        disabled={isEditMode || isViewMode}
                                        placeholder="Enter Serial Number"
                                        className="w-full bg-white dark:bg-[#161821] text-gray-800 dark:text-white border border-gray-350 dark:border-gray-800 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                    {isiOtomatisPending && (
                                        <span className="absolute right-3 top-2.5">
                                            <svg className="w-4 h-4 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        </span>
                                    )}
                                </div>
                                {errors.sn_number && <p className="mt-1 text-xs text-rose-500">{errors.sn_number.message}</p>}
                            </td>
                        </tr>
                        <tr className="bg-gray-50 dark:bg-[#16171d]/50 hover:bg-gray-100 dark:hover:bg-[#232733]/30">
                            <td className="py-2.5 px-4 font-semibold text-gray-700 dark:text-gray-400 text-left">Product Name</td>
                            <td className="py-2.5 px-1 text-center">:</td>
                            <td className="py-2.5 px-4">
                                <Controller
                                    control={control}
                                    name="id_product"
                                    render={({ field }) => (
                                        <SearchablePaginatedSelect
                                            value={field.value || ''}
                                            onChange={(val) => {
                                                field.onChange(val);
                                            }}
                                            options={formData?.products?.map((p: any) => ({
                                                value: String(p.id_product),
                                                label: p.nm_product,
                                                subLabel: p.code_product
                                            })) || []}
                                            placeholder="----- Select Product -----"
                                            disabled={isEditMode || isViewMode}
                                            error={errors.id_product?.message}
                                        />
                                    )}
                                />
                            </td>
                        </tr>
                        <tr className="bg-white dark:bg-[#1e202b] hover:bg-gray-50 dark:hover:bg-[#232733]/30">
                            <td className="py-2.5 px-4 font-semibold text-gray-700 dark:text-gray-400 text-left">
                                Status Pemasangan <span className="text-rose-500">*</span>
                            </td>
                            <td className="py-2.5 px-1 text-center">:</td>
                            <td className="py-2.5 px-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer font-medium">
                                        <input
                                            type="radio"
                                            value="1"
                                            disabled={isEditMode || isViewMode}
                                            {...register('sts_pasang')}
                                            className="w-4 h-4 text-blue-500 border-gray-300 dark:border-gray-800 focus:ring-blue-500 disabled:opacity-50"
                                        />
                                        Pasang Baru
                                    </label>
                                    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer font-medium">
                                        <input
                                            type="radio"
                                            value="0"
                                            disabled={isEditMode || isViewMode}
                                            {...register('sts_pasang')}
                                            className="w-4 h-4 text-blue-500 border-gray-300 dark:border-gray-800 focus:ring-blue-500 disabled:opacity-50"
                                        />
                                        Service
                                    </label>
                                </div>
                                {errors.sts_pasang && <p className="mt-1 text-xs text-rose-500">{errors.sts_pasang.message}</p>}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
