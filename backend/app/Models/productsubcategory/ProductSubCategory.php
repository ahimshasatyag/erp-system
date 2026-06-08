<?php

namespace App\Models\productsubcategory;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\productcategory\ProductCategory;

class ProductSubCategory extends Model
{
    use HasFactory;

    protected $table = 'm_product_sub_kategori';
    protected $primaryKey = 'id_product_sub_kategori';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false; // We use custom names

    const CREATED_AT = 'date_create';
    const UPDATED_AT = 'date_update';

    protected $fillable = [
        'id_product_sub_kategori',
        'id_product_kategori',
        'nm_product_sub_kategori',
        'kode_product_sub_kategori',
        'type_kategori',
        'date_create',
        'date_update',
    ];

    public function category()
    {
        return $this->belongsTo(ProductCategory::class, 'id_product_kategori', 'id_product_kategori');
    }
}
