import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { logBookCustomerSchema } from '../validation/logBookCustomerSchema';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import SearchablePaginatedSelect from '../../../components/SearchablePaginatedSelect';

interface LogBookCustomerFormProps {
    initialData?: any;
    customers: any[];
    onSubmit: (data: any) => Promise<boolean>;
    loading: boolean;
    isEdit?: boolean;
}

export const LogBookCustomerForm: React.FC<LogBookCustomerFormProps> = ({ initialData, customers, onSubmit, loading, isEdit }) => {
    const navigate = useNavigate();

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
        resolver: zodResolver(logBookCustomerSchema),
        defaultValues: {
            id_customers: '',
            date_log_book: new Date().toISOString().split('T')[0],
            masalah_hidden: '',
            solusi_hidden: '',
            catatan_hidden: ''
        }
    });

    useEffect(() => {
        if (initialData) {
            reset({
                id_customers: initialData.id_customers || '',
                date_log_book: initialData.date_log_book ? new Date(initialData.date_log_book).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                masalah_hidden: initialData.masalah || '',
                solusi_hidden: initialData.solusi || '',
                catatan_hidden: initialData.catatan || ''
            });
        }
    }, [initialData, reset]);

    const submitHandler = async (data: any) => {
        const success = await onSubmit(data);
        if (success) {
            navigate('/logbookcustomers');
        }
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            ['link', 'image'],
            ['clean']
        ],
    };

    return (
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8 pb-4">
                <div className="flex items-center gap-4 flex-1">
                    <label className="text-sm font-semibold text-slate-600 w-28 shrink-0">Customers *</label>
                    <div className="flex-1">
                        <Controller
                            name="id_customers"
                            control={control}
                            render={({ field }) => (
                                <SearchablePaginatedSelect
                                    value={field.value || ''}
                                    onChange={(val) => field.onChange(String(val))}
                                    options={customers.map((c: any) => ({
                                        value: c.id_customers,
                                        label: c.nm_customers
                                    }))}
                                    placeholder="Select Customers"
                                    disabled={isEdit}
                                    error={errors.id_customers?.message}
                                />
                            )}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <label className="text-sm font-semibold text-slate-600 shrink-0">Date *</label>
                    <div>
                        <input
                            type="date"
                            {...register('date_log_book')}
                            className={`w-36 p-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 outline-none ${errors.date_log_book ? 'border-red-500' : 'border-slate-300'} ${isEdit ? 'bg-slate-100' : 'bg-white'}`}
                            disabled={isEdit}
                        />
                        {errors.date_log_book && <p className="text-red-500 text-xs mt-1">{errors.date_log_book.message}</p>}
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 border-t border-slate-200 pt-6">
                <label className="text-sm font-semibold text-slate-600 w-28 shrink-0 pt-2">Complaint *</label>
                <div className="flex-1">
                    <Controller
                        name="masalah_hidden"
                        control={control}
                        render={({ field }) => (
                            <div className={`rounded-md ${errors.masalah_hidden ? 'border border-red-500' : ''}`}>
                                <ReactQuill 
                                    theme="snow" 
                                    value={field.value} 
                                    onChange={field.onChange} 
                                    modules={modules}
                                    className="bg-white"
                                    style={{ height: '250px', marginBottom: '50px' }}
                                    readOnly={isEdit}
                                />
                            </div>
                        )}
                    />
                    {errors.masalah_hidden && <p className="mt-1 text-xs text-red-500">{errors.masalah_hidden.message}</p>}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 border-t border-slate-200 pt-6">
                <label className="text-sm font-semibold text-slate-600 w-28 shrink-0 pt-2">Feedback *</label>
                <div className="flex-1">
                    <Controller
                        name="solusi_hidden"
                        control={control}
                        render={({ field }) => (
                            <div className={`rounded-md ${errors.solusi_hidden ? 'border border-red-500' : ''}`}>
                                <ReactQuill 
                                    theme="snow" 
                                    value={field.value} 
                                    onChange={field.onChange} 
                                    modules={modules}
                                    className="bg-white"
                                    style={{ height: '250px', marginBottom: '50px' }}
                                    readOnly={isEdit}
                                />
                            </div>
                        )}
                    />
                    {errors.solusi_hidden && <p className="mt-1 text-xs text-red-500">{errors.solusi_hidden.message}</p>}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 border-t border-slate-200 pt-6">
                <label className="text-sm font-semibold text-slate-600 w-28 shrink-0 pt-2">Note</label>
                <div className="flex-1">
                    <Controller
                        name="catatan_hidden"
                        control={control}
                        render={({ field }) => (
                            <div className={`rounded-md ${errors.catatan_hidden ? 'border border-red-500' : ''}`}>
                                <ReactQuill 
                                    theme="snow" 
                                    value={field.value} 
                                    onChange={field.onChange} 
                                    modules={modules}
                                    className="bg-white"
                                    style={{ height: '250px', marginBottom: '50px' }}
                                    readOnly={isEdit}
                                />
                            </div>
                        )}
                    />
                    {errors.catatan_hidden && <p className="mt-1 text-xs text-red-500">{errors.catatan_hidden.message}</p>}
                </div>
            </div>

            <div className="flex justify-center gap-4 mt-8">
                {(!isEdit) && (
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md font-medium transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Menyimpan...' : (initialData ? 'Update' : 'Simpan')}
                    </button>
                )}
                
                {isEdit && (
                    <button
                        type="button"
                        className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md font-medium transition-colors"
                        onClick={() => alert("Action is simulated in disabled mode")}
                    >
                        Edit Data (Enabled in Edit Mode)
                    </button>
                )}

                <button
                    type="button"
                    onClick={() => navigate('/logbookcustomers')}
                    className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md font-medium transition-colors"
                >
                    <i className="fa fa-undo mr-2"></i> Kembali
                </button>
            </div>
        </form>
    );
};
