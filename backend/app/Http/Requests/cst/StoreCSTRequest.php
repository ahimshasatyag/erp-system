<?php

namespace App\Http\Requests\cst;

use Illuminate\Foundation\Http\FormRequest;

class StoreCSTRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id_afs_csr' => 'required|integer',
            'cst_date' => 'nullable|date',
            'status' => 'nullable|string',
        ];
    }
}
