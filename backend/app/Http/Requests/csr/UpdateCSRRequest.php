<?php

namespace App\Http\Requests\csr;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCSRRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'csr_code' => 'required|string',
            'customers' => 'nullable|string',
            'sts_pasang' => 'nullable|string',
            'csr_date' => 'nullable|date',
            'id_karyawan' => 'nullable|string',
            'lokasi' => 'required|string',
            'lap_kerusakan' => 'required|string',
        ];
    }
}
