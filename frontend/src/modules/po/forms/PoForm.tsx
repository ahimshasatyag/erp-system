import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { PoFormData } from '../validation/poSchema';
import { poFormSchema } from '../validation/poSchema';
import { usePoMasterData } from '../hooks/usePoData';
import Select from 'react-select';
import api from '../../../services/api';

export const getLokasi = async (id_gudang: string) => {
    const response = await api.post('/quotations-ap/get-lokasi', { id_gudang });
    return response.data;
};

interface PoFormProps {
    initialData?: any;
    onSubmit: (data: PoFormData, file: File | null) => void;
    isSubmitting: boolean;
    isViewMode?: boolean;
    onEdit?: () => void;
    onCancel?: () => void;
    onConfirm?: () => void;
}

export const PoForm: React.FC<PoFormProps> = ({
    initialData,
    onSubmit,
    isSubmitting,
    isViewMode = false,
    onEdit,
    onCancel,
    onConfirm
}) => {
    const { data: masterData, isLoading: isLoadingMaster } = usePoMasterData();
    const [activeTab, setActiveTab] = useState<'purchase_order' | 'incoming_shipment'>('purchase_order');
    const [lokasiList, setLokasiList] = useState<any[]>([]);
    const [fileObj, setFileObj] = useState<File | null>(null);

    const {
        register,
        control,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors }
    } = useForm<PoFormData>({
        resolver: zodResolver(poFormSchema),
        defaultValues: {
            id_suppliers: '',
            partner_ref: '',
            mata_uang: '',
            id_gudang: '',
            date_po: new Date().toISOString().split('T')[0],
            date_schdl: new Date().toISOString().split('T')[0],
            id_product_lokasi: '',
            details: [{ id_product: '', code_product: '', nm_product: '', product_deskripsi: '', qty: 1, product_price: 0, notes: '' }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'details'
    });

    const watchIdGudang = watch('id_gudang');

    useEffect(() => {
        const fetchLokasi = async () => {
            if (watchIdGudang) {
                try {
                    const res = await getLokasi(watchIdGudang);
                    setLokasiList(res || []);
                    if (res && res.length > 0 && !initialData?.id_product_lokasi) {
                        setValue('id_product_lokasi', String(res[0].id_product_lokasi));
                    }
                } catch (e) {
                    console.error('Failed to fetch lokasi');
                }
            } else {
                setLokasiList([]);
                setValue('id_product_lokasi', '');
            }
        };
        fetchLokasi();
    }, [watchIdGudang, setValue, initialData?.id_product_lokasi]);

    useEffect(() => {
        if (initialData) {
            reset({
                id_suppliers: String(initialData.id_suppliers || ''),
                partner_ref: initialData.partner_ref || '',
                mata_uang: String(initialData.id_mata_uang || ''),
                id_gudang: String(initialData.id_gudang || ''),
                date_po: initialData.date_po || new Date().toISOString().split('T')[0],
                date_schdl: initialData.date_schdl || new Date().toISOString().split('T')[0],
                id_product_lokasi: String(initialData.id_product_lokasi || ''),
                notes: initialData.notes || '',
                details: initialData.details?.length > 0
                    ? initialData.details.map((d: any) => ({
                        id_product: String(d.id_product),
                        code_product: d.code_product,
                        nm_product: d.nm_product,
                        product_deskripsi: d.product_deskripsi,
                        qty: Number(d.qty),
                        product_price: Number(d.product_price),
                        notes: d.notes || ''
                    }))
                    : [{ id_product: '', code_product: '', nm_product: '', product_deskripsi: '', qty: 1, product_price: 0, notes: '' }]
            });
        }
    }, [initialData, reset]);

    const handleProductChange = (index: number, val: any) => {
        if (!val) {
            setValue(`details.${index}.id_product`, '');
            setValue(`details.${index}.code_product`, '');
            setValue(`details.${index}.nm_product`, '');
            setValue(`details.${index}.product_deskripsi`, '');
            return;
        }

        const product = masterData?.products?.find((p: any) => String(p.id_product) === val.value);
        if (product) {
            setValue(`details.${index}.id_product`, String(product.id_product));
            setValue(`details.${index}.code_product`, product.code_product);
            setValue(`details.${index}.nm_product`, product.nm_product);
            setValue(`details.${index}.product_deskripsi`, product.product_deskripsi);
        }
    };

    const handleFormSubmit = (data: PoFormData) => {
        onSubmit(data, fileObj);
    };

    const detailsWatch = watch('details');
    const grandTotal = detailsWatch.reduce((sum, item) => sum + ((Number(item.qty) || 0) * (Number(item.product_price) || 0)), 0);

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full bg-white p-3 lg:p-4">
            {/* Top Bar Actions */}
            <div className="flex items-center gap-2 mb-4 pb-2">
                {!isViewMode && (
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-4 py-2 bg-[#22c55e] text-white text-[13px] font-medium rounded hover:bg-[#16a34a] transition-colors disabled:opacity-50"
                    >
                        <i className="fas fa-save"></i> {isSubmitting ? 'Menyimpan...' : 'Save'}
                    </button>
                )}

                {isViewMode ? (
                    <>
                        {(initialData?.status_po === 'DRAFT PO' || initialData?.status_po === 'QUOTATION') && (
                            <>
                                <button
                                    type="button"
                                    onClick={onEdit}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#0ea5e9] text-white text-[13px] font-medium rounded hover:bg-[#0284c7] transition-colors"
                                >
                                    <i className="fas fa-edit"></i> Edit
                                </button>
                                <button
                                    type="button"
                                    onClick={onConfirm}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#22c55e] text-white text-[13px] font-medium rounded hover:bg-[#16a34a] transition-colors"
                                >
                                    <i className="fas fa-check"></i> Confirm to PO
                                </button>
                            </>
                        )}
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex items-center gap-2 px-4 py-2 bg-[#f59e0b] text-white text-[13px] font-medium rounded hover:bg-[#d97706] transition-colors"
                        >
                            <i className="fas fa-undo"></i> Kembali
                        </button>
                    </>
                ) : (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-4 py-2 bg-[#f59e0b] text-white text-[13px] font-medium rounded hover:bg-[#d97706] transition-colors disabled:opacity-50"
                    >
                        <i className="fas fa-undo"></i> Discard
                    </button>
                )}
            </div>

            {/* Header Form Container */}
            <div className="bg-[#f8f9fa] border border-gray-200 p-3 mb-4 rounded-sm">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-2">
                    {/* Left Column */}
                    <div className="space-y-3">
                        {isViewMode && initialData?.code_po && (
                            <div className="flex items-center">
                                <label className="w-[35%] text-[13px] text-gray-600">PO Number</label>
                                <div className="w-[65%]">
                                    <span className="text-[13px] font-medium">{initialData.code_po}</span>
                                </div>
                            </div>
                        )}
                        <div className="flex items-center">
                            <label className="w-[35%] text-[13px] text-gray-600">Supplier</label>
                            <div className="w-[65%]">
                                <select
                                    {...register('id_suppliers')}
                                    disabled={isViewMode || isLoadingMaster}
                                    className="w-full px-2 py-1.5 text-[13px] border border-gray-300 rounded focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                                >
                                    <option value="">Pilih Supplier</option>
                                    {masterData?.suppliers?.map((s: any) => (
                                        <option key={s.id_suppliers} value={s.id_suppliers}>{s.nm_suppliers}</option>
                                    ))}
                                </select>
                                {errors.id_suppliers && <span className="text-red-500 text-xs">{errors.id_suppliers.message}</span>}
                            </div>
                        </div>
                        <div className="flex items-center">
                            <label className="w-[35%] text-[13px] text-gray-600">Supplier Reference</label>
                            <div className="w-[65%]">
                                <input
                                    type="text"
                                    {...register('partner_ref')}
                                    className="w-full px-2 py-1.5 text-[13px] border border-gray-300 rounded outline-none disabled:bg-gray-100"
                                    disabled={isSubmitting || isViewMode}
                                />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <label className="w-[35%] text-[13px] text-gray-600">Mata Uang</label>
                            <div className="w-[65%]">
                                <select
                                    {...register('mata_uang')}
                                    disabled={isViewMode || isLoadingMaster}
                                    className="w-full px-2 py-1.5 text-[13px] border border-gray-300 rounded focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                                >
                                    <option value="">Pilih Mata Uang</option>
                                    {masterData?.mata_uang?.map((m: any) => (
                                        <option key={m.id_mata_uang} value={m.id_mata_uang}>{m.name}</option>
                                    ))}
                                </select>
                                {errors.mata_uang && <span className="text-red-500 text-xs">{errors.mata_uang.message}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-3">
                        <div className="flex items-center">
                            <label className="w-[35%] text-[13px] text-gray-600">Order Date</label>
                            <div className="w-[65%]">
                                <input
                                    type="date"
                                    {...register('date_po')}
                                    disabled={isViewMode}
                                    className="w-full px-2 py-1.5 text-[13px] border border-gray-300 rounded focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                                />
                                {errors.date_po && <span className="text-red-500 text-xs">{errors.date_po.message}</span>}
                            </div>
                        </div>

                        <div className="flex items-center">
                            <label className="w-[35%] text-[13px] text-gray-600">Destination Warehouse</label>
                            <div className="w-[65%]">
                                <select
                                    {...register('id_gudang')}
                                    disabled={isViewMode || isLoadingMaster}
                                    className="w-full px-2 py-1.5 text-[13px] border border-gray-300 rounded focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                                >
                                    <option value="">Pilih Gudang</option>
                                    {masterData?.gudang?.map((g: any) => (
                                        <option key={g.id_gudang} value={g.id_gudang}>{g.nm_gudang}</option>
                                    ))}
                                </select>
                                {errors.id_gudang && <span className="text-red-500 text-xs">{errors.id_gudang.message}</span>}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <label className="w-[35%] text-[13px] text-gray-600 mt-1.5">Notes</label>
                            <div className="w-[65%]">
                                <textarea
                                    {...register('notes')}
                                    className="w-full px-2 py-1.5 text-[13px] border border-gray-300 rounded outline-none disabled:bg-gray-100 bg-white"
                                    disabled={isSubmitting || isViewMode}
                                    rows={2}
                                />
                            </div>
                        </div>

                        <div className="flex items-start">
                            <label className="w-[35%] text-[13px] text-gray-600 mt-1.5">File</label>
                            <div className="w-[65%]">
                                <input
                                    type="file"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            setFileObj(e.target.files[0]);
                                        }
                                    }}
                                    className="w-full text-[13px]"
                                    disabled={isSubmitting || isViewMode}
                                />
                                {isViewMode && initialData?.link_file && (
                                    <a href={`http://localhost:8000/assets/upload/${initialData.link_file}`} target="_blank" rel="noreferrer" className="text-blue-500 text-[12px] hover:underline mt-1 inline-block">
                                        Lihat File
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 flex gap-6 px-2 mb-4">
                <div
                    onClick={() => setActiveTab('purchase_order')}
                    className={`text-[13px] font-medium pb-2 cursor-pointer ${activeTab === 'purchase_order' ? 'text-gray-800 border-b-2 border-gray-800' : 'text-gray-500 hover:text-gray-800'}`}
                >
                    Purchase Order
                </div>
                <div
                    onClick={() => setActiveTab('incoming_shipment')}
                    className={`text-[13px] font-medium pb-2 cursor-pointer ${activeTab === 'incoming_shipment' ? 'text-gray-800 border-b-2 border-gray-800' : 'text-gray-500 hover:text-gray-800'}`}
                >
                    Incoming Shipment & Invoice
                </div>
            </div>

            {/* Details Section */}
            {activeTab === 'purchase_order' && (
                <div className="mt-2 border border-gray-200 rounded pb-40">
                    <div className="overflow-visible">
                        <table className="min-w-full divide-y divide-gray-200 text-[13px] whitespace-nowrap">
                            <thead className="bg-[#f9f9f9] border-b border-gray-200">
                                <tr>
                                    <th className="px-2 py-1.5 text-center font-bold text-gray-600 w-[3%] border-r border-gray-200">No</th>
                                    <th className="px-2 py-1.5 text-center font-bold text-gray-600 border-r border-gray-200 w-[15%] min-w-[100px]">Kode Barang</th>
                                    <th className="px-2 py-1.5 text-center font-bold text-gray-600 border-r border-gray-200 w-[18%] min-w-[140px]">Nama Barang</th>
                                    <th className="px-2 py-1.5 text-center font-bold text-gray-600 border-r border-gray-200 w-[18%] min-w-[140px]">Deskripsi</th>
                                    <th className="px-2 py-1.5 text-center font-bold text-gray-600 border-r border-gray-200 w-[16%] min-w-[120px]">Notes</th>
                                    <th className="px-2 py-1.5 text-center font-bold text-gray-600 border-r border-gray-200 w-[12%] min-w-[110px]">Price</th>
                                    <th className="px-2 py-1.5 text-center font-bold text-gray-600 border-r border-gray-200 w-[5%] min-w-[60px]">Qty</th>
                                    <th className="px-2 py-1.5 text-center font-bold text-gray-600 border-r border-gray-200 w-[8%] min-w-[90px]">Subtotal</th>
                                    {!isViewMode && <th className="px-2 py-1.5 text-center font-bold text-gray-600 w-[5%] min-w-[60px]"><i className="fas fa-trash"></i></th>}
                                </tr>
                            </thead>
                            <tbody className="bg-[#fcfcfc] divide-y divide-gray-200">
                                {fields.map((field, index) => {
                                    const itemWatch = detailsWatch[index] || {};
                                    const pPrice = Number(itemWatch.product_price) || 0;
                                    const pQty = Number(itemWatch.qty) || 0;
                                    const subtotal = pPrice * pQty;

                                    return (
                                        <tr key={field.id} className="hover:bg-gray-50">
                                            <td className="px-2 py-2 text-center border-r border-gray-200 align-top">
                                                {index + 1}
                                            </td>
                                            <td className="px-2 py-2 border-r border-gray-200 align-top">
                                                {isViewMode ? (
                                                    <span className="text-[13px]">{itemWatch.code_product}</span>
                                                ) : (
                                                    <Select
                                                        isDisabled={isViewMode || isLoadingMaster}
                                                        value={
                                                            itemWatch.id_product
                                                                ? { value: String(itemWatch.id_product), label: itemWatch.code_product }
                                                                : null
                                                        }
                                                        onChange={(val) => handleProductChange(index, val)}
                                                        options={masterData?.products?.map((p: any) => ({
                                                            value: String(p.id_product),
                                                            label: p.code_product
                                                        }))}
                                                        styles={{
                                                            control: (base) => ({
                                                                ...base,
                                                                minHeight: '28px',
                                                                fontSize: '13px',
                                                                border: 'none',
                                                                boxShadow: 'none',
                                                                backgroundColor: 'transparent'
                                                            }),
                                                            valueContainer: (base) => ({ ...base, padding: '0px 4px' }),
                                                            input: (base) => ({ ...base, margin: '0px', padding: '0px' })
                                                        }}
                                                        placeholder="Pilih Barang"
                                                    />
                                                )}
                                                {errors.details?.[index]?.id_product && <span className="text-red-500 text-xs block">{errors.details[index]?.id_product?.message}</span>}
                                            </td>
                                            <td className="px-2 py-2 border-r border-gray-200 align-top">
                                                <textarea
                                                    value={itemWatch.nm_product || ''}
                                                    readOnly
                                                    className="w-full px-2 py-1 text-[13px] bg-transparent outline-none border-none resize-none text-gray-600"
                                                    rows={2}
                                                />
                                            </td>
                                            <td className="px-2 py-2 border-r border-gray-200 align-top">
                                                <textarea
                                                    value={itemWatch.product_deskripsi || ''}
                                                    readOnly
                                                    className="w-full px-2 py-1 text-[13px] bg-transparent outline-none border-none resize-none text-gray-600"
                                                    rows={2}
                                                />
                                            </td>
                                            <td className="px-2 py-2 border-r border-gray-200 align-top">
                                                <textarea
                                                    {...register(`details.${index}.notes` as const)}
                                                    disabled={isViewMode}
                                                    className="w-full px-2 py-1 text-[13px] bg-transparent outline-none border-none resize-none disabled:bg-transparent"
                                                    rows={2}
                                                />
                                            </td>
                                            <td className="px-2 py-2 border-r border-gray-200 align-top">
                                                <input
                                                    type="number"
                                                    {...register(`details.${index}.product_price` as const, { valueAsNumber: true })}
                                                    disabled={isViewMode}
                                                    className="w-full px-2 py-1 text-[13px] text-right bg-transparent outline-none border-none disabled:bg-transparent"
                                                />
                                            </td>
                                            <td className="px-2 py-2 border-r border-gray-200 align-top">
                                                <input
                                                    type="number"
                                                    {...register(`details.${index}.qty` as const, { valueAsNumber: true })}
                                                    disabled={isViewMode}
                                                    className="w-full px-2 py-1 text-[13px] text-center bg-transparent outline-none border-none disabled:bg-transparent"
                                                />
                                            </td>
                                            <td className="px-2 py-2 border-r border-gray-200 align-top text-right text-[13px] font-medium">
                                                {subtotal.toLocaleString()}
                                            </td>
                                            {!isViewMode && (
                                                <td className="px-2 py-2 align-top text-center border-r border-gray-200">
                                                    <button
                                                        type="button"
                                                        onClick={() => remove(index)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot className="bg-[#f9f9f9] border-t border-gray-200">
                                <tr>
                                    <td colSpan={7} className="px-4 py-3 text-right font-bold text-[14px] border-r border-gray-200">
                                        Total Amount
                                    </td>
                                    <td className="px-4 py-3 text-right font-bold text-[14px] border-r border-gray-200">
                                        {grandTotal.toLocaleString()}
                                    </td>
                                    {!isViewMode && <td className="border-r border-gray-200"></td>}
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    {!isViewMode && (
                        <div className="p-3 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => append({ id_product: '', code_product: '', nm_product: '', product_deskripsi: '', qty: 1, product_price: 0, notes: '' })}
                                className="text-[13px] text-blue-600 hover:text-blue-800 font-medium"
                            >
                                <i className="fas fa-plus mr-1"></i> Tambah Barang
                            </button>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'incoming_shipment' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-3 px-2 mt-4">
                    <div className="space-y-3">
                        <h3 className="font-bold text-gray-700 text-[14px] mb-3">Delivery Information</h3>
                        <div className="flex items-center">
                            <label className="w-[35%] text-[13px] text-gray-600">Expected Date</label>
                            <div className="w-[65%]">
                                <input
                                    type="date"
                                    {...register('date_schdl')}
                                    className="w-full px-2 py-1.5 text-[13px] border border-gray-300 rounded outline-none bg-white disabled:bg-gray-100"
                                    disabled={isViewMode}
                                />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <label className="w-[35%] text-[13px] text-gray-600">Destination</label>
                            <div className="w-[65%]">
                                <select
                                    {...register('id_product_lokasi')}
                                    className={`w-full px-2 py-1.5 text-[13px] border rounded outline-none bg-white disabled:bg-gray-100 ${errors.id_product_lokasi ? 'border-red-500' : 'border-gray-300'}`}
                                    disabled={isViewMode}
                                >
                                    <option value="">Select Destination</option>
                                    {lokasiList.map(l => (
                                        <option key={l.id_product_lokasi} value={l.id_product_lokasi}>{l.complete_name}</option>
                                    ))}
                                </select>
                                {errors.id_product_lokasi && <span className="text-red-500 text-[11px]">{errors.id_product_lokasi.message}</span>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
};
