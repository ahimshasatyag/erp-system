<?php

namespace App\Http\Requests\quotationsap;

use Illuminate\Foundation\Http\FormRequest;

class UpdateQuotationApRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'id_po' => 'required|integer|exists:tb_po_hdr,id_po',
            'code_po' => 'required|string',
            'id_suppliers' => 'required|integer',
            'nm_suppliers' => 'nullable|string',
            'id_gudang' => 'required|integer',
            'mata_uang' => 'nullable|integer',
            'date_po' => 'required|date',
            'date_schdl' => 'nullable|date',
            'partner_ref' => 'nullable|string',
            'notes' => 'nullable|string',
            'id_product_lokasi' => 'required|integer',
            'link_file' => 'nullable|file|mimes:pdf,docx,doc,jpg,png,jpeg|max:2048',
            
            'details' => 'array',
            'details.*.id_po_dtl' => 'nullable|integer',
            'details.*.id_product' => 'required|integer',
            'details.*.code_product' => 'nullable|string',
            'details.*.nm_product' => 'nullable|string',
            'details.*.product_deskripsi' => 'nullable|string',
            'details.*.qty' => 'required|numeric|min:0',
            'details.*.product_price' => 'required|numeric|min:0',
            'details.*.notes' => 'nullable|string',
            
            'details.*.options' => 'array',
            'details.*.options.*.nm_product_opt' => 'required|string',
            'details.*.options.*.harga' => 'required|numeric|min:0',
            'details.*.options.*.id_po' => 'nullable|integer',
            'details.*.options.*.checked' => 'nullable|boolean', // Front-end might send this
        ];
    }
}
