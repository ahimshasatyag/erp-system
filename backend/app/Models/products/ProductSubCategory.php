<?php

namespace App\Models\products;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductSubCategory extends Model
{
    use HasFactory;

    protected $table = 'm_product_sub_kategori';
    protected $primaryKey = 'id_product_sub_kategori';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'id_product_sub_kategori',
        'id_product_kategori',
        'nm_product_sub_kategori',
    ];

    public function category()
    {
        return $this->belongsTo(ProductCategory::class, 'id_product_kategori', 'id_product_kategori');
    }
}
