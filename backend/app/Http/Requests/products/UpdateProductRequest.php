<?php

namespace App\Http\Requests\products;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
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
        $id = $this->route('product') ?: $this->input('id_product');

        return [
            'id_product' => 'required|string',
            'code_product' => [
                'required',
                'string',
                Rule::unique('m_product', 'code_product')->ignore($id, 'id_product')
            ],
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
            'options' => 'nullable|array',
            'options.*' => 'nullable|string',
        ];
    }
}
