import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { lktSchema, type LktSchemaInput } from '../validation/lktSchema';

interface LktFormProps {
    initialCstData?: any;
    initialLktData?: any;
    onSubmit: (values: LktSchemaInput, imageFile: File | null) => void;
}

export default function LktForm({ initialCstData, initialLktData, onSubmit }: LktFormProps) {
    // 1. Calculate default service amount based on CST lokasi
    const getDefaultServiceAmount = () => {
        if (initialLktData) return initialLktData.service_amount || 0;
        if (!initialCstData) return 0;
        const lokasi = initialCstData.lokasi || '';
        if (lokasi === 'Dalam Kota') return 300000;
        if (lokasi === 'Luar Kota') return 500000;
        return 0;
    };

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<LktSchemaInput>({
        resolver: zodResolver(lktSchema) as any,
        defaultValues: {
            cst_code: initialLktData?.cst_code || initialCstData?.cst_code || '',
            starting_date: initialLktData?.starting_date ? new Date(initialLktData.starting_date).toISOString().split('T')[0] : '',
            description: initialLktData?.description || '',
            estimation_day: initialLktData?.estimation_day !== undefined ? initialLktData.estimation_day : 1,
            transport_amount: initialLktData?.transport_amount !== undefined ? initialLktData.transport_amount : 0,
            actual_transport: initialLktData?.actual_transport || '',
            accommodation_amount: initialLktData?.accommodation_amount !== undefined ? initialLktData.accommodation_amount : 0,
            service_amount: initialLktData?.service_amount !== undefined ? initialLktData.service_amount : getDefaultServiceAmount(),
            nm_teknisi: initialLktData?.nm_teknisi || []
        }
    });

    const [imagePreview, setImagePreview] = React.useState<string | null>(initialLktData?.image ? `http://localhost:8000/assets/upload/afs/${initialLktData.image}` : null);
    const [selectedImage, setSelectedImage] = React.useState<File | null>(null);

    // Auto-update values when initialCstData or initialLktData mounts
    useEffect(() => {
        if (initialLktData) {
            setValue('cst_code', initialLktData.cst_code || '');
            setValue('starting_date', initialLktData.starting_date ? new Date(initialLktData.starting_date).toISOString().split('T')[0] : '');
            setValue('description', initialLktData.description || '');
            setValue('estimation_day', initialLktData.estimation_day !== undefined ? initialLktData.estimation_day : 1);
            setValue('transport_amount', initialLktData.transport_amount !== undefined ? initialLktData.transport_amount : 0);
            setValue('actual_transport', initialLktData.actual_transport || '');
            setValue('accommodation_amount', initialLktData.accommodation_amount !== undefined ? initialLktData.accommodation_amount : 0);
            setValue('service_amount', initialLktData.service_amount !== undefined ? initialLktData.service_amount : 0);
            if (initialLktData.image) {
                setImagePreview(initialLktData.image.startsWith('http') ? initialLktData.image : `http://localhost:8000/assets/upload/afs/${initialLktData.image}`);
            }
        } else if (initialCstData) {
            setValue('cst_code', initialCstData.cst_code || '');
            setValue('service_amount', getDefaultServiceAmount());
        }
    }, [initialCstData, initialLktData, setValue]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setSelectedImage(null);
            setImagePreview(null);
        }
    };

    const handleFormSubmit = (values: any) => {
        onSubmit(values, selectedImage);
    };

    const getMinStartingDate = () => {
        const dateSource = initialLktData?.csr_date || initialCstData?.csr_date;
        if (!dateSource) return undefined;
        return dateSource.split(' ')[0];
    };

    return (
        <form id="lkt-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 pb-12">
            {/* Laporan Kerusakan Subtitle */}
            <div className="text-left mb-3">
                <h4 className="text-[17px] font-bold text-gray-800 uppercase tracking-wide">Laporan Kerusakan</h4>
            </div>

            {/* Row 1 Grid: Laporan Kerusakan + Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {/* Left Column - Group 1 Table */}
                <div className="border border-[#e7eaec] rounded-[4px] overflow-hidden bg-white h-fit shadow-sm">
                    <table className="w-full text-xs text-gray-800 border-collapse table-fixed">
                        <tbody>
                            <tr className="bg-white">
                                <td className="py-3 px-4 font-bold text-gray-700 w-[30%] text-left bg-[#f3f3f4] border-r border-b border-[#e7eaec] align-middle">
                                    Catatan Kerusakan
                                </td>
                                <td className="py-3 px-1 text-center w-[5%] bg-[#f3f3f4] border-r border-b border-[#e7eaec] align-middle">:</td>
                                <td className="py-3 px-4 text-gray-900 font-medium whitespace-pre-wrap text-left border-b border-[#e7eaec] align-middle">
                                    {initialLktData?.lap_kerusakan || initialCstData?.lap_kerusakan || '-'}
                                </td>
                            </tr>
                            <tr className="bg-white">
                                <td className="py-3 px-4 font-bold text-gray-700 text-left bg-[#f3f3f4] border-r border-[#e7eaec] align-top pt-4">
                                    Tambahan Catatan Kerusakan <span className="text-red-500">*</span>
                                </td>
                                <td className="py-3 px-1 text-center bg-[#f3f3f4] border-r border-[#e7eaec] align-top pt-4">:</td>
                                <td className="py-3 px-4 text-left align-middle">
                                    <textarea
                                        {...register('description')}
                                        rows={3}
                                        className="w-full bg-white text-gray-800 border border-gray-300 rounded-[3px] px-2.5 py-1.5 focus:outline-none focus:border-[#1ab394] font-normal outline-none transition-colors"
                                        placeholder="Masukkan catatan tambahan kerusakan..."
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-red-500 font-medium text-[11px]">{errors.description.message}</p>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Right Column - Group 1 Table (Images) */}
                <div className="border border-[#e7eaec] rounded-[4px] overflow-hidden bg-white h-fit shadow-sm">
                    <table className="w-full text-xs text-gray-850 border-collapse table-fixed">
                        <tbody>
                            <tr className="bg-white">
                                <td className="py-3 px-4 font-bold text-gray-700 w-[30%] text-left bg-[#f3f3f4] border-r border-[#e7eaec] align-top pt-4">
                                    Images
                                </td>
                                <td className="py-3 px-1 text-center w-[5%] bg-[#f3f3f4] border-r border-[#e7eaec] align-top pt-4">:</td>
                                <td className="py-3 px-4 text-left align-middle">
                                    <div className="flex flex-col py-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-semibold text-gray-700 mr-1">Upload Image</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="text-xs text-gray-500 cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-[3px] file:border file:border-gray-300 file:text-xs file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 transition-colors"
                                            />
                                        </div>
                                        <span className="text-[11px] text-red-500 italic mt-1 font-medium">ukuran image max 500kb</span>
                                        {imagePreview && (
                                            <div className="mt-3 border border-gray-300 rounded overflow-hidden max-w-[200px] max-h-[150px]">
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Row 2 Grid: Estimations and Amounts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-2">
                {/* Left Column - Group 2 Table */}
                <div className="border border-[#e7eaec] rounded-[4px] overflow-hidden bg-white h-fit shadow-sm">
                    <table className="w-full text-xs text-gray-850 border-collapse table-fixed">
                        <tbody>
                            <tr className="bg-white">
                                <td className="py-3 px-4 font-bold text-gray-700 w-[30%] text-left bg-[#f3f3f4] border-r border-b border-[#e7eaec] align-middle">
                                    Estimation Day
                                </td>
                                <td className="py-3 px-1 text-center w-[5%] bg-[#f3f3f4] border-r border-b border-[#e7eaec] align-middle">:</td>
                                <td className="py-3 px-4 text-left border-b border-[#e7eaec] align-middle">
                                    <input
                                        type="number"
                                        min={1}
                                        {...register('estimation_day')}
                                        className="w-[100px] bg-white text-gray-800 border border-gray-300 rounded-[3px] px-2.5 py-1.5 focus:outline-none focus:border-[#1ab394] font-normal outline-none transition-colors"
                                    />
                                    {errors.estimation_day && (
                                        <p className="mt-1 text-red-500 font-medium text-[11px]">{errors.estimation_day.message}</p>
                                    )}
                                </td>
                            </tr>
                            <tr className="bg-white">
                                <td className="py-3 px-4 font-bold text-gray-700 text-left bg-[#f3f3f4] border-r border-b border-[#e7eaec] align-middle">
                                    Transport
                                </td>
                                <td className="py-3 px-1 text-center bg-[#f3f3f4] border-r border-b border-[#e7eaec] align-middle">:</td>
                                <td className="py-3 px-4 text-left border-b border-[#e7eaec] align-middle">
                                    <input
                                        type="number"
                                        min={0}
                                        {...register('transport_amount')}
                                        className="w-[300px] max-w-full bg-white text-gray-800 border border-gray-300 rounded-[3px] px-2.5 py-1.5 focus:outline-none focus:border-[#1ab394] font-normal outline-none transition-colors"
                                    />
                                    {errors.transport_amount && (
                                        <p className="mt-1 text-red-500 font-medium text-[11px]">{errors.transport_amount.message}</p>
                                    )}
                                </td>
                            </tr>
                            <tr className="bg-white">
                                <td className="py-3 px-4 font-bold text-gray-700 text-left bg-[#f3f3f4] border-r border-[#e7eaec] align-middle">
                                    Type Transport <span className="text-red-500">*</span>
                                </td>
                                <td className="py-3 px-1 text-center bg-[#f3f3f4] border-r border-[#e7eaec] align-middle">:</td>
                                <td className="py-3 px-4 text-left align-middle">
                                    <select
                                        {...register('actual_transport')}
                                        className="w-[300px] max-w-full bg-white text-gray-800 border border-gray-300 rounded-[3px] px-2.5 py-1.5 focus:outline-none focus:border-[#1ab394] font-normal outline-none cursor-pointer transition-colors text-gray-750"
                                    >
                                        <option value="">Pilih Transport</option>
                                        <option value="Mobil">Mobil</option>
                                        <option value="Motor">Motor</option>
                                        <option value="Lain - lain">Lain - lain</option>
                                    </select>
                                    {errors.actual_transport && (
                                        <p className="mt-1 text-red-500 font-medium text-[11px]">{errors.actual_transport.message}</p>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Right Column - Group 2 Table */}
                <div className="border border-[#e7eaec] rounded-[4px] overflow-hidden bg-white h-fit shadow-sm">
                    <table className="w-full text-xs text-gray-850 border-collapse table-fixed">
                        <tbody>
                            <tr className="bg-white">
                                <td className="py-3 px-4 font-bold text-gray-700 w-[30%] text-left bg-[#f3f3f4] border-r border-b border-[#e7eaec] align-middle">
                                    Start Date <span className="text-red-500">*</span>
                                </td>
                                <td className="py-3 px-1 text-center w-[5%] bg-[#f3f3f4] border-r border-b border-[#e7eaec] align-middle">:</td>
                                <td className="py-3 px-4 text-left border-b border-[#e7eaec] align-middle">
                                    <input
                                        type="date"
                                        min={getMinStartingDate()}
                                        {...register('starting_date')}
                                        className="w-[180px] bg-white text-gray-800 border border-gray-300 rounded-[3px] px-2.5 py-1.5 focus:outline-none focus:border-[#1ab394] font-normal outline-none transition-colors"
                                    />
                                    {errors.starting_date && (
                                        <p className="mt-1 text-red-500 font-medium text-[11px]">{errors.starting_date.message}</p>
                                    )}
                                </td>
                            </tr>
                            <tr className="bg-white">
                                <td className="py-3 px-4 font-bold text-gray-700 text-left bg-[#f3f3f4] border-r border-b border-[#e7eaec] align-middle">
                                    Service Amount
                                </td>
                                <td className="py-3 px-1 text-center bg-[#f3f3f4] border-r border-b border-[#e7eaec] align-middle">:</td>
                                <td className="py-3 px-4 text-left border-b border-[#e7eaec] align-middle">
                                    <input
                                        type="number"
                                        min={0}
                                        {...register('service_amount')}
                                        className="w-[300px] max-w-full bg-white text-gray-800 border border-gray-300 rounded-[3px] px-2.5 py-1.5 focus:outline-none focus:border-[#1ab394] font-normal outline-none transition-colors"
                                    />
                                    {errors.service_amount && (
                                        <p className="mt-1 text-red-500 font-medium text-[11px]">{errors.service_amount.message}</p>
                                    )}
                                </td>
                            </tr>
                            <tr className="bg-white">
                                <td className="py-3 px-4 font-bold text-gray-700 text-left bg-[#f3f3f4] border-r border-[#e7eaec] align-middle">
                                    Accommodation
                                </td>
                                <td className="py-3 px-1 text-center bg-[#f3f3f4] border-r border-[#e7eaec] align-middle">:</td>
                                <td className="py-3 px-4 text-left align-middle">
                                    <input
                                        type="number"
                                        min={0}
                                        {...register('accommodation_amount')}
                                        className="w-[300px] max-w-full bg-white text-gray-800 border border-gray-300 rounded-[3px] px-2.5 py-1.5 focus:outline-none focus:border-[#1ab394] font-normal outline-none transition-colors"
                                    />
                                    {errors.accommodation_amount && (
                                        <p className="mt-1 text-red-500 font-medium text-[11px]">{errors.accommodation_amount.message}</p>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </form>
    );
}
