<?php

namespace App\Models\customers;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerContact extends Model
{
    use HasFactory;

    protected $table = 'm_customers_contact';
    // m_customers_contact may not have a primary key or it might be id_customers, we assume no incrementing PK for Eloquent updates
    protected $primaryKey = null;
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'id_customers',
        'nm_customers_contact',
        'customers_contact_posisi',
        'customers_contact_phone',
        'customers_contact_email',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'id_customers', 'id_customers');
    }
}
