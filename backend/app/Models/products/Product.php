<?php

namespace App\Models\products;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $table = 'm_product';
    protected $primaryKey = 'id_product';
    public $timestamps = false;

    protected $fillable = [
        'code_product',
        'nm_product',
    ];
}
