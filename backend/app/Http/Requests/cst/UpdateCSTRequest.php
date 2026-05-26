<?php

namespace App\Http\Requests\cst;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCSTRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'cst_code' => 'required|string',
            'cst_date' => 'nullable|date',
            'status' => 'nullable|string',
        ];
    }
}
