<?php

namespace App\Models\realisasi;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\lkt\Mmaster as LktModel;

class Mmaster extends Model
{
    protected $table = 'tb_afs_realisasi';
    protected $primaryKey = 'lkt_sub_code';
    public $timestamps = false;

    protected $fillable = [
        'id_afs_lkt',
        'actual_starting_date',
        'actual_day',
        'actual_service_amount',
        'actual_transport_amount',
        'actual_accommodation_amount',
        'actual_description',
        'actual_tot_detail_amount',
        'status',
        'f_cancel',
        'image',
        'actual_training',
        'actual_bongkar',
        'actual_transport',
        'flag_daring',
        'lap_penyelesain',
    ];

    protected $casts = [
        'f_cancel' => 'boolean',
        'flag_daring' => 'boolean',
        'actual_day' => 'integer',
        'actual_service_amount' => 'integer',
        'actual_transport_amount' => 'integer',
        'actual_accommodation_amount' => 'integer',
        'actual_tot_detail_amount' => 'integer',
        'actual_training' => 'integer',
        'actual_bongkar' => 'integer',
    ];

    /**
     * Relationship to LKT Worksheet
     */
    public function lkt(): BelongsTo
    {
        return $this->belongsTo(LktModel::class, 'id_afs_lkt', 'id_afs_lkt');
    }
}
