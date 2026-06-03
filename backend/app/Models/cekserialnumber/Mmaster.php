<?php

namespace App\Models\cekserialnumber;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mmaster extends Model
{
    use HasFactory;

    protected $table = 'tb_afs_csr';
    protected $primaryKey = 'id_afs_csr';
    public $timestamps = false;
    
    // This model acts as the base entry point for Cek Serial Number logic
    // and is primarily used for authorization via CekSerialNumberPolicy.
}
