<?php

namespace App\Models\csr;

use Illuminate\Database\Eloquent\Model;

class Mmaster extends Model
{
    protected $table = 'tb_afs_csr';
    protected $primaryKey = 'id_afs_csr';
    
    // As per DB schema, no standard created_at / updated_at
    public $timestamps = false;

    protected $guarded = [];

    // Optional eloquent relationships
    // public function customer()
    // {
    //     return $this->belongsTo(\App\Models\Customer::class, 'id_customers', 'id_customers');
    // }
}
