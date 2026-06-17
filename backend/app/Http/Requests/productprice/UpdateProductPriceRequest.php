<?php

namespace App\Http\Requests\productprice;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductPriceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id_product' => 'required|string',
            'product_price' => 'required',
            'product_price_agent' => 'nullable',
            'kurs_bank' => 'required',
            'delivery_term' => 'nullable|string',
            'options' => 'nullable|array',
            'options.*.id_product_price_opt' => 'required|integer',
            'options.*.amount' => 'required',
        ];
    }
}
