<?php

namespace App\Http\Requests\productunit;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductUnitRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'id_product_satuan' => 'required|string|max:255',
            'nm_product_satuan' => 'required|string|trim|max:255',
        ];
    }
}
