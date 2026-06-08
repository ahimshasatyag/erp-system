<?php

namespace App\Http\Requests\productcategory;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductCategoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true; // Use policy in controller
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'id_product_kategori' => 'required|string|trim',
            'nm_product_kategori' => 'required|string|trim|max:255',
        ];
    }
}
