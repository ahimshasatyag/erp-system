<?php

namespace App\Models\customers;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $table = 'm_customers';
    protected $primaryKey = 'id_customers';
    public $incrementing = false;
    protected $keyType = 'string';

    const CREATED_AT = 'date_create';
    const UPDATED_AT = 'date_update';

    protected $fillable = [
        'id_customers',
        'code_customers',
        'nm_customers',
        'customers_address',
        'customers_phone',
        'customers_mobile',
        'customers_email',
        'customers_fax',
        'f_company',
        'nama_lengkap',
        'nik',
        'nib',
        'npwp',
        'alamat',
        'customers_address_invoice',
        'provinsi',
        'kabupaten',
        'is_blacklist',
        'is_external_sales',
        'date_create',
        'date_update',
    ];

    public function contacts()
    {
        return $this->hasMany(CustomerContact::class, 'id_customers', 'id_customers');
    }
}
