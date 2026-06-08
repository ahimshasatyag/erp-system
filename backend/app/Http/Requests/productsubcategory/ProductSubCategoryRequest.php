<?php

namespace App\Http\Requests\productsubcategory;

use Illuminate\Foundation\Http\FormRequest;

class ProductSubCategoryRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'id_product_kategori' => 'required|string',
            'nm_product_sub_kategori' => 'required|string|max:255',
            'type_kategori' => 'nullable|string',
        ];
    }
}
