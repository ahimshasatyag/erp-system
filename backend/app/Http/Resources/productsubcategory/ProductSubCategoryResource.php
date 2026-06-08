<?php

namespace App\Http\Resources\productsubcategory;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductSubCategoryResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id_product_sub_kategori' => $this->id_product_sub_kategori,
            'id_product_kategori' => $this->id_product_kategori,
            'nm_product_sub_kategori' => $this->nm_product_sub_kategori,
            'kode_product_sub_kategori' => $this->kode_product_sub_kategori,
            'type_kategori' => $this->type_kategori,
            'date_create' => $this->date_create,
            'date_update' => $this->date_update,
            // Include related category name if loaded
            'nm_product_kategori' => $this->whenLoaded('category', function () {
                return $this->category->nm_product_kategori;
            }),
        ];
    }
}
