<?php

namespace App\Models\productprice;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductPriceHistory extends Model
{
    use HasFactory;

    protected $table = 'm_product_price_history';
    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
        'id_product',
        'product_price',
        'status',
        'waktu',
        'username'
    ];

    public function productPrice()
    {
        return $this->belongsTo(ProductPrice::class, 'id_product', 'id_product');
    }
}
