<?php

namespace App\Models\po;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IncomingDtl extends Model
{
    use HasFactory;

    protected $table = 'tb_incoming_dtl';
    protected $primaryKey = 'id_incoming_dtl';

    public $timestamps = false;

    protected $fillable = [
        'incoming_hdr_id',
        'id_product',
        'qty',
        'status'
    ];

    public function header()
    {
        return $this->belongsTo(IncomingHdr::class, 'incoming_hdr_id', 'id_incoming');
    }
}
