<?php

namespace App\Http\Requests\customers;

use Illuminate\Foundation\Http\FormRequest;

class StoreCustomerRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'nm_customers' => 'required|string|max:255',
            'customers_address' => 'required|string',
            'customers_address_invoice' => 'required|string',
            'customers_phone' => 'nullable|string|max:50',
            'customers_mobile' => 'nullable|string|max:50',
            'customers_email' => 'nullable|email|max:100',
            'customers_fax' => 'nullable|string|max:50',
            'provinsi' => 'required|string',
            'kabupaten' => 'required|string',
            'f_company' => 'nullable|boolean',
            'nama_lengkap' => 'nullable|string|max:255',
            'nik' => 'nullable|string|max:50',
            'nib' => 'nullable|string|max:50',
            'npwp' => 'nullable|string|max:50',
            'alamat' => 'nullable|string',
            'is_blacklist' => 'nullable|boolean',
            'is_external_sales' => 'nullable|boolean',
            'contacts' => 'nullable|array',
            'contacts.*.nm_customers_contact' => 'required|string|max:255',
            'contacts.*.customers_contact_posisi' => 'nullable|string|max:100',
            'contacts.*.customers_contact_phone' => 'nullable|string|max:50',
            'contacts.*.customers_contact_email' => 'nullable|email|max:100',
        ];
    }
}
