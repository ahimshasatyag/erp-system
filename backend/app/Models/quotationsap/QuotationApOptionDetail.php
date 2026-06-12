<?php

namespace App\Models\quotationsap;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuotationApOptionDetail extends Model
{
    use HasFactory;

    protected $table = 'tb_po_opt_dtl';
    protected $primaryKey = 'id_po_opt_dtl'; // Assuming standard primary key or none.

    public $timestamps = false;

    protected $fillable = [
        'id_po_dtl',
        'id_product',
        'id_po',
        'nm_product_opt',
        'harga'
    ];

    public function detail()
    {
        return $this->belongsTo(QuotationApDetail::class, 'id_po_dtl', 'id_po_dtl');
    }
}
