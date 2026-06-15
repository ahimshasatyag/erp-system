import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { quotationApSchema } from '../validation/quotationApSchema';
import type { QuotationApFormData } from '../validation/quotationApSchema';
import { getProductDetail, getMataUangDefault, getLokasi } from '../api/quotationApApi';
import api from '../../../services/api';
import SearchablePaginatedSelect from '../../../components/SearchablePaginatedSelect';

interface QuotationApFormProps {
    initialData?: any;
    onSubmit: (data: QuotationApFormData, file: File | null) => Promise<void>;
    onCancel?: () => void;
    onEdit?: () => void;
    onConfirm?: () => void;
    isSubmitting: boolean;
    isEditMode?: boolean;
    isViewMode?: boolean;
}

const QuotationApForm: React.FC<QuotationApFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    onEdit,
    onConfirm,
    isSubmitting,
    isEditMode = false,
    isViewMode = false
}) => {
    const navigate = useNavigate();

    // Dropdown Data States
    const [suppliersList, setSuppliersList] = useState<any[]>([]);
    const [gudangList, setGudangList] = useState<any[]>([]);
    const [mataUangList, setMataUangList] = useState<any[]>([]);
    const [lokasiList, setLokasiList] = useState<any[]>([]);
    const [productsList, setProductsList] = useState<any[]>([]);

    const [loadingOpts, setLoadingOpts] = useState(false);
    const [fileObj, setFileObj] = useState<File | null>(null);
    const [activeTab, setActiveTab] = useState<'purchase_order' | 'incoming_shipment'>('purchase_order');
    const [expandedActionRows, setExpandedActionRows] = useState<Record<number, boolean>>({});

    const toggleActionRow = (index: number) => {
        setExpandedActionRows(prev => ({ ...prev, [index]: !prev[index] }));
    };

    const { register, control, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<QuotationApFormData>({
        resolver: zodResolver(quotationApSchema),
        defaultValues: {
            id_suppliers: '',
            partner_ref: '',
            mata_uang: '',
            date_po: new Date().toISOString().split('T')[0],
            id_gudang: '',
            notes: '',
            date_schdl: new Date().toISOString().split('T')[0],
            id_product_lokasi: '',
            details: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "details"
    });

    // Watchers for dynamic behavior
    const watchIdGudang = watch('id_gudang');
    const watchDetails = watch('details');

    // Subtotal calculations
    const calculateSubtotal = (price: number, qty: number) => {
        return (Number(price) * Number(qty)) || 0;
    };

    const formatRupiah = (angka: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'decimal', minimumFractionDigits: 2 }).format(angka);
    };

    useEffect(() => {
        const loadInitialOptions = async () => {
            setLoadingOpts(true);
            try {
                const [supRes, gudRes, mataRes, prodRes] = await Promise.all([
                    api.get('/suppliers', { params: { length: 10000 } }).catch(() => ({ data: [] })),
                    api.get('/product-category', { params: { length: 10000 } }).catch(() => ({ data: [] })), // Assuming gudang endpoint, adjust if needed (in CI it is m_gudang)
                    // If no explicit endpoint, assume they exist or use default arrays. For now, fetch what we can.
                    api.get('/mata-uang').catch(() => ({ data: [] })), // Assuming this exists or handled by general tables
                    api.get('/products', { params: { length: 10000 } }).catch(() => ({ data: [] }))
                ]);

                // Note: The endpoints might need to be adjusted based on actual ERP routes.
                setSuppliersList(Array.isArray(supRes.data?.data) ? supRes.data.data : []);

                // For gudang, using a placeholder endpoint. Adjust according to real routes.
                // Normally it might be `/gudang` or similar. We'll set empty arrays if failed.
                setGudangList([{ id_gudang: '1', nm_gudang: 'Gudang 1' }, { id_gudang: '2', nm_gudang: 'Gudang 2' }]); // Mock fallback
                setMataUangList([{ id_mata_uang: '1', name: 'IDR' }, { id_mata_uang: '2', name: 'USD' }]); // Mock fallback

                setProductsList(Array.isArray(prodRes.data?.data) ? prodRes.data.data : []);
            } finally {
                setLoadingOpts(false);
            }
        };

        loadInitialOptions();
    }, []);

    // Effect for handling location fetching based on Gudang
    useEffect(() => {
        const fetchLokasi = async () => {
            if (watchIdGudang) {
                try {
                    const res = await getLokasi(watchIdGudang);
                    setLokasiList(res || []);
                    if (res && res.length > 0) {
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
    }, [watchIdGudang, setValue]);

    // Handle initial Data
    useEffect(() => {
        if (initialData) {
            reset({
                id_suppliers: String(initialData.id_suppliers || ''),
                partner_ref: initialData.partner_ref || '',
                mata_uang: String(initialData.id_mata_uang || ''),
                date_po: initialData.date_po ? initialData.date_po.split('T')[0] : '',
                id_gudang: String(initialData.id_gudang || ''),
                notes: initialData.notes || '',
                date_schdl: initialData.date_schdl ? initialData.date_schdl.split('T')[0] : '',
                id_product_lokasi: String(initialData.id_product_lokasi || ''),
                details: initialData.details?.map((d: any) => ({
                    id_product: String(d.id_product),
                    code_product: d.code_product,
                    nm_product: d.nm_product,
                    product_deskripsi: d.product_deskripsi,
                    nm_product_satuan: d.nm_product_satuan || '',
                    notes: d.notes || '',
                    product_price: d.product_price || 0,
                    qty: d.qty || 1,
                    options: d.options?.map((o: any) => ({
                        nm_product_opt: o.nm_product_opt,
                        harga: o.harga,
                        checked: o.checked == 1 || o.checked === true
                    })) || []
                })) || []
            });
        }
    }, [initialData, reset]);

    const handleSupplierChange = async (supplierId: string) => {
        setValue('id_suppliers', supplierId);
        try {
            if (supplierId) {
                const res = await getMataUangDefault(supplierId);
                if (res?.id_mata_uang) {
                    setValue('mata_uang', String(res.id_mata_uang));
                }
            }
        } catch (e) {
            console.error('Failed to fetch default mata uang');
        }
    };

    const handleProductChange = async (index: number, productId: string) => {
        setValue(`details.${index}.id_product`, productId);
        try {
            if (productId) {
                const res = await getProductDetail(productId);
                if (res) {
                    setValue(`details.${index}.nm_product`, res.nm_product);
                    setValue(`details.${index}.product_deskripsi`, res.product_deskripsi);
                    setValue(`details.${index}.code_product`, res.code_product || '');
                    setValue(`details.${index}.nm_product_satuan`, res.nm_product_satuan || '');

                    if (res.options && Array.isArray(res.options)) {
                        const newOptions = res.options.map((opt: any) => ({
                            nm_product_opt: opt.nm_product_opt,
                            harga: 0,
                            checked: false
                        }));
                        setValue(`details.${index}.options`, newOptions);
                    } else {
                        setValue(`details.${index}.options`, []);
                    }
                }
            }
        } catch (error) {
            console.error("Failed to fetch product detail", error);
        }
    };

    const handleFormSubmit = (data: QuotationApFormData) => {
        onSubmit(data, fileObj);
    };

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
                        {(initialData?.status_po === 'DRAFT' || initialData?.status_po === 'QUOTATION') && (
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
                            onClick={onCancel || (() => navigate('/quotationsap'))}
                            className="flex items-center gap-2 px-4 py-2 bg-[#f59e0b] text-white text-[13px] font-medium rounded hover:bg-[#d97706] transition-colors"
                        >
                            <i className="fas fa-undo"></i> Kembali
                        </button>
                    </>
                ) : (
                    <button
                        type="button"
                        onClick={onCancel || (() => navigate('/quotationsap'))}
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
                        <div className="flex items-center">
                            <label className="w-[35%] text-[13px] text-gray-600">Supplier</label>
                            <div className="w-[65%]">
                                <Controller
                                    control={control}
                                    name="id_suppliers"
                                    render={({ field }) => (
                                        <SearchablePaginatedSelect
                                            value={field.value}
                                            onChange={(val) => {
                                                field.onChange(val);
                                                handleSupplierChange(val);
                                            }}
                                            options={suppliersList.map(s => ({
                                                value: String(s.id_suppliers),
                                                label: s.nm_suppliers
                                            }))}
                                            placeholder="Select Suppliers"
                                            disabled={isSubmitting || isViewMode || loadingOpts}
                                            error={errors.id_suppliers?.message}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <label className="w-[35%] text-[13px] text-gray-600">Supplier Reference</label>
                            <div className="w-[65%]">
                                <input
                                    type="text"
                                    {...register('partner_ref')}
                                    className="w-full px-2 py-1.5 text-[13px] border border-gray-300 rounded outline-none"
                                    disabled={isSubmitting || isViewMode}
                                />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <label className="w-[35%] text-[13px] text-gray-600">Mata Uang</label>
                            <div className="w-[65%]">
                                <select
                                    {...register('mata_uang')}
                                    className={`w-full px-2 py-1.5 text-[13px] border rounded outline-none bg-white ${errors.mata_uang ? 'border-red-500' : 'border-gray-300'}`}
                                    disabled={isSubmitting || isViewMode}
                                >
                                    <option value="">Select Currency</option>
                                    {mataUangList.map(m => (
                                        <option key={m.id_mata_uang} value={m.id_mata_uang}>{m.name}</option>
                                    ))}
                                </select>
                                {errors.mata_uang && <span className="text-red-500 text-[11px]">{errors.mata_uang.message}</span>}
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
                                    className={`w-full px-2 py-1.5 text-[13px] border rounded outline-none bg-white ${errors.date_po ? 'border-red-500' : 'border-gray-300'}`}
                                    disabled={isSubmitting || isViewMode}
                                />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <label className="w-[35%] text-[13px] text-gray-600">Destination Warehouse</label>
                            <div className="w-[65%]">
                                <select
                                    {...register('id_gudang')}
                                    className={`w-full px-2 py-1.5 text-[13px] border rounded outline-none bg-white ${errors.id_gudang ? 'border-red-500' : 'border-gray-300'}`}
                                    disabled={isSubmitting || isViewMode}
                                >
                                    <option value="">Select Warehouse</option>
                                    {gudangList.map(g => (
                                        <option key={g.id_gudang} value={g.id_gudang}>{g.nm_gudang}</option>
                                    ))}
                                </select>
                                {errors.id_gudang && <span className="text-red-500 text-[11px]">{errors.id_gudang.message}</span>}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <label className="w-[35%] text-[13px] text-gray-600 mt-1.5">Notes</label>
                            <div className="w-[65%]">
                                <textarea
                                    {...register('notes')}
                                    className="w-full px-2 py-1.5 text-[13px] border border-gray-300 rounded outline-none bg-white"
                                    disabled={isSubmitting || isViewMode}
                                    rows={2}
                                />
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

            {/* Tab Content */}
            {activeTab === 'purchase_order' && (
                <div>
                    <div className="mb-3 flex justify-start">
                        {!isViewMode && (
                            <button
                                type="button"
                                onClick={() => append({
                                    id_product: '',
                                    qty: 1,
                                    product_price: 0,
                                    options: []
                                })}
                                className="flex items-center gap-2 px-4 py-2 bg-[#0ea5e9] text-white text-[13px] font-medium rounded hover:bg-[#0284c7] transition-colors"
                            >
                                Tambah Barang
                            </button>
                        )}
                    </div>

                    {errors.details && <p className="text-red-500 text-sm mb-2">{errors.details.message}</p>}

                    <div className="mt-2 border border-gray-200 rounded pb-40">
                        <div className="overflow-visible">
                            <table className="min-w-full divide-y divide-gray-200 text-[13px] whitespace-nowrap">
                                <thead className="bg-[#f9f9f9] border-b border-gray-200">
                                    <tr>
                                        <th className="px-2 py-1.5 text-center font-bold text-gray-600 w-[3%] border-r border-gray-200">No</th>
                                        <th className="px-2 py-1.5 text-center font-bold text-gray-600 border-r border-gray-200 w-[15%] min-w-[100px]">Kode Barang</th>
                                        <th className="px-2 py-1.5 text-center font-bold text-gray-600 border-r border-gray-200 w-[18%] min-w-[140px]">Nama Barang</th>
                                        <th className="px-2 py-1.5 text-center font-bold text-gray-600 border-r border-gray-200 w-[18%] min-w-[140px]">Deksripsi</th>
                                        <th className="px-2 py-1.5 text-center font-bold text-gray-600 border-r border-gray-200 w-[16%] min-w-[120px]">Notes</th>
                                        <th className="px-2 py-1.5 text-center font-bold text-gray-600 border-r border-gray-200 w-[5%] min-w-[60px]">Satuan</th>
                                        <th className="px-2 py-1.5 text-center font-bold text-gray-600 border-r border-gray-200 w-[12%] min-w-[110px]">Price</th>
                                        <th className="px-2 py-1.5 text-center font-bold text-gray-600 border-r border-gray-200 w-[5%] min-w-[60px]">Qty</th>
                                        <th className="px-2 py-1.5 text-center font-bold text-gray-600 border-r border-gray-200 w-[8%] min-w-[90px]">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-[#fcfcfc] divide-y divide-gray-200">
                                    {fields.length === 0 ? (
                                        <tr>
                                            <td colSpan={9} className="px-3 py-4 text-center text-gray-500 bg-[#f9f9f9]">
                                                Tidak ada barang ditambahkan
                                            </td>
                                        </tr>
                                    ) : (
                                        fields.map((field, index) => {
                                            const currentDetail = watchDetails?.[index] || {};
                                            const subtotal = calculateSubtotal(currentDetail.product_price || 0, currentDetail.qty || 0);

                                            return (
                                                <React.Fragment key={field.id}>
                                                    <tr className="hover:bg-gray-50">
                                                        <td className="px-2 py-2 text-center border-r border-gray-200">
                                                            <div className="flex items-center justify-center gap-2">
                                                                {!isViewMode && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => toggleActionRow(index)}
                                                                        className={`text-white w-[18px] h-[18px] min-w-[18px] rounded-full flex items-center justify-center text-[10px] shadow-sm transition-colors ${expandedActionRows[index] ? 'bg-[#ff6b6b] hover:bg-[#fa5252]' : 'bg-[#22c55e] hover:bg-[#16a34a]'}`}
                                                                    >
                                                                        <i className={`fas fa-${expandedActionRows[index] ? 'minus' : 'plus'}`}></i>
                                                                    </button>
                                                                )}
                                                                <span>{index + 1}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-2 py-2 border-r border-gray-200">
                                                            <Controller
                                                                control={control}
                                                                name={`details.${index}.id_product`}
                                                                render={({ field: selectField }) => (
                                                                    <SearchablePaginatedSelect
                                                                        value={selectField.value}
                                                                        onChange={(val) => {
                                                                            selectField.onChange(val);
                                                                            handleProductChange(index, val);
                                                                        }}
                                                                        options={productsList.map(p => ({
                                                                            value: String(p.id_product),
                                                                            label: `${p.code_product}`
                                                                        }))}
                                                                        placeholder="Pilih Kode Barang"
                                                                        disabled={isSubmitting || isViewMode || loadingOpts}
                                                                        error={errors.details?.[index]?.id_product?.message}
                                                                    />
                                                                )}
                                                            />
                                                        </td>
                                                        <td className="px-2 py-2 border-r border-gray-200 align-top">
                                                            <textarea
                                                                value={currentDetail.nm_product || ''}
                                                                className="w-full px-2 py-1 text-[13px] bg-transparent outline-none border-none resize-none text-gray-600"
                                                                disabled
                                                                rows={2}
                                                            />
                                                        </td>
                                                        <td className="px-2 py-2 border-r border-gray-200 align-top">
                                                            <textarea
                                                                {...register(`details.${index}.product_deskripsi` as const)}
                                                                className="w-full px-2 py-1 text-[13px] bg-transparent outline-none border-none resize-none text-gray-600"
                                                                disabled
                                                                rows={2}
                                                            />
                                                        </td>
                                                        <td className="px-2 py-2 border-r border-gray-200 align-top">
                                                            <textarea
                                                                {...register(`details.${index}.notes` as const)}
                                                                className="w-full px-2 py-1 text-[13px] border border-gray-300 rounded outline-none disabled:bg-transparent disabled:border-transparent resize-none bg-white"
                                                                disabled={isSubmitting || isViewMode}
                                                                rows={2}
                                                            />
                                                        </td>
                                                        <td className="px-2 py-2 border-r border-gray-200 text-center">
                                                            <input
                                                                type="text"
                                                                {...register(`details.${index}.nm_product_satuan` as const)}
                                                                className="w-full px-2 py-1 text-[13px] bg-transparent outline-none text-center border-none text-gray-600"
                                                                disabled
                                                            />
                                                        </td>
                                                        <td className="px-2 py-2 border-r border-gray-200">
                                                            <Controller
                                                                control={control}
                                                                name={`details.${index}.product_price`}
                                                                render={({ field: { onChange, value } }) => {
                                                                    const displayValue = value ? new Intl.NumberFormat('id-ID').format(Number(value)) : '';
                                                                    return (
                                                                        <input
                                                                            type="text"
                                                                            value={displayValue}
                                                                            onChange={(e) => {
                                                                                const rawValue = e.target.value.replace(/\D/g, '');
                                                                                onChange(rawValue ? Number(rawValue) : 0);
                                                                            }}
                                                                            className={`w-full px-2 py-1 text-[13px] border rounded outline-none text-right disabled:bg-transparent disabled:border-transparent bg-white ${errors.details?.[index]?.product_price ? 'border-red-500' : 'border-gray-300'}`}
                                                                            disabled={isSubmitting || isViewMode}
                                                                        />
                                                                    );
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-2 py-2 border-r border-gray-200">
                                                            <input
                                                                type="number"
                                                                {...register(`details.${index}.qty` as const)}
                                                                className={`w-full px-2 py-1 text-[13px] border rounded outline-none text-center disabled:bg-transparent disabled:border-transparent bg-white ${errors.details?.[index]?.qty ? 'border-red-500' : 'border-gray-300'}`}
                                                                disabled={isSubmitting || isViewMode}
                                                                min="1"
                                                            />
                                                        </td>
                                                        <td className="px-2 py-2 text-right border-r border-gray-200 align-top pt-3 font-medium">
                                                            {formatRupiah(subtotal)}
                                                        </td>
                                                    </tr>

                                                    {!isViewMode && expandedActionRows[index] && (
                                                        <tr className="bg-gray-50/50">
                                                            <td className="px-3 py-2 text-center font-semibold text-gray-700 border-r border-gray-200">
                                                                Aksi
                                                            </td>
                                                            <td colSpan={8} className="px-3 py-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => remove(index)}
                                                                    className="text-white bg-[#ff6b6b] hover:bg-[#fa5252] w-8 h-8 rounded flex items-center justify-center shadow-sm"
                                                                    title="Hapus baris"
                                                                >
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )}

                                                    {/* Sub-table for Options */}
                                                    {currentDetail.options && currentDetail.options.length > 0 && (
                                                        <tr className="bg-gray-50/50">
                                                            <td colSpan={9} className="px-10 py-3 border-b border-gray-200">
                                                                <table className="w-full border border-gray-300 rounded overflow-hidden">
                                                                    <thead className="bg-gray-100 border-b border-gray-300">
                                                                        <tr>
                                                                            <th className="px-3 py-1 text-left text-[12px] font-bold text-gray-600 border-r border-gray-300">Nama Option</th>
                                                                            <th className="px-3 py-1 text-center text-[12px] font-bold text-gray-600 border-r border-gray-300">Harga</th>
                                                                            <th className="px-3 py-1 text-center text-[12px] font-bold text-gray-600">Pilih</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                                        {currentDetail.options.map((opt: any, optIndex: number) => (
                                                                            <tr key={optIndex}>
                                                                                <td className="px-3 py-1 text-[12px] border-r border-gray-200">
                                                                                    <input
                                                                                        type="text"
                                                                                        {...register(`details.${index}.options.${optIndex}.nm_product_opt`)}
                                                                                        className="w-full bg-transparent outline-none"
                                                                                        readOnly
                                                                                    />
                                                                                </td>
                                                                                <td className="px-3 py-1 border-r border-gray-200">
                                                                                    <Controller
                                                                                        control={control}
                                                                                        name={`details.${index}.options.${optIndex}.harga`}
                                                                                        render={({ field: { onChange, value } }) => {
                                                                                            const displayValue = value ? new Intl.NumberFormat('id-ID').format(Number(value)) : '';
                                                                                            return (
                                                                                                <input
                                                                                                    type="text"
                                                                                                    value={displayValue}
                                                                                                    onChange={(e) => {
                                                                                                        const rawValue = e.target.value.replace(/\D/g, '');
                                                                                                        onChange(rawValue ? Number(rawValue) : 0);
                                                                                                    }}
                                                                                                    className="w-full text-right bg-transparent border border-gray-200 rounded px-1 outline-none text-[12px] disabled:bg-transparent"
                                                                                                    disabled={isSubmitting || isViewMode}
                                                                                                />
                                                                                            );
                                                                                        }}
                                                                                    />
                                                                                </td>
                                                                                <td className="px-3 py-1 text-center">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        {...register(`details.${index}.options.${optIndex}.checked`)}
                                                                                        disabled={isSubmitting || isViewMode}
                                                                                        className="cursor-pointer"
                                                                                    />
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'incoming_shipment' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-3 px-2">
                    <div className="space-y-3">
                        <h3 className="font-bold text-gray-700 text-[14px] mb-3">Delivery Information</h3>
                        <div className="flex items-center">
                            <label className="w-[35%] text-[13px] text-gray-600">Expected Date</label>
                            <div className="w-[65%]">
                                <input
                                    type="date"
                                    {...register('date_schdl')}
                                    className="w-full px-2 py-1.5 text-[13px] border border-gray-300 rounded outline-none bg-white"
                                    disabled={isSubmitting || isViewMode}
                                />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <label className="w-[35%] text-[13px] text-gray-600">Specific Location</label>
                            <div className="w-[65%]">
                                <select
                                    {...register('id_product_lokasi')}
                                    className={`w-full px-2 py-1.5 text-[13px] border rounded outline-none bg-white ${errors.id_product_lokasi ? 'border-red-500' : 'border-gray-300'}`}
                                    disabled={isSubmitting || isViewMode}
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

export default QuotationApForm;
