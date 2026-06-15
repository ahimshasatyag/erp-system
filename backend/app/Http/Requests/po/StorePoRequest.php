<?php

namespace App\Http\Requests\po;

use Illuminate\Foundation\Http\FormRequest;

class StorePoRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'date_po' => 'required|date',
            'date_schdl' => 'nullable|date',
            'id_suppliers' => 'required|integer',
            'partner_ref' => 'nullable|string|max:255',
            'mata_uang' => 'required|integer',
            'id_gudang' => 'required|integer',
            'id_product_lokasi' => 'nullable|integer',
            'notes' => 'nullable|string',
            'file' => 'nullable|file|max:5120',
            'details' => 'required|array|min:1',
            'details.*.id_product' => 'required|integer',
            'details.*.code_product' => 'nullable|string',
            'details.*.nm_product' => 'nullable|string',
            'details.*.product_deskripsi' => 'nullable|string',
            'details.*.qty' => 'required|numeric|min:1',
            'details.*.product_price' => 'required|numeric|min:0',
            'details.*.notes' => 'nullable|string',
        ];
    }
}
