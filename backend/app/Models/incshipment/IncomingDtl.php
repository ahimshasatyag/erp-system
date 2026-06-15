<?php

namespace App\Models\incshipment;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IncomingDtl extends Model
{
    use HasFactory;

    protected $table = 'tb_incoming_dtl';
    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
        'incoming_hdr_id',
        'id_product',
        'qty',
        'sn',
        'status',
        'qty_terima',
        'id_product_lokasi_source',
        'id_product_lokasi_destination'
    ];

    public function header()
    {
        return $this->belongsTo(IncomingHdr::class, 'incoming_hdr_id', 'id');
    }

    public function product()
    {
        return $this->belongsTo(\App\Models\product\Product::class, 'id_product', 'id_product');
    }
}
