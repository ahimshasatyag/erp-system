<?php

namespace App\Models\incshipment;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IncomingHdr extends Model
{
    use HasFactory;

    protected $table = 'tb_incoming_hdr';
    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
        'code',
        'id_po',
        'id_suppliers',
        'date_receive',
        'status_incoming',
        'date_create',
        'date_update',
        'f_assign_barcode',
        'f_print_barcode',
        'f_ok_receive'
    ];

    public function details()
    {
        return $this->hasMany(IncomingDtl::class, 'incoming_hdr_id', 'id');
    }

    public function po()
    {
        return $this->belongsTo(\App\Models\po\PoHdr::class, 'id_po', 'id_po');
    }
}
