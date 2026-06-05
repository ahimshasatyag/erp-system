<?php

namespace App\Http\Resources\products;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id_product' => $this->id_product,
            'code_product' => $this->code_product,
            'nm_product' => $this->nm_product,
            'product_deskripsi' => $this->product_deskripsi,
            'product_refference' => $this->product_refference,
            'link_brosur' => $this->link_brosur ? url('storage/brosur/' . $this->link_brosur) : null,
            'link_foto' => $this->link_foto ? url('storage/upload/' . $this->link_foto) : null,
            'flag_active' => $this->flag_active,
            'category' => [
                'id' => $this->id_product_kategori,
                'name' => optional($this->category)->nm_product_kategori,
            ],
            'sub_category' => [
                'id' => $this->id_product_sub_kategori,
                'name' => optional($this->subCategory)->nm_product_sub_kategori,
            ],
            'unit' => [
                'id' => $this->id_product_satuan,
                'name' => optional($this->unit)->nm_product_satuan,
            ],
            'brand' => [
                'id' => $this->id_product_brand,
                'name' => optional($this->brand)->nm_product_brand,
            ],
            'options' => $this->options->map(function ($opt) {
                return [
                    'id_product_price_opt' => $opt->id_product_price_opt,
                    'nm_product_opt' => $opt->nm_product_opt,
                ];
            }),
            'date_create' => $this->date_create,
            'date_update' => $this->date_update,
        ];
    }
}
