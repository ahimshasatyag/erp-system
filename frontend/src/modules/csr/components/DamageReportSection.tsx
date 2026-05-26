import React from 'react';
import { Controller } from 'react-hook-form';
import SearchablePaginatedSelect from '../../../components/SearchablePaginatedSelect';

interface DamageReportSectionProps {
    register: any;
    control: any;
    errors: any;
    isViewMode: boolean;
    formData: any;
    initialData?: any;
}

export default function DamageReportSection({
    register,
    control,
    errors,
    isViewMode,
    formData,
    initialData
}: DamageReportSectionProps) {
    return (
        <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">

            {/* Requestor & Location Section */}
            <div className="space-y-3">
                <div className="border-b border-gray-200 dark:border-gray-800 pb-2">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white tracking-wide">Requestor & Location</h3>
                </div>
                <div className="rounded-lg border border-gray-200 dark:border-gray-800">
                    <table className="w-full text-sm text-gray-800 dark:text-gray-300 border-collapse table-fixed">
                        <tbody>
                            <tr className="bg-white dark:bg-[#1e202b] hover:bg-gray-50 dark:hover:bg-[#232733]/30">
                                <td className="py-2.5 px-4 font-semibold text-gray-700 dark:text-gray-400 w-[30%] text-left">
                                    Requestor <span className="text-rose-500">*</span>
                                </td>
                                <td className="py-2.5 px-1 text-center w-[5%]">:</td>
                                <td className="py-2.5 px-4">
                                    <Controller
                                        control={control}
                                        name="id_karyawan"
                                        render={({ field }) => (
                                            <SearchablePaginatedSelect
                                                value={field.value || ''}
                                                onChange={(val) => {
                                                    field.onChange(val);
                                                }}
                                                options={formData?.karyawan?.map((k: any) => ({
                                                    value: String(k.id_karyawan),
                                                    label: k.nm_karyawan,
                                                })) || []}
                                                placeholder="----- Select Requestor -----"
                                                disabled={isViewMode}
                                                error={errors.id_karyawan?.message}
                                            />
                                        )}
                                    />
                                </td>
                            </tr>
                            <tr className="bg-gray-50 dark:bg-[#16171d]/50 hover:bg-gray-100 dark:hover:bg-[#232733]/30">
                                <td className="py-2.5 px-4 font-semibold text-gray-700 dark:text-gray-400 text-left">
                                    Lokasi <span className="text-rose-500">*</span>
                                </td>
                                <td className="py-2.5 px-1 text-center">:</td>
                                <td className="py-2.5 px-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer font-medium">
                                            <input
                                                type="radio"
                                                value="Dalam Kota"
                                                disabled={isViewMode}
                                                {...register('lokasi')}
                                                className="w-4 h-4 text-blue-500 border-gray-300 dark:border-gray-800 focus:ring-blue-500 disabled:opacity-50"
                                            />
                                            Dalam Kota
                                        </label>
                                        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer font-medium">
                                            <input
                                                type="radio"
                                                value="Luar Kota"
                                                disabled={isViewMode}
                                                {...register('lokasi')}
                                                className="w-4 h-4 text-blue-500 border-gray-300 dark:border-gray-800 focus:ring-blue-500 disabled:opacity-50"
                                            />
                                            Luar Kota
                                        </label>
                                    </div>
                                    {errors.lokasi && <p className="mt-1 text-xs text-rose-500">{errors.lokasi.message}</p>}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Empty column for layout symmetry */}
            <div className="hidden md:block"></div>

            {/* Full-width content using flex or column span */}
            <div className="col-span-1 md:col-span-2 space-y-6 pt-2">

                {/* Laporan Kerusakan */}
                <div className="space-y-3">
                    <div className="border-b border-gray-200 dark:border-gray-800 pb-2">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white tracking-wide">Laporan Kerusakan</h3>
                    </div>
                    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
                        <table className="w-full text-sm text-gray-800 dark:text-gray-300 border-collapse table-fixed">
                            <tbody>
                                <tr className="bg-white dark:bg-[#1e202b] hover:bg-gray-50 dark:hover:bg-[#232733]/30">
                                    <td className="py-2.5 px-4 font-semibold text-gray-700 dark:text-gray-400 w-[15%] text-left">
                                        Catatan Kerusakan <span className="text-rose-500">*</span>
                                    </td>
                                    <td className="py-2.5 px-1 text-center w-[2.5%]">:</td>
                                    <td className="py-2.5 px-4">
                                        <textarea
                                            {...register('lap_kerusakan')}
                                            rows={3}
                                            disabled={isViewMode}
                                            placeholder="Enter notes..."
                                            className="w-full bg-white dark:bg-[#161821] text-gray-800 dark:text-white border border-gray-350 dark:border-gray-800 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                        {errors.lap_kerusakan && <p className="mt-1 text-xs text-rose-500">{errors.lap_kerusakan.message}</p>}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Upload Image */}
                <div className="space-y-3">
                    <div className="border-b border-gray-200 dark:border-gray-800 pb-2">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white tracking-wide">Images</h3>
                    </div>
                    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
                        <table className="w-full text-sm text-gray-800 dark:text-gray-300 border-collapse table-fixed">
                            <tbody>
                                <tr className="bg-white dark:bg-[#1e202b] hover:bg-gray-50 dark:hover:bg-[#232733]/30">
                                    <td className="py-2.5 px-4 font-semibold text-gray-700 dark:text-gray-400 w-[15%] text-left">
                                        {isViewMode ? 'Kerusakan Image' : 'Upload Image'}
                                    </td>
                                    <td className="py-2.5 px-1 text-center w-[2.5%]">:</td>
                                    <td className="py-2.5 px-4">
                                        {isViewMode ? (
                                            <div className="relative border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#161821] rounded-lg p-2 flex items-center justify-center h-[120px] w-full md:w-[300px] transition-colors duration-200">
                                                {initialData?.image ? (
                                                    <img
                                                        src={`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/assets/upload/afs/${initialData.image}`}
                                                        alt="Kerusakan"
                                                        onDoubleClick={() => window.open(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/assets/upload/afs/${initialData.image}`, '_blank')}
                                                        className="max-h-full max-w-full object-contain rounded cursor-pointer hover:opacity-80 transition-opacity"
                                                        title="Double click to open in new tab"
                                                    />
                                                ) : (
                                                    <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">No Image Uploaded</span>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-1.5">
                                                <input
                                                    type="file"
                                                    {...register('link_foto')}
                                                    accept="image/*"
                                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-1.5 file:px-4 file:rounded file:border file:border-gray-300 dark:file:border-gray-800 file:text-xs file:font-semibold file:bg-gray-50 dark:file:bg-[#161821] file:text-gray-700 dark:file:text-white hover:file:bg-gray-100 dark:hover:file:bg-[#232733] file:cursor-pointer transition-colors"
                                                />
                                                {initialData?.image && (
                                                    <div className="mt-2 text-xs text-gray-400 flex items-center gap-2">
                                                        <span>Current Image:</span>
                                                        <a
                                                            href={`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/assets/upload/afs/${initialData.image}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-blue-500 hover:text-blue-400 underline transition-colors"
                                                        >
                                                            {initialData.image}
                                                        </a>
                                                    </div>
                                                )}
                                                <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider">Ukuran gambar maksimal 500 KB</span>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
