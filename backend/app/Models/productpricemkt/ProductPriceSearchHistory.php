<?php

namespace App\Models\productpricemkt;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductPriceSearchHistory extends Model
{
    use HasFactory;

    protected $table = 'm_product_price_history_search';
    
    // Disable updated_at since it seems to only insert date_create
    const CREATED_AT = 'date_create';
    const UPDATED_AT = null;

    protected $fillable = [
        'id_product',
        'username',
        'date_create'
    ];
}
