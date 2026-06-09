<?php

namespace App\Http\Requests\productunit;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductUnitRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'nm_product_satuan' => 'required|string|trim|max:255',
        ];
    }
}
