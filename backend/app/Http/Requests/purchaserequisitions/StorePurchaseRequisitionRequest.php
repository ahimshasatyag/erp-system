<?php

namespace App\Http\Requests\purchaserequisitions;

use Illuminate\Foundation\Http\FormRequest;

class StorePurchaseRequisitionRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'username' => 'required|string|max:255',
            'date_request' => 'required|date',
            'date_deadline' => 'required|date',
            'details' => 'nullable|array',
            'details.*.id_product' => 'required|string',
            'details.*.qty' => 'required|numeric|min:1',
            'details.*.note' => 'nullable|string',
        ];
    }
}
