<?php

namespace App\Models\lkt;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\cst\Mmaster as CstModel;

class Mmaster extends Model
{
    protected $table = 'tb_afs_lkt';
    protected $primaryKey = 'id_afs_lkt';
    public $timestamps = false; // Legacy DB has no timestamps columns

    protected $fillable = [
        'lkt_code',
        'id_afs_cst',
        'starting_date',
        'estimation_day',
        'service_amount',
        'transport_amount',
        'accommodation_amount',
        'description',
        'tot_detail_amount',
        'flag_done',
        'image',
        'actual_transport',
        'f_cancel',
    ];

    /**
     * Relationship to CST (Customer Service Ticket)
     */
    public function cst(): BelongsTo
    {
        return $this->belongsTo(CstModel::class, 'id_afs_cst', 'id_afs_cst');
    }

    /**
     * Relationship to LKT Visit Logs (Realisasi)
     */
    public function realisasi(): HasMany
    {
        return $this->hasMany(\App\Models\realisasi\Mmaster::class, 'id_afs_lkt', 'id_afs_lkt');
    }
}
