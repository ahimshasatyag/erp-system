<?php

namespace App\Models\productunit;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductUnit extends Model
{
    use HasFactory;

    protected $table = 'm_product_satuan';
    protected $primaryKey = 'id_product_satuan';
    public $incrementing = false;
    protected $keyType = 'string';
    
    const CREATED_AT = 'date_create';
    const UPDATED_AT = 'date_update';

    protected $fillable = [
        'id_product_satuan',
        'nm_product_satuan',
        'date_create',
        'date_update'
    ];
}
