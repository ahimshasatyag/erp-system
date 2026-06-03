import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import type { LogBookProduct } from '../api/logBookProductApi';
import type { ValidationErrors } from '../validation/logBookProductSchema';
import SearchablePaginatedSelect from '../../../components/SearchablePaginatedSelect';

interface LogBookProductFormProps {
    formData: LogBookProduct;
    errors: ValidationErrors;
    isSubmitting: boolean;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | { target: { name: string; value: string } }) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
}

export const LogBookProductForm: React.FC<LogBookProductFormProps> = ({
    formData,
    errors,
    isSubmitting,
    handleChange,
    onSubmit,
    onCancel
}) => {
    
    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'align': [] }],
            ['link', 'image'],
            ['clean']
        ]
    };

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            
            {/* Top Row: Product Name, Type Kerusakan, Date */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8 pb-4">
                
                {/* Product Select */}
                <div className="flex items-center gap-4 flex-1">
                    <label className="text-sm font-semibold text-slate-600 w-28 shrink-0">Product Name</label>
                    <div className="flex-1">
                        <SearchablePaginatedSelect
                            value={formData.id_product || ''}
                            onChange={(val) => handleChange({ target: { name: 'id_product', value: String(val) } })}
                            options={[
                                { value: "1", label: "QZYK-130C - Program-control Paper Cutter" },
                                { value: "2", label: "Product B" }
                            ]}
                            placeholder="Select Product Name"
                            error={errors.id_product}
                        />
                    </div>
                </div>

                {/* Type Kerusakan Select */}
                <div className="flex items-center gap-4 flex-1">
                    <label className="text-sm font-semibold text-slate-600 w-32 shrink-0">Type Kerusakan</label>
                    <div className="flex-1">
                        <select 
                            className={`w-full rounded border text-sm px-3 py-2 outline-none transition-colors ${
                                errors.id_type_kerusakan 
                                    ? 'border-red-500 focus:border-red-500' 
                                    : 'border-slate-300 focus:border-blue-500'
                            }`}
                            name="id_type_kerusakan" 
                            value={formData.id_type_kerusakan} 
                            onChange={handleChange as any}
                        >
                            <option value="">Select Type Kerusakan</option>
                            <option value="1">Hardware Issue</option>
                            <option value="2">Software Bug</option>
                        </select>
                        {errors.id_type_kerusakan && <p className="mt-1 text-xs text-red-500">{errors.id_type_kerusakan}</p>}
                    </div>
                </div>

                {/* Date Input */}
                <div className="flex items-center gap-4">
                    <label className="text-sm font-semibold text-slate-600 shrink-0">Date</label>
                    <div>
                        <input 
                            className={`w-36 rounded border text-sm px-3 py-2 outline-none transition-colors ${
                                errors.date_log_book 
                                    ? 'border-red-500 focus:border-red-500' 
                                    : 'border-slate-300 focus:border-blue-500'
                            }`}
                            type="date" 
                            name="date_log_book" 
                            value={formData.date_log_book} 
                            onChange={handleChange as any} 
                        />
                        {errors.date_log_book && <p className="mt-1 text-xs text-red-500">{errors.date_log_book}</p>}
                    </div>
                </div>
            </div>

            {/* Problem Rich Text Editor */}
            <div className="flex flex-col lg:flex-row gap-4 border-t border-slate-200 pt-6">
                <label className="text-sm font-semibold text-slate-600 w-28 shrink-0 pt-2">Problem</label>
                <div className="flex-1">
                    <ReactQuill 
                        theme="snow" 
                        modules={modules}
                        value={formData.masalah} 
                        onChange={(content) => handleChange({ target: { name: 'masalah', value: content } })}
                        className={`bg-white ${errors.masalah ? 'border border-red-500 rounded' : ''}`}
                        style={{ height: '250px', marginBottom: '50px' }}
                    />
                    {errors.masalah && <p className="mt-1 text-xs text-red-500">{errors.masalah}</p>}
                </div>
            </div>

            {/* Solution Rich Text Editor */}
            <div className="flex flex-col lg:flex-row gap-4">
                <label className="text-sm font-semibold text-slate-600 w-28 shrink-0 pt-2">Solution</label>
                <div className="flex-1">
                    <ReactQuill 
                        theme="snow" 
                        modules={modules}
                        value={formData.solusi} 
                        onChange={(content) => handleChange({ target: { name: 'solusi', value: content } })}
                        className={`bg-white ${errors.solusi ? 'border border-red-500 rounded' : ''}`}
                        style={{ height: '250px', marginBottom: '50px' }}
                    />
                    {errors.solusi && <p className="mt-1 text-xs text-red-500">{errors.solusi}</p>}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-3 pt-8 mt-12">
                <button 
                    type="submit" 
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                    disabled={isSubmitting}
                >
                    <i className="fa fa-save"></i>
                    {isSubmitting ? 'Saving...' : 'Simpan'}
                </button>
                <button 
                    type="button" 
                    className="flex items-center gap-2 bg-slate-500 hover:bg-slate-600 text-white px-8 py-2.5 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    <i className="fa fa-undo"></i>
                    Kembali
                </button>
            </div>
        </form>
    );
};
