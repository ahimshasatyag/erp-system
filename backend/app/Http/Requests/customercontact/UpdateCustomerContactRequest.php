<?php

namespace App\Http\Requests\customercontact;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomerContactRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'nm_customers_contact' => 'required|string|max:255',
            'id_customers' => 'required|integer',
            'customers_contact_posisi' => 'nullable|string|max:255',
            'customers_contact_phone' => 'nullable|string|max:50',
            'customers_contact_mobile' => 'nullable|string|max:50',
            'customers_contact_email' => 'nullable|email|max:255',
            'customers_contact_address' => 'nullable|string',
        ];
    }
}
