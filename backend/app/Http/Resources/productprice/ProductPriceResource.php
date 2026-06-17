<?php

namespace App\Http\Resources\productprice;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Helpers\productprice\ProductPriceHelper;

class ProductPriceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $product_price_tampil = ProductPriceHelper::formatPrice($this->product_price);
        $product_price_agent_tampil = ProductPriceHelper::formatPrice($this->product_price_agent ?? 0);
        
        $kurs_bank_tampil = ProductPriceHelper::formatIDR($this->kurs_bank ?? 15000);
        $estimation_idr = ProductPriceHelper::calculateEstimationIDR($this->product_price, $this->kurs_bank ?? 15000);
        
        $is_new_price = ProductPriceHelper::isNewPrice($this->waktu ?? null);

        return [
            'id_product' => $this->id_product,
            'code_product' => $this->code_product,
            'nm_product' => $this->nm_product,
            'nm_product_brand' => $this->nm_product_brand ?? null,
            'product_price' => $this->product_price,
            'product_price_agent' => $this->product_price_agent ?? null,
            'product_price_tampil' => $product_price_tampil,
            'product_price_agent_tampil' => $product_price_agent_tampil,
            'kurs_bank' => $this->kurs_bank ?? 15000,
            'kurs_bank_tampil' => $kurs_bank_tampil,
            'estimation_idr' => $estimation_idr,
            'waktu' => $this->waktu ?? null,
            'is_new_price' => $is_new_price,
            'aksi' => $this->aksi ?? '',
            'flag_active' => $this->flag_active,
            'delivery_term' => $this->delivery_term ?? null,
            'product_deskripsi' => $this->product_deskripsi ?? null,
        ];
    }
}
