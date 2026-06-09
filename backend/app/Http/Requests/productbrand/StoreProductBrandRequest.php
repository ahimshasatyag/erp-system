<?php

namespace App\Http\Requests\productbrand;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductBrandRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'nm_product_brand' => 'required|string|max:255',
        ];
    }
}
