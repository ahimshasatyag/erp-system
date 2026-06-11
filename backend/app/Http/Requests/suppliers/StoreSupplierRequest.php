<?php

namespace App\Http\Requests\suppliers;

use Illuminate\Foundation\Http\FormRequest;

class StoreSupplierRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'nm_suppliers' => 'required|string|max:255',
            'suppliers_mobile' => 'nullable|string|max:255',
            'suppliers_email' => 'nullable|email|max:255',
            'suppliers_address' => 'nullable|string',
            'suppliers_phone' => 'nullable|string|max:255',
            'suppliers_fax' => 'nullable|string|max:255',
            'suppliers_website' => 'nullable|string|max:255',
            'id_mata_uang' => 'nullable|string|max:255',
            'file' => 'nullable|image|mimes:png,gif,jpg,jpeg|max:2048',
            
            'contacts' => 'nullable|array',
            'contacts.*.nm_suppliers_contact' => 'nullable|string|max:255',
            'contacts.*.suppliers_contact_posisi' => 'nullable|string|max:255',
            'contacts.*.suppliers_contact_phone' => 'nullable|string|max:255',
            'contacts.*.suppliers_contact_email' => 'nullable|email|max:255',
        ];
    }
}
