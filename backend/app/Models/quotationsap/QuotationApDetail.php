<?php

namespace App\Models\quotationsap;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\products\Product; // Assuming exists

class QuotationApDetail extends Model
{
    use HasFactory;

    protected $table = 'tb_po_dtl';
    protected $primaryKey = 'id_po_dtl';

    public $timestamps = false;

    protected $fillable = [
        'id_po',
        'id_product',
        'code_product',
        'nm_product',
        'product_deskripsi',
        'qty',
        'product_price',
        'notes'
    ];

    public function header()
    {
        return $this->belongsTo(QuotationAp::class, 'id_po', 'id_po');
    }

    public function options()
    {
        return $this->hasMany(QuotationApOptionDetail::class, 'id_po_dtl', 'id_po_dtl');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'id_product', 'id_product');
    }
}
