<?php

namespace App\Http\Resources\cekserialnumber;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CekSerialNumberResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'barcode' => $this->barcode,
            'code_product' => $this->code_product,
            'nm_product' => $this->nm_product,
            'nm_customers' => $this->nm_customers,
        ];
    }
}
