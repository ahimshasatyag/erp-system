<?php

namespace App\Models\productcategory;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductCategory extends Model
{
    use HasFactory;

    protected $table = 'm_product_kategori';
    protected $primaryKey = 'id_product_kategori';
    
    public $incrementing = false;
    protected $keyType = 'string';
    
    const CREATED_AT = 'date_create';
    const UPDATED_AT = 'date_update';

    protected $fillable = [
        'id_product_kategori',
        'kode_product_kategori',
        'nm_product_kategori',
        'date_create',
        'date_update'
    ];
}
