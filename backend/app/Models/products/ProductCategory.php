<?php

namespace App\Models\products;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductCategory extends Model
{
    use HasFactory;

    protected $table = 'm_product_kategori';
    protected $primaryKey = 'id_product_kategori';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false; // Add custom timestamp handling if needed

    protected $fillable = [
        'id_product_kategori',
        'nm_product_kategori',
    ];

    public function subCategories()
    {
        return $this->hasMany(ProductSubCategory::class, 'id_product_kategori', 'id_product_kategori');
    }
}
