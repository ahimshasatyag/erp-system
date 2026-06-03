<?php

namespace App\Http\Requests\logbookproduct;

use Illuminate\Foundation\Http\FormRequest;

class StoreLogBookProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Authorization is handled by policies in the controller
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'id_product' => ['required', 'integer', 'exists:m_product,id_product'],
            'id_type_kerusakan' => ['required', 'integer', 'exists:m_type_kerusakan,id_type_kerusakan'],
            'date_log_book' => ['required', 'date'],
            'masalah' => ['nullable', 'string'],
            'solusi' => ['nullable', 'string'],
            'catatan' => ['nullable', 'string'],
        ];
    }
}
