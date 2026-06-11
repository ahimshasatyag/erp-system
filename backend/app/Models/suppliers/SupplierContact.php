<?php

namespace App\Models\suppliers;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupplierContact extends Model
{
    use HasFactory;

    protected $table = 'm_suppliers_contact';
    protected $primaryKey = null;
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'id_suppliers',
        'nm_suppliers_contact',
        'suppliers_contact_posisi',
        'suppliers_contact_phone',
        'suppliers_contact_email',
    ];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'id_suppliers', 'id_suppliers');
    }
}
