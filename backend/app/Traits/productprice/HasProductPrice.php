<?php

namespace App\Traits\productprice;

use App\Models\productprice\ProductPrice;

trait HasProductPrice
{
    public function productPrice()
    {
        return $this->hasOne(ProductPrice::class, 'id_product', 'id_product');
    }
}
