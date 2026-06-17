<?php

namespace App\Models\productpricemkt;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\products\Product;

class ProductPrice extends Model
{
    use HasFactory;

    protected $table = 'm_product_price';
    protected $primaryKey = 'id_product';

    public $incrementing = false;
    protected $keyType = 'string';

    const CREATED_AT = 'date_create';
    const UPDATED_AT = 'date_update';

    protected $fillable = [
        'id_product',
        'product_price',
        'product_price_agent',
        'kurs_bank',
        'delivery_term',
        'username',
        'date_create',
        'date_update',
        'flag_active'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'id_product', 'id_product');
    }

    public function options()
    {
        return $this->hasMany(\App\Models\products\ProductPriceOpt::class, 'id_product', 'id_product')->where('f_cancel', '0');
    }
}
