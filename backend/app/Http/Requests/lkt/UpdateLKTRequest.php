<?php

namespace App\Http\Requests\lkt;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLKTRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'starting_date'        => 'required|date',
            'description'          => 'required|string',
            'estimation_day'       => 'nullable|integer',
            'transport_amount'     => 'nullable|string',
            'actual_transport'     => 'required|string',
            'accommodation_amount' => 'nullable|string',
            'service_amount'       => 'nullable|string',
            'nm_teknisi'           => 'nullable|array',
            'link_foto'            => 'nullable|image|mimes:jpeg,png,jpg,bmp|max:5120',
        ];
    }
}
