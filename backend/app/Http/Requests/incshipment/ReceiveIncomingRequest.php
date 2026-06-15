<?php

namespace App\Http\Requests\incshipment;

use Illuminate\Foundation\Http\FormRequest;

class ReceiveIncomingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'data_barang' => 'nullable|array',
            'data_barang.*.id_dtl' => 'required_with:data_barang|integer|exists:tb_incoming_dtl,id'
        ];
    }
}
