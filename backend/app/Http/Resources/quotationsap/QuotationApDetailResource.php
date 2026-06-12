<?php

namespace App\Http\Resources\quotationsap;

use Illuminate\Http\Resources\Json\JsonResource;

class QuotationApDetailResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id_po_dtl' => $this->id_po_dtl,
            'id_po' => $this->id_po,
            'id_product' => $this->id_product,
            'code_product' => $this->code_product,
            'nm_product' => $this->nm_product,
            'product_deskripsi' => $this->product_deskripsi,
            'qty' => $this->qty,
            'product_price' => $this->product_price,
            'notes' => $this->notes,
            
            // Appended relations if any
            'options' => $this->whenLoaded('options'),
        ];
    }
}
