<?php

namespace App\Models\cst;

use Illuminate\Database\Eloquent\Model;

class Mmaster extends Model
{
    protected $table = 'tb_afs_cst';
    protected $primaryKey = 'id_afs_cst';
    
    // No created_at / updated_at standard columns on tb_afs_cst
    public $timestamps = false;

    protected $guarded = [];
}
