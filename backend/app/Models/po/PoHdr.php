<?php

namespace App\Models\po;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PoHdr extends Model
{
    use HasFactory;

    protected $table = 'tb_po_hdr';
    protected $primaryKey = 'id_po';

    public $timestamps = false; 

    protected $fillable = [
        'code_po',
        'date_po',
        'status_po',
        'date_schdl',
        'id_suppliers',
        'nm_suppliers',
        'id_gudang',
        'id_mata_uang',
        'id_product_lokasi',
        'partner_ref',
        'link_file',
        'notes',
        'date_create',
        'date_update'
    ];

    public function details()
    {
        return $this->hasMany(PoDtl::class, 'id_po', 'id_po');
    }

    public function incoming()
    {
        return $this->hasMany(IncomingHdr::class, 'id_po', 'id_po');
    }
}
