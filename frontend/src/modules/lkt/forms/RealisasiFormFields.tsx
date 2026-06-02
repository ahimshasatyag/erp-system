import React from 'react';
import Select from 'react-select';
import type { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import type { RealisasiFormValues } from '../validation/realisasiForm';

interface RealisasiFormFieldsProps {
    visitData?: {
        lap_kerusakan?: string;
        description?: string;
    };
    register: UseFormRegister<RealisasiFormValues>;
    errors: FieldErrors<RealisasiFormValues>;
    setValue: UseFormSetValue<RealisasiFormValues>;
    canEdit: boolean;
    groupedKaryawan: any[];
    watchTeknisi: string[];
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    imagePreview: string | null;
}

export default function RealisasiFormFields({
    visitData,
    register,
    errors,
    setValue,
    canEdit,
    groupedKaryawan,
    watchTeknisi,
    handleImageChange,
    imagePreview
}: RealisasiFormFieldsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-[13px] text-gray-700">
            {/* Left Column */}
            <div>
                <table className="w-full border-collapse">
                    <tbody>
                        <tr>
                            <td className="w-[35%] py-2.5 px-3 bg-[#f5f5f5] border-b border-white text-gray-600 align-top">Catatan Kerusakan</td>
                            <td className="w-[5%] py-2.5 px-1 text-center bg-[#f5f5f5] border-b border-white align-top">:</td>
                            <td className="py-2.5 px-3 border-b border-white bg-gray-50/30 align-top">
                                {visitData?.lap_kerusakan || '-'}
                            </td>
                        </tr>
                        <tr>
                            <td className="py-2.5 px-3 bg-[#f5f5f5] border-b border-white text-gray-600 align-top">Tambahan Catatan<br/>Kerusakan</td>
                            <td className="py-2.5 px-1 text-center bg-[#f5f5f5] border-b border-white align-top">:</td>
                            <td className="py-2.5 px-3 border-b border-white bg-gray-50/30 align-top">
                                {visitData?.description || '-'}
                            </td>
                        </tr>
                        <tr>
                            <td className="py-2.5 px-3 bg-[#f5f5f5] border-b border-white text-gray-600 align-top pt-3">Actual Catatan Kerusakan <span className="text-red-500">*</span></td>
                            <td className="py-2.5 px-1 text-center bg-[#f5f5f5] border-b border-white align-top pt-3">:</td>
                            <td className="py-2 px-3 border-b border-white align-top">
                                <textarea
                                    readOnly={!canEdit}
                                    {...register('actual_description', { required: 'Keterangan wajib diisi!' })}
                                    rows={4}
                                    className="w-full border border-gray-300 rounded-[3px] px-2.5 py-1.5 focus:outline-none focus:border-[#1ab394] transition-colors disabled:bg-gray-50 disabled:text-gray-600"
                                />
                                {errors.actual_description && (
                                    <p className="mt-1 text-red-500 font-semibold text-[11px]">{errors.actual_description.message}</p>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td className="py-2.5 px-3 bg-[#f5f5f5] border-b border-white text-gray-600 align-middle">Nama Teknisi <span className="text-red-500">*</span></td>
                            <td className="py-2.5 px-1 text-center bg-[#f5f5f5] border-b border-white align-middle">:</td>
                            <td className="py-2 px-3 border-b border-white align-middle">
                                <Select
                                    isMulti
                                    isDisabled={!canEdit}
                                    options={groupedKaryawan}
                                    value={groupedKaryawan.flatMap(g => g.options).filter(o => watchTeknisi.includes(o.value))}
                                    onChange={(selected) => {
                                        setValue('nm_teknisi', selected ? selected.map((s: any) => s.value) : []);
                                    }}
                                    className="text-[13px]"
                                    placeholder="Pilih teknisi..."
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            minHeight: '34px',
                                            borderColor: '#d1d5db',
                                            backgroundColor: (!canEdit) ? '#f9fafb' : '#ffffff',
                                            '&:hover': { borderColor: '#1ab394' },
                                            boxShadow: 'none'
                                        })
                                    }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="py-2.5 px-3 bg-[#f5f5f5] border-b border-white text-gray-600 align-middle">Lama Hari Kerja <span className="text-red-500">*</span></td>
                            <td className="py-2.5 px-1 text-center bg-[#f5f5f5] border-b border-white align-middle">:</td>
                            <td className="py-2 px-3 border-b border-white align-middle">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min={1}
                                        readOnly={!canEdit}
                                        {...register('actual_day', { required: true, valueAsNumber: true })}
                                        className="w-[100px] border border-gray-300 rounded-[3px] px-2.5 py-1.5 focus:outline-none focus:border-[#1ab394] disabled:bg-gray-150 disabled:text-gray-500"
                                    />
                                    <span className="text-gray-500 font-medium">Hari</span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="py-2.5 px-3 bg-[#f5f5f5] border-b border-white text-gray-600 align-middle">Visit Daring</td>
                            <td className="py-2.5 px-1 text-center bg-[#f5f5f5] border-b border-white align-middle">:</td>
                            <td className="py-2 px-3 border-b border-white align-middle">
                                <input
                                    type="checkbox"
                                    disabled={!canEdit}
                                    {...register('flag_daring')}
                                    className="w-3.5 h-3.5 rounded border-gray-300 text-[#1ab394] focus:ring-[#1ab394] mt-1 disabled:opacity-60"
                                />
                                <span className="text-xs text-gray-500 ml-2 italic">Centang jika perbaikan dilakukan via daring / remote</span>
                            </td>
                        </tr>
                        <tr>
                            <td className="py-2.5 px-3 bg-[#f5f5f5] border-b border-white text-gray-600 align-middle">Biaya Transport</td>
                            <td className="py-2.5 px-1 text-center bg-[#f5f5f5] border-b border-white align-middle">:</td>
                            <td className="py-2 px-3 border-b border-white align-middle">
                                <input
                                    type="number"
                                    min={0}
                                    readOnly={!canEdit}
                                    {...register('actual_transport_amount', { valueAsNumber: true })}
                                    className="w-full border border-gray-300 rounded-[3px] px-2.5 py-1.5 focus:outline-none focus:border-[#1ab394] disabled:bg-gray-150 disabled:text-gray-500"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="py-2.5 px-3 bg-[#f5f5f5] text-gray-600 align-middle">Training</td>
                            <td className="py-2.5 px-1 text-center bg-[#f5f5f5] align-middle">:</td>
                            <td className="py-2 px-3 align-middle">
                                <input
                                    type="number"
                                    min={0}
                                    readOnly={!canEdit}
                                    {...register('actual_training', { valueAsNumber: true })}
                                    className="w-full border border-gray-300 rounded-[3px] px-2.5 py-1.5 focus:outline-none focus:border-[#1ab394] disabled:bg-gray-150 disabled:text-gray-500"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Right Column */}
            <div>
                <table className="w-full border-collapse">
                    <tbody>
                        <tr>
                            <td className="w-[35%] py-2.5 px-3 bg-[#f5f5f5] border-b border-white text-gray-600 align-top">Images</td>
                            <td className="w-[5%] py-2.5 px-1 text-center bg-[#f5f5f5] border-b border-white align-top">:</td>
                            <td className="py-2 px-3 border-b border-white align-top">
                                <div className="flex flex-col py-1">
                                    {canEdit && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-700 text-xs">Upload Image</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="text-[11px] text-gray-500 cursor-pointer file:mr-2 file:py-0.5 file:px-2 file:rounded-[2px] file:border file:border-gray-400 file:text-[11px] file:bg-gray-100 hover:file:bg-gray-200"
                                            />
                                        </div>
                                    )}
                                    {canEdit && <span className="text-[11px] text-red-500 italic mt-1 ml-[84px]">ukuran image max 500kb</span>}
                                    {imagePreview && (
                                        <div className={`mt-2 border border-gray-300 rounded overflow-hidden max-w-[200px] max-h-[150px] ${canEdit ? 'ml-[84px]' : ''}`}>
                                            <img src={imagePreview} alt="Bukti Foto Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="w-[35%] py-2.5 px-3 bg-[#f5f5f5] border-b border-white text-gray-600 align-middle">Tanggal Kunjungan <span className="text-red-500">*</span></td>
                            <td className="w-[5%] py-2.5 px-1 text-center bg-[#f5f5f5] border-b border-white align-middle">:</td>
                            <td className="py-2 px-3 border-b border-white align-middle">
                                <input
                                    type="date"
                                    readOnly={!canEdit}
                                    {...register('actual_starting_date', { required: true })}
                                    className="w-full max-w-[200px] border border-gray-300 rounded-[3px] px-2.5 py-1.5 focus:outline-none focus:border-[#1ab394] disabled:bg-gray-150 disabled:text-gray-500"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="py-2.5 px-3 bg-[#f5f5f5] border-b border-white text-gray-600 align-middle">Biaya Service</td>
                            <td className="py-2.5 px-1 text-center bg-[#f5f5f5] border-b border-white align-middle">:</td>
                            <td className="py-2 px-3 border-b border-white align-middle">
                                <input
                                    type="number"
                                    min={0}
                                    readOnly={!canEdit}
                                    {...register('actual_service_amount', { valueAsNumber: true })}
                                    className="w-full border border-gray-300 rounded-[3px] px-2.5 py-1.5 focus:outline-none focus:border-[#1ab394] disabled:bg-gray-150 disabled:text-gray-500"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="py-2.5 px-3 bg-[#f5f5f5] border-b border-white text-gray-600 align-middle">Biaya Akomodasi</td>
                            <td className="py-2.5 px-1 text-center bg-[#f5f5f5] border-b border-white align-middle">:</td>
                            <td className="py-2 px-3 border-b border-white align-middle">
                                <input
                                    type="number"
                                    min={0}
                                    readOnly={!canEdit}
                                    {...register('actual_accommodation_amount', { valueAsNumber: true })}
                                    className="w-full border border-gray-300 rounded-[3px] px-2.5 py-1.5 focus:outline-none focus:border-[#1ab394] disabled:bg-gray-150 disabled:text-gray-500"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="py-2.5 px-3 bg-[#f5f5f5] border-b border-white text-gray-600 align-middle">Biaya Bongkar Pasang</td>
                            <td className="py-2.5 px-1 text-center bg-[#f5f5f5] border-b border-white align-middle">:</td>
                            <td className="py-2 px-3 border-b border-white align-middle">
                                <input
                                    type="number"
                                    min={0}
                                    readOnly={!canEdit}
                                    {...register('actual_bongkar', { valueAsNumber: true })}
                                    className="w-full border border-gray-300 rounded-[3px] px-2.5 py-1.5 focus:outline-none focus:border-[#1ab394] disabled:bg-gray-150 disabled:text-gray-500"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
