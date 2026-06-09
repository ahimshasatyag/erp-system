<?php

namespace App\Models\products;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\productcategory\ProductCategory;
use App\Models\productsubcategory\ProductSubCategory;
use App\Models\productunit\ProductUnit;
use App\Models\productbrand\ProductBrand;

class Product extends Model
{
    use HasFactory;

    protected $table = 'm_product';
    protected $primaryKey = 'id_product';

    public $incrementing = false;
    protected $keyType = 'string';

    const CREATED_AT = 'date_create';
    const UPDATED_AT = 'date_update';

    protected $fillable = [
        'id_product',
        'code_product',
        'nm_product',
        'product_deskripsi',
        'id_product_kategori',
        'id_product_sub_kategori',
        'id_product_satuan',
        'id_product_brand',
        'product_refference',
        'link_brosur',
        'link_foto',
        'flag_active',
        'date_create',
        'date_update'
    ];

    public function category()
    {
        return $this->belongsTo(ProductCategory::class, 'id_product_kategori', 'id_product_kategori');
    }

    public function subCategory()
    {
        return $this->belongsTo(ProductSubCategory::class, 'id_product_sub_kategori', 'id_product_sub_kategori');
    }

    public function unit()
    {
        return $this->belongsTo(ProductUnit::class, 'id_product_satuan', 'id_product_satuan');
    }

    public function brand()
    {
        return $this->belongsTo(ProductBrand::class, 'id_product_brand', 'id_product_brand');
    }

    public function options()
    {
        return $this->hasMany(ProductPriceOpt::class, 'id_product', 'id_product')->where('f_cancel', '0');
    }
}
