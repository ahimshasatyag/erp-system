<?php

namespace App\Http\Resources\productpricemkt;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductPriceMktResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return (array) $this->resource;
    }
}
