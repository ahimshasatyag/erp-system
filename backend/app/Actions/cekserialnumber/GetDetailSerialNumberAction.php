<?php

namespace App\Actions\cekserialnumber;

use Illuminate\Support\Facades\DB;

class GetDetailSerialNumberAction
{
    public function execute(string $barcode)
    {
        return DB::table('tb_afs_csr as a')
            ->leftJoin('m_product as b', 'a.id_product', '=', 'b.id_product')
            ->leftJoin('m_customers as g', 'a.id_customers', '=', 'g.id_customers')
            ->leftJoin('m_provinsi as h', 'g.provinsi', '=', 'h.id')
            ->leftJoin('m_kota as i', 'g.kabupaten', '=', 'i.id')
            ->select(
                'b.code_product',
                'b.nm_product',
                'b.product_deskripsi',
                'g.nm_customers',
                'g.customers_address',
                'h.nama as provinsi',
                'i.nama_kabupaten as kabupaten',
                'g.customers_phone',
                'g.customers_mobile',
                'a.do_code',
                'a.waranty_start',
                'a.waranty_time',
                'a.waranty_end'
            )
            ->where('a.barcode', $barcode)
            ->distinct()
            ->get();
    }
}
