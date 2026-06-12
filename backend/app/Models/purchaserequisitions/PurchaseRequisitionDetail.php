<?php

namespace App\Models\purchaserequisitions;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseRequisitionDetail extends Model
{
    use HasFactory;

    protected $table = 'tb_pr_dtl';
    protected $primaryKey = 'id_pr_dtl';

    public $timestamps = false;

    protected $fillable = [
        'id_pr',
        'id_product',
        'code_product',
        'nm_product',
        'product_deskripsi',
        'qty',
        'note',
        'qty_po',
        'id_po_dtl'
    ];

    public function purchaseRequisition()
    {
        return $this->belongsTo(PurchaseRequisition::class, 'id_pr', 'id_pr');
    }

    public function product()
    {
        return $this->belongsTo(\App\Models\products\Product::class, 'id_product', 'id_product');
    }
}
