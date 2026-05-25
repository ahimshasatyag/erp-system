<?php

namespace App\Http\Requests\csr;

use Illuminate\Foundation\Http\FormRequest;

class StoreCSRRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'sn_number' => 'required|string',
            'id_product' => 'nullable|string',
            'sts_pasang' => 'required|string',
            'do_code' => 'nullable|string',
            'mesin_lama' => 'nullable|string',
            'id_customers' => 'nullable|string',
            'date_request' => 'nullable|date',
            'id_karyawan' => 'required|string',
            'lokasi' => 'required|string',
            'lap_kerusakan' => 'required|string',
            'warranty_time' => 'nullable|string',
            'warranty_start' => 'nullable|date',
            'warranty_end' => 'nullable|date',
            'tgl_delivered' => 'required|date',
            'customers' => 'required|string',
        ];
    }
}
