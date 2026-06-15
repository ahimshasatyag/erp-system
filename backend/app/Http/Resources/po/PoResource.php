<?php

namespace App\Http\Resources\po;

use Illuminate\Http\Resources\Json\JsonResource;

class PoResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id_po' => $this->id_po,
            'code_po' => $this->code_po,
            'date_po' => $this->date_po,
            'status_po' => $this->status_po,
            'date_schdl' => $this->date_schdl ?? null,
            'id_suppliers' => $this->id_suppliers ?? null,
            'nm_suppliers' => $this->nm_suppliers ?? null,
            'id_gudang' => $this->id_gudang ?? null,
            'id_mata_uang' => $this->id_mata_uang ?? null,
            'id_product_lokasi' => $this->id_product_lokasi ?? null,
            'notes' => $this->notes ?? null,
            'date_create' => $this->date_create ?? null,
            'date_update' => $this->date_update ?? null,
            
            // Relasi (jika di-load)
            'details' => $this->details ?? null,
            
            // Data tambahan dari JOIN (jika ada)
            'nm_gudang' => $this->nm_gudang ?? null,
            'mata_uang' => $this->mata_uang ?? null,
            'nm_product_lokasi' => $this->nm_product_lokasi ?? null,
        ];
    }
}
