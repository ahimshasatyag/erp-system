<?php

namespace App\Actions\cekserialnumber;

use Illuminate\Support\Facades\DB;

class GetListSerialNumberAction
{
    public function execute(string $search = null)
    {
        $query = DB::table('tb_afs_csr as a')
            ->leftJoin('m_product as b', 'a.id_product', '=', 'b.id_product')
            ->leftJoin('m_customers as g', 'a.id_customers', '=', 'g.id_customers')
            ->select(
                'a.barcode',
                'b.nm_product',
                'b.code_product',
                'g.nm_customers'
            )
            ->whereNotNull('a.barcode')
            ->where('a.barcode', '!=', '')
            ->distinct();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('a.barcode', 'like', "%{$search}%")
                  ->orWhere('b.nm_product', 'like', "%{$search}%")
                  ->orWhere('b.code_product', 'like', "%{$search}%")
                  ->orWhere('g.nm_customers', 'like', "%{$search}%");
            });
        }

        // Apply pagination
        return $query->orderBy('a.barcode', 'asc')->paginate(10);
    }
}
