<?php

namespace App\Models\purchaserequisitions;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseRequisition extends Model
{
    use HasFactory;

    protected $table = 'tb_pr_hdr';
    protected $primaryKey = 'id_pr';

    public $timestamps = false; // Add this if you want to use custom date_create or if there are no timestamps
    
    protected $fillable = [
        'code_pr',
        'username',
        'date_request',
        'date_deadline',
        'status_pr'
    ];

    public function details()
    {
        return $this->hasMany(PurchaseRequisitionDetail::class, 'id_pr', 'id_pr');
    }
}
