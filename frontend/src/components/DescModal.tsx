import React, { useState, useEffect } from 'react';
import { showAlert } from './SweetAlert';

interface DescModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (desc: string) => void;
    title?: string;
    descriptionText?: string;
    placeholder?: string;
    cancelText?: string;
    confirmText?: string;
}

export default function DescModal({
    isOpen,
    onClose,
    onConfirm,
    title = 'Deskripsi Tambahan',
    placeholder = 'Tulis deskripsi...',
    descriptionText = 'Catatan ini akan ditambahkan ke dalam data CSR sebagai bukti pembatalan.',
    cancelText = 'Batal',
    confirmText = 'Simpan'
}: DescModalProps) {
    const [desc, setDesc] = useState('');

    // Reset description when modal closes or opens
    useEffect(() => {
        if (!isOpen) {
            setDesc('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm(desc);
    };

    // Close handler with a SweetAlert warning confirmation if the user has typed something
    const handleClose = () => {
        if (desc.trim()) {
            showAlert.confirm(
                'Batal Mengisi?',
                'Apakah Anda yakin ingin membatalkan? Deskripsi yang telah ditulis akan hilang.',
                () => {
                    onClose();
                },
                'Tidak',
                'Ya, Batal',
                'warning' // Pass 'warning' here for warning icon in SweetAlert!
            );
        } else {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop overlay */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={handleClose}
            />

            {/* Modal Container */}
            <div className="relative bg-white dark:bg-[#1e202b] border border-gray-200 dark:border-gray-800 max-w-md w-full rounded-xl shadow-2xl p-6 space-y-5 z-10 transform scale-100 transition-all duration-300 animate-in zoom-in-95 ease-out">

                {/* Close Button "X" (Absolute positioned at top right) */}
                <button
                    type="button"
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white text-xl font-bold bg-transparent border-0 cursor-pointer p-1 transition-colors leading-none outline-none focus:outline-none z-20"
                    aria-label="Close modal"
                >
                    &times;
                </button>

                {/* Header Section (Centered Title & Warning Icon below it) */}
                <div className="flex flex-col items-center justify-center text-center space-y-4 pt-2">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                        {title}
                    </h4>

                    {/* Exclamation Warning Icon below title */}
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/35 text-amber-500 dark:text-amber-400 rounded-full border border-amber-200 dark:border-amber-900/50 shadow-sm shrink-0">
                        <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                </div>

                {/* Input Section */}
                <div className="space-y-1.5 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed text-center">
                        {descriptionText}
                    </p>
                    <label className="text-[12px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block text-left">
                        Alasan Pembatalan
                    </label>
                    <textarea
                        rows={4}
                        placeholder={placeholder}
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-[#161821] text-gray-900 dark:text-white border border-gray-300 dark:border-gray-800 rounded-lg px-4 py-3 text-sm text-left focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-600 resize-none"
                    />
                </div>

                {/* Action Buttons Section */}
                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="bg-gray-100 dark:bg-[#161821] text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-5 py-2.5 rounded-lg text-xs font-bold border border-gray-200 dark:border-gray-800/40 hover:bg-gray-200 dark:hover:bg-[#232733] transition-all duration-200 cursor-pointer shadow-sm focus:outline-none"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        className="bg-rose-600 hover:bg-rose-500 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer shadow-md shadow-rose-950/10 hover:shadow-rose-950/20 active:scale-95 focus:outline-none"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
