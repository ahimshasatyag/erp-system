import type { LogBookProduct } from '../api/logBookProductApi';

export interface ValidationErrors {
    id_product?: string;
    id_type_kerusakan?: string;
    date_log_book?: string;
    masalah?: string;
    solusi?: string;
    catatan?: string;
}

export const validateLogBookProduct = (data: LogBookProduct): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!data.id_product) {
        errors.id_product = 'Product is required';
    }

    if (!data.id_type_kerusakan) {
        errors.id_type_kerusakan = 'Type Kerusakan is required';
    }

    if (!data.date_log_book) {
        errors.date_log_book = 'Date is required';
    }

    if (!data.masalah || data.masalah.trim().length === 0) {
        errors.masalah = 'Masalah (Problem) is required';
    }

    if (!data.solusi || data.solusi.trim().length === 0) {
        errors.solusi = 'Solusi (Solution) is required';
    }

    if (!data.catatan || data.catatan.trim().length === 0) {
        errors.catatan = 'Catatan (Note) is required';
    }

    return errors;
};
