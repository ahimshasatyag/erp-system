<?php

namespace App\Models\po;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IncomingHdr extends Model
{
    use HasFactory;

    protected $table = 'tb_incoming_hdr';
    protected $primaryKey = 'id_incoming';

    public $timestamps = false;

    protected $fillable = [
        'code',
        'id_po',
        'id_suppliers',
        'status_incoming',
        'date_create'
    ];

    public function details()
    {
        return $this->hasMany(IncomingDtl::class, 'incoming_hdr_id', 'id_incoming');
    }

    public function po()
    {
        return $this->belongsTo(PoHdr::class, 'id_po', 'id_po');
    }
}
