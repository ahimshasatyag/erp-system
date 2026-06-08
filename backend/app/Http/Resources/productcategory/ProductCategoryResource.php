<?php

namespace App\Http\Resources\productcategory;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductCategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id_product_kategori' => $this->id_product_kategori,
            'kode_product_kategori' => $this->kode_product_kategori,
            'nm_product_kategori' => $this->nm_product_kategori,
            'date_create' => $this->date_create,
            'date_update' => $this->date_update,
        ];
    }
}
