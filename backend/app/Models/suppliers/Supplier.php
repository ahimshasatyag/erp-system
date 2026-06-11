<?php

namespace App\Models\suppliers;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    use HasFactory;

    protected $table = 'm_suppliers';
    protected $primaryKey = 'id_suppliers';
    public $incrementing = false;
    protected $keyType = 'string';

    const CREATED_AT = 'date_create';
    const UPDATED_AT = 'date_update';

    protected $fillable = [
        'id_suppliers',
        'nm_suppliers',
        'suppliers_mobile',
        'suppliers_email',
        'suppliers_address',
        'suppliers_phone',
        'suppliers_fax',
        'suppliers_website',
        'suppliers_logo',
        'id_mata_uang',
        'date_create',
        'date_update',
    ];

    public function contacts()
    {
        return $this->hasMany(SupplierContact::class, 'id_suppliers', 'id_suppliers');
    }
}
