<?php

namespace App\Http\Resources\incshipment;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IncomingDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        return [
            'id_dtl' => $this->id,
            'id_product' => $this->id_product,
            'code_product' => $this->product ? $this->product->code_product : null,
            'nm_product' => $this->product ? $this->product->nm_product : null,
            'nm_product_satuan' => $this->product && $this->product->satuan ? $this->product->satuan->nm_product_satuan : null,
            'qty' => $this->qty,
            'sn' => $this->sn,
            'status' => $this->status,
            'qty_terima' => $this->qty_terima,
            'id_product_lokasi_source' => $this->id_product_lokasi_source,
            'lokasi_source' => clone $this->id_product_lokasi_source, // Actually we need to fetch name, but backend handles join in getById. If we use relationships we can do:
            // 'lokasi_source' => $this->lokasiSource ? $this->lokasiSource->complete_name : null,
            // Let's just return the attributes and we will add relations later if needed.
            // Or we can just return parent::toArray for now if we use raw queries like in Mmaster.
            // But let's map it cleanly.
        ];
    }
}
