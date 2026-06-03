<?php

namespace App\Http\Requests\logbookcustomers;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLogBookCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Handled by Controller middleware
    }

    public function rules(): array
    {
        return [
            'id_log_book' => 'required|string',
            'id_customers' => 'required|string',
            'date_log_book' => 'required|date',
            'masalah_hidden' => 'nullable|string',
            'solusi_hidden' => 'nullable|string',
            'catatan_hidden' => 'nullable|string',
        ];
    }
}
