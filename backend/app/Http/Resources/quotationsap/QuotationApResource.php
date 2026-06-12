<?php

namespace App\Http\Resources\quotationsap;

use Illuminate\Http\Resources\Json\JsonResource;

class QuotationApResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id_po' => $this->id_po,
            'code_po' => $this->code_po,
            'code_quotation' => $this->code_quotation,
            'date_po' => $this->date_po,
            'status_po' => $this->status_po,
            'date_schdl' => $this->date_schdl,
            'id_suppliers' => $this->id_suppliers,
            'nm_suppliers' => $this->nm_suppliers,
            'id_gudang' => $this->id_gudang,
            'id_mata_uang' => $this->id_mata_uang,
            'partner_ref' => $this->partner_ref,
            'notes' => $this->notes,
            'amount_total' => $this->amount_total,
            'id_product_lokasi' => $this->id_product_lokasi,
            'link_file' => $this->link_file ? url('assets/upload/' . $this->link_file) : null,
            'date_create' => $this->date_create,
            
            // Loaded relations
            'details' => QuotationApDetailResource::collection($this->whenLoaded('details')),
        ];
    }
}
