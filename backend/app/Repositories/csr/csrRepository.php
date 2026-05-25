<?php

namespace App\Repositories\csr;

use App\Models\csr\Mmaster;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class csrRepository
{
    /**
     * Get all CSR with pagination and filters
     */
    public function getAll(string $search = null, string $startDate = null, string $endDate = null, bool $all = false): LengthAwarePaginator
    {
        $query = DB::table('tb_afs_csr')
            ->join('m_karyawan', 'tb_afs_csr.id_karyawan', '=', 'm_karyawan.id_karyawan')
            ->join('m_customers', 'tb_afs_csr.id_customers', '=', 'm_customers.id_customers')
            ->join('m_product', 'tb_afs_csr.id_product', '=', 'm_product.id_product')
            ->select('tb_afs_csr.*', 'm_karyawan.nm_karyawan', 'm_customers.nm_customers', 'm_product.nm_product', 'm_product.code_product')
            ->whereNotIn('tb_afs_csr.csr_status', ['IN PROGRESS']);

        if (!$all) {
            $startDate = $startDate ?? date('Y-m-01');
            $endDate = $endDate ?? date('Y-m-d');
            $query->whereBetween('tb_afs_csr.csr_date', [$startDate, $endDate]);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $terms = explode(',', $search);
                foreach ($terms as $term) {
                    $q->orWhere('csr_code', 'like', "%{$term}%")
                      ->orWhere('nm_customers', 'like', "%{$term}%")
                      ->orWhere('code_product', 'like', "%{$term}%")
                      ->orWhere('nm_karyawan', 'like', "%{$term}%")
                      ->orWhere('csr_status', 'like', "%{$term}%");
                }
            });
        }

        return $query->orderBy('tb_afs_csr.csr_code', 'ASC')->paginate(10);
    }

    /**
     * Get CSR detail by code
     */
    public function getByCode(string $csrCode)
    {
        return DB::table('tb_afs_csr')
            ->leftJoin('m_karyawan', 'tb_afs_csr.id_karyawan', '=', 'm_karyawan.id_karyawan')
            ->leftJoin('m_customers', 'tb_afs_csr.id_customers', '=', 'm_customers.id_customers')
            ->leftJoin('m_product', 'tb_afs_csr.id_product', '=', 'm_product.id_product')
            ->leftJoin('tb_do_hdr', 'tb_afs_csr.do_code', '=', 'tb_do_hdr.code_do')
            ->leftJoin('m_product_kategori', 'm_product.id_product_kategori', '=', 'm_product_kategori.id_product_kategori')
            ->leftJoin('tb_so_hdr', 'tb_do_hdr.id_so', '=', 'tb_so_hdr.id_so')
            ->select(
                'tb_afs_csr.*', 
                'm_karyawan.nm_karyawan', 
                'm_customers.nm_customers', 
                'm_customers.customers_mobile', 
                'tb_so_hdr.customers_address', 
                'm_product.nm_product', 
                'm_product.code_product', 
                'm_product.id_product_kategori', 
                'tb_so_hdr.keterangan', 
                'tb_so_hdr.internal_notes', 
                'm_product_kategori.nm_product_kategori'
            )
            ->where('tb_afs_csr.csr_code', $csrCode)
            ->first();
    }
    
    /**
     * Create new CSR
     */
    public function create(array $data): Mmaster
    {
        return Mmaster::create($data);
    }

    /**
     * Update CSR
     */
    public function update(string $csrCode, array $data): bool
    {
        return Mmaster::where('csr_code', $csrCode)->update($data) > 0;
    }
    
    /**
     * Find by barcode
     */
    public function getByBarcode(string $barcode)
    {
        return DB::table('tb_do_dtl as a')
            ->join('tb_do_hdr as b', 'a.id_do', '=', 'b.id_do')
            ->join('tb_so_hdr as c', 'b.id_so', '=', 'c.id_so')
            ->leftJoin('m_customers as d', 'b.id_customers', '=', 'd.id_customers')
            ->where('a.nbarcode', $barcode)
            ->where('c.flag_cancel', '0')
            ->selectRaw("c.code_so, a.nbarcode, b.date_delivery, b.code_do, a.id_product, b.status_do, b.id_customers, '' as mesin_lama, 'so_ok' as so_ok, d.provinsi")
            ->orderByDesc('a.id_do_dtl')
            ->first();
    }
}
