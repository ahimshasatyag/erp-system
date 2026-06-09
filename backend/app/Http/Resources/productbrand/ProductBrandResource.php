<?php

namespace App\Http\Resources\productbrand;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductBrandResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id_product_brand' => $this->id_product_brand,
            'nm_product_brand' => $this->nm_product_brand,
            'date_create' => $this->date_create,
            'date_update' => $this->date_update,
        ];
    }
}
