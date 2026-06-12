<?php

namespace App\Http\Requests\purchaserequisitions;

use Illuminate\Foundation\Http\FormRequest;

class GeneratePoRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'data_id_pr_dtl' => 'required|array|min:1',
            'data_id_pr_dtl.*.id_product' => 'required|string',
            'data_id_pr_dtl.*.id_pr_dtl' => 'required|integer',
            'data_id_pr_dtl.*.qty_po' => 'required|numeric|min:0',
        ];
    }
}
