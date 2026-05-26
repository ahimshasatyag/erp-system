<?php

namespace App\Repositories\cst;

use App\Models\cst\Mmaster;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class cstRepository
{
    /**
     * Get all CST with pagination and filters
     */
    public function getAll(string $search = null, string $startDate = null, string $endDate = null, bool $all = false): LengthAwarePaginator
    {
        $query = DB::table('tb_afs_cst')
            ->join('tb_afs_csr', 'tb_afs_cst.id_afs_csr', '=', 'tb_afs_csr.id_afs_csr')
            ->join('m_karyawan', 'tb_afs_csr.id_karyawan', '=', 'm_karyawan.id_karyawan')
            ->join('m_customers', 'tb_afs_csr.id_customers', '=', 'm_customers.id_customers')
            ->join('m_product', 'tb_afs_csr.id_product', '=', 'm_product.id_product')
            ->select(
                'tb_afs_cst.cst_code',
                'tb_afs_cst.cst_date',
                'tb_afs_cst.status',
                'tb_afs_csr.csr_code',
                'tb_afs_csr.csr_date',
                'tb_afs_csr.f_cancel',
                'tb_afs_csr.approved_csr_by',
                'm_karyawan.nm_karyawan',
                'm_customers.nm_customers',
                'm_product.nm_product',
                'm_product.code_product'
            )
            ->where('tb_afs_cst.cst_code', '<>', 'kosong');

        if (!$all) {
            $startDate = $startDate ?? date('Y-m-01');
            $endDate = $endDate ?? date('Y-m-d');
            $query->whereBetween('tb_afs_cst.cst_date', [$startDate, $endDate]);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $terms = explode(',', $search);
                foreach ($terms as $term) {
                    $term = trim($term);
                    $q->orWhere('tb_afs_csr.csr_code', 'like', "%{$term}%")
                      ->orWhere('tb_afs_cst.cst_code', 'like', "%{$term}%")
                      ->orWhere('m_customers.nm_customers', 'like', "%{$term}%")
                      ->orWhere('m_product.code_product', 'like', "%{$term}%")
                      ->orWhere('m_karyawan.nm_karyawan', 'like', "%{$term}%")
                      ->orWhere('tb_afs_cst.status', 'like', "%{$term}%");
                }
            });
        }

        return $query->orderBy('tb_afs_cst.cst_code', 'DESC')->paginate(10);
    }

    /**
     * Get CST detail by code
     */
    public function getByCode(string $cstCode)
    {
        return DB::table('tb_afs_cst')
            ->join('tb_afs_csr', 'tb_afs_cst.id_afs_csr', '=', 'tb_afs_csr.id_afs_csr')
            ->join('m_karyawan', 'tb_afs_csr.id_karyawan', '=', 'm_karyawan.id_karyawan')
            ->join('m_customers', 'tb_afs_csr.id_customers', '=', 'm_customers.id_customers')
            ->join('m_product', 'tb_afs_csr.id_product', '=', 'm_product.id_product')
            ->leftJoin('tb_do_hdr', 'tb_afs_csr.do_code', '=', 'tb_do_hdr.code_do')
            ->leftJoin('m_product_kategori', 'm_product.id_product_kategori', '=', 'm_product_kategori.id_product_kategori')
            ->leftJoin('tb_so_hdr', 'tb_do_hdr.id_so', '=', 'tb_so_hdr.id_so')
            ->select(
                'tb_afs_cst.*',
                'tb_afs_csr.csr_code',
                'tb_afs_csr.csr_date',
                'tb_afs_csr.so_date',
                'tb_afs_csr.id_customers',
                'tb_afs_csr.id_product',
                'tb_afs_csr.id_karyawan',
                'tb_afs_csr.barcode',
                'tb_afs_csr.do_code',
                'tb_afs_csr.waranty_start',
                'tb_afs_csr.waranty_time',
                'tb_afs_csr.waranty_end',
                'tb_afs_csr.lap_kerusakan',
                'tb_afs_csr.lokasi',
                'tb_afs_csr.sts_pasang',
                'tb_afs_csr.f_cancel',
                'tb_afs_csr.image',
                'tb_afs_csr.alasan_cancel',
                'tb_afs_csr.csr_status',
                'tb_afs_csr.approved_csr_by',
                'm_karyawan.nm_karyawan',
                'm_customers.nm_customers',
                'm_customers.customers_mobile',
                'tb_so_hdr.customers_address',
                'tb_so_hdr.keterangan',
                'm_product.nm_product',
                'm_product.code_product',
                'm_product.id_product_kategori',
                'm_product_kategori.nm_product_kategori'
            )
            ->where('tb_afs_cst.cst_code', $cstCode)
            ->first();
    }

    /**
     * Get related active LKT sheets
     */
    public function getLktList(string $cstCode): Collection
    {
        return DB::table('tb_afs_lkt')
            ->join('tb_afs_cst', 'tb_afs_lkt.id_afs_cst', '=', 'tb_afs_cst.id_afs_cst')
            ->join('tb_afs_csr', 'tb_afs_cst.id_afs_csr', '=', 'tb_afs_csr.id_afs_csr')
            ->join('m_customers', 'tb_afs_csr.id_customers', '=', 'm_customers.id_customers')
            ->select('tb_afs_lkt.*', 'tb_afs_csr.id_customers', 'm_customers.nm_customers')
            ->where('tb_afs_lkt.f_cancel', '0')
            ->where('tb_afs_cst.cst_code', $cstCode)
            ->orderBy('tb_afs_cst.cst_code', 'DESC')
            ->get();
    }

    /**
     * Check if there are any related LKT worksheets marked as DONE
     */
    public function checkLktDone(string $cstCode): int
    {
        return DB::table('tb_afs_lkt as a')
            ->join('tb_afs_cst as b', 'a.id_afs_cst', '=', 'b.id_afs_cst')
            ->where('b.cst_code', $cstCode)
            ->where('a.flag_done', 'DONE')
            ->where('a.f_cancel', 0)
            ->count();
    }

    /**
     * Create new CST Eloquent record
     */
    public function create(array $data): Mmaster
    {
        return Mmaster::create($data);
    }

    /**
     * Update CST record details
     */
    public function update(string $cstCode, array $data): bool
    {
        return Mmaster::where('cst_code', $cstCode)->update($data) > 0;
    }
}
