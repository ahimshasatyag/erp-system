<?php

namespace App\Models\productprice;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\products\Product;

class ProductPriceReq extends Model
{
    use HasFactory;

    protected $table = 'm_product_price_req';
    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
        'id_product',
        'username',
        'f_kirim',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'id_product', 'id_product');
    }
}
