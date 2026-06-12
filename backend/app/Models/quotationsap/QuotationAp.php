<?php

namespace App\Models\quotationsap;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\suppliers\Supplier; // Assuming exists
use App\Models\products\ProductLokasi; // Assuming exists
// Add other models as necessary

class QuotationAp extends Model
{
    use HasFactory;

    protected $table = 'tb_po_hdr';
    protected $primaryKey = 'id_po';

    public $timestamps = false; // Because table uses date_create manually in CI

    protected $fillable = [
        'code_po',
        'code_quotation',
        'date_po',
        'status_po',
        'date_schdl',
        'id_suppliers',
        'nm_suppliers',
        'id_gudang',
        'id_mata_uang',
        'partner_ref',
        'notes',
        'amount_total',
        'id_product_lokasi',
        'link_file',
        'date_create'
    ];

    public function details()
    {
        return $this->hasMany(QuotationApDetail::class, 'id_po', 'id_po');
    }

    public function options()
    {
        return $this->hasMany(QuotationApOptionDetail::class, 'id_po', 'id_po');
    }
}
