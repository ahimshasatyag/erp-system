<?php

namespace App\Http\Requests\products;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     * Assuming Policy handles auth at controller level, we return true here.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'code_product' => 'required|string|unique:m_product,code_product',
            'nm_product' => 'nullable|string',
            'id_product_kategori' => 'nullable|string',
            'id_product_sub_kategori' => 'nullable|string',
            'id_product_satuan' => 'nullable|string',
            'id_product_brand' => 'nullable|string',
            'product_deskripsi' => 'nullable|string',
            'product_refference' => 'nullable|string',
            'link_brosur' => 'nullable|file|mimes:pdf',
            'link_foto' => 'nullable|file|mimes:png,jpg,jpeg,bmp',
            'jml' => 'nullable|integer',
            // Options are usually sent as an array in modern APIs, 
            // but we'll accept array of strings here.
            'options' => 'nullable|array',
            'options.*' => 'nullable|string',
        ];
    }
}
