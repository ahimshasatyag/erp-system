<?php

namespace App\Http\Resources\productunit;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductUnitResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id_product_satuan' => $this->id_product_satuan,
            'nm_product_satuan' => $this->nm_product_satuan,
            'date_create' => $this->date_create,
            'date_update' => $this->date_update,
        ];
    }
}
