<?php

namespace App\Http\Requests\productprice;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductPriceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'items' => 'required|array',
            'items.*.id_product' => 'required|string',
            'items.*.product_price' => 'required',
            'items.*.product_price_agent' => 'nullable',
            'items.*.kurs_bank' => 'required',
            'items.*.delivery_term' => 'nullable|string',
        ];
    }
}
