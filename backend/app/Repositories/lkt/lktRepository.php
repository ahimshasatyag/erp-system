<?php

namespace App\Repositories\lkt;

use App\Models\lkt\Mmaster;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class lktRepository
{
    /**
     * Get all LKT worksheets with pagination and filter criteria
     */
    public function getAll(string $search = null, string $startDate = null, string $endDate = null, bool $all = false, string $status = null): LengthAwarePaginator
    {
        $query = DB::table('tb_afs_lkt')
            ->join('tb_afs_cst', 'tb_afs_lkt.id_afs_cst', '=', 'tb_afs_cst.id_afs_cst')
            ->join('tb_afs_csr', 'tb_afs_cst.id_afs_csr', '=', 'tb_afs_csr.id_afs_csr')
            ->leftJoin('m_customers', 'tb_afs_csr.id_customers', '=', 'm_customers.id_customers')
            ->leftJoin('m_provinsi', 'm_customers.provinsi', '=', 'm_provinsi.id')
            ->leftJoin('m_kota', 'm_customers.kabupaten', '=', 'm_kota.id')
            ->leftJoin(DB::raw('(
                SELECT
                    id_afs_lkt,
                    SUM(CASE WHEN f_cancel = 0 AND UPPER(TRIM(status)) = \'CLOSE\' THEN CAST(REPLACE(COALESCE(actual_service_amount, 0), ".", "") AS UNSIGNED) ELSE 0 END) AS actual_service_amount,
                    SUM(CASE WHEN f_cancel = 0 AND UPPER(TRIM(status)) = \'CLOSE\' THEN CAST(REPLACE(COALESCE(actual_training, 0), ".", "") AS UNSIGNED) ELSE 0 END) AS actual_training,
                    SUM(CASE WHEN f_cancel = 0 AND UPPER(TRIM(status)) = \'CLOSE\' THEN CAST(REPLACE(COALESCE(actual_bongkar, 0), ".", "") AS UNSIGNED) ELSE 0 END) AS actual_bongkar,
                    SUM(CASE WHEN f_cancel = 0 AND UPPER(TRIM(status)) = \'CLOSE\' THEN CAST(REPLACE(COALESCE(actual_day, 0), ".", "") AS UNSIGNED) ELSE 0 END) AS actual_day,
                    SUM(CASE WHEN f_cancel = 0 AND UPPER(TRIM(status)) = \'CLOSE\' THEN CAST(REPLACE(COALESCE(actual_transport_amount, 0), ".", "") AS UNSIGNED) ELSE 0 END) AS actual_transport_amount
                FROM tb_afs_realisasi
                GROUP BY id_afs_lkt
            ) AS realisasi_close'), 'realisasi_close.id_afs_lkt', '=', 'tb_afs_lkt.id_afs_lkt')
            ->select(
                'tb_afs_lkt.*',
                'tb_afs_csr.id_customers',
                'm_customers.nm_customers',
                'tb_afs_cst.cst_code',
                'tb_afs_csr.waranty_end',
                'tb_afs_cst.cst_date',
                'm_provinsi.nama AS provinsi_nama',
                'm_kota.nama_kabupaten AS kabupaten_nama',
                DB::raw('COALESCE(realisasi_close.actual_service_amount, 0) AS actual_service_amount'),
                DB::raw('COALESCE(realisasi_close.actual_training, 0) AS actual_training'),
                DB::raw('COALESCE(realisasi_close.actual_bongkar, 0) AS actual_bongkar'),
                DB::raw('COALESCE(realisasi_close.actual_day, 0) AS actual_day'),
                DB::raw('COALESCE(realisasi_close.actual_transport_amount, 0) AS actual_transport_amount')
            )
            ->where('tb_afs_lkt.f_cancel', 0);

        if (!$all) {
            $startDate = !empty($startDate) ? $startDate : date('Y-m-01');
            $endDate = !empty($endDate) ? $endDate : date('Y-m-d');
            $query->whereBetween('tb_afs_lkt.starting_date', [$startDate, $endDate]);
        }

        if (!empty($status)) {
            $query->where('tb_afs_lkt.flag_done', $status);
        }

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $terms = explode(',', $search);
                foreach ($terms as $term) {
                    $term = trim($term);
                    $q->orWhere('tb_afs_lkt.lkt_code', 'like', "%{$term}%")
                      ->orWhere('tb_afs_cst.cst_code', 'like', "%{$term}%")
                      ->orWhere('m_customers.nm_customers', 'like', "%{$term}%")
                      ->orWhere('tb_afs_lkt.description', 'like', "%{$term}%")
                      ->orWhere('tb_afs_csr.waranty_end', 'like', "%{$term}%")
                      ->orWhere('tb_afs_lkt.flag_done', 'like', "%{$term}%");
                }
            });
        }

        return $query->orderBy('tb_afs_lkt.lkt_code', 'DESC')->paginate(10);
    }

    /**
     * Get detailed LKT record by LKT code
     */
    public function getByCode(string $lktCode)
    {
        return DB::table('tb_afs_lkt')
            ->join('tb_afs_cst', 'tb_afs_lkt.id_afs_cst', '=', 'tb_afs_cst.id_afs_cst')
            ->join('tb_afs_csr', 'tb_afs_cst.id_afs_csr', '=', 'tb_afs_csr.id_afs_csr')
            ->join('m_customers', 'tb_afs_csr.id_customers', '=', 'm_customers.id_customers')
            ->join('m_karyawan', 'tb_afs_csr.id_karyawan', '=', 'm_karyawan.id_karyawan')
            ->join('m_product', 'tb_afs_csr.id_product', '=', 'm_product.id_product')
            ->leftJoin('m_product_kategori', 'm_product.id_product_kategori', '=', 'm_product_kategori.id_product_kategori')
            ->leftJoin('tb_do_hdr', 'tb_afs_csr.do_code', '=', 'tb_do_hdr.code_do')
            ->leftJoin('tb_so_hdr', 'tb_do_hdr.id_so', '=', 'tb_so_hdr.id_so')
            ->select(
                'tb_afs_lkt.*',
                'tb_afs_cst.cst_code',
                'tb_afs_cst.cst_date',
                'tb_afs_cst.status AS cst_status',
                'tb_afs_csr.sts_pasang',
                'tb_afs_csr.csr_date',
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
                'tb_afs_csr.mesin_lama',
                'tb_so_hdr.keterangan AS so_keterangan',
                'm_customers.nm_customers',
                'm_karyawan.nm_karyawan',
                'm_product.nm_product',
                'm_product.id_product_kategori',
                'm_product_kategori.nm_product_kategori'
            )
            ->where('tb_afs_lkt.lkt_code', $lktCode)
            ->first();
    }

    /**
     * Get CST detail by CST code for starting a new LKT
     */
    public function getCstForNewLkt(string $cstCode)
    {
        return DB::table('tb_afs_cst')
            ->join('tb_afs_csr', 'tb_afs_cst.id_afs_csr', '=', 'tb_afs_csr.id_afs_csr')
            ->join('m_karyawan', 'tb_afs_csr.id_karyawan', '=', 'm_karyawan.id_karyawan')
            ->join('m_customers', 'tb_afs_csr.id_customers', '=', 'm_customers.id_customers')
            ->join('m_product', 'tb_afs_csr.id_product', '=', 'm_product.id_product')
            ->leftJoin('tb_do_hdr', 'tb_afs_csr.do_code', '=', 'tb_do_hdr.code_do')
            ->leftJoin('tb_so_hdr', 'tb_do_hdr.id_so', '=', 'tb_so_hdr.id_so')
            ->select(
                'tb_afs_cst.*',
                'tb_afs_csr.*',
                'm_karyawan.nm_karyawan',
                'm_customers.nm_customers',
                'tb_so_hdr.customers_address',
                'tb_so_hdr.keterangan AS so_keterangan',
                'm_product.nm_product',
                'm_product.id_product_kategori'
            )
            ->where('tb_afs_csr.f_cancel', '0')
            ->where('tb_afs_cst.cst_code', $cstCode)
            ->first();
    }

    /**
     * Get visits associated with an LKT Code
     */
    public function getVisitList(string $lktCode): Collection
    {
        return DB::table('tb_afs_realisasi')
            ->join('tb_afs_lkt', 'tb_afs_realisasi.id_afs_lkt', '=', 'tb_afs_lkt.id_afs_lkt')
            ->join('tb_afs_cst', 'tb_afs_lkt.id_afs_cst', '=', 'tb_afs_cst.id_afs_cst')
            ->join('tb_afs_csr', 'tb_afs_cst.id_afs_csr', '=', 'tb_afs_csr.id_afs_csr')
            ->join('m_customers', 'tb_afs_csr.id_customers', '=', 'm_customers.id_customers')
            ->select(
                'tb_afs_realisasi.*',
                'tb_afs_csr.id_customers',
                'm_customers.nm_customers',
                'tb_afs_lkt.lkt_code',
                'tb_afs_lkt.flag_done',
                'tb_afs_cst.cst_code'
            )
            ->where('tb_afs_lkt.lkt_code', $lktCode)
            ->orderBy('tb_afs_realisasi.lkt_sub_code', 'ASC')
            ->get();
    }

    /**
     * Get detail of a specific visit by its sub_code
     */
    public function getVisitDetail(string $lktSubCode)
    {
        return DB::table('tb_afs_realisasi')
            ->join('tb_afs_lkt', 'tb_afs_lkt.id_afs_lkt', '=', 'tb_afs_realisasi.id_afs_lkt')
            ->join('tb_afs_cst', 'tb_afs_cst.id_afs_cst', '=', 'tb_afs_lkt.id_afs_cst')
            ->join('tb_afs_csr', 'tb_afs_csr.id_afs_csr', '=', 'tb_afs_cst.id_afs_csr')
            ->select(
                'tb_afs_realisasi.*',
                'tb_afs_cst.cst_code',
                'tb_afs_lkt.lkt_code',
                'tb_afs_csr.lap_kerusakan',
                'tb_afs_csr.mesin_lama',
                'tb_afs_csr.sts_pasang',
                'tb_afs_csr.waranty_end',
                'tb_afs_lkt.description',
                'tb_afs_lkt.estimation_day',
                'tb_afs_lkt.service_amount',
                'tb_afs_lkt.flag_done',
                'tb_afs_lkt.starting_date',
                'tb_afs_lkt.transport_amount',
                'tb_afs_lkt.accommodation_amount',
                'tb_afs_cst.cst_date',
                'tb_afs_csr.csr_date'
            )
            ->where('tb_afs_realisasi.lkt_sub_code', $lktSubCode)
            ->first();
    }

    /**
     * Get planned parts list
     */
    public function getPartDetail(string $lktCode): Collection
    {
        return DB::table('tb_trans_swo_part')
            ->where('f_cancel', '0')
            ->where('lkt_code', $lktCode)
            ->get();
    }

    /**
     * Get actual parts list used during a visit
     */
    public function getPartDetailSub(string $lktSubCode): Collection
    {
        return DB::table('tb_trans_swo_part_actual')
            ->where('f_cancel', '0')
            ->where('id_visit', $lktSubCode)
            ->get();
    }

    /**
     * Get planned technicians list
     */
    public function getTechnicians(string $lktCode): Collection
    {
        return DB::table('tb_afs_realisasi_teknisi')
            ->join('tb_afs_lkt', 'tb_afs_realisasi_teknisi.id_afs_lkt', '=', 'tb_afs_lkt.id_afs_lkt')
            ->join('m_karyawan', 'tb_afs_realisasi_teknisi.id_karyawan', '=', 'm_karyawan.id_karyawan')
            ->select('tb_afs_realisasi_teknisi.*', 'm_karyawan.nm_karyawan')
            ->where('tb_afs_lkt.lkt_code', $lktCode)
            ->where('tb_afs_realisasi_teknisi.id_karyawan', '!=', 0)
            ->get();
    }

    /**
     * Get actual visit technicians list
     */
    public function getVisitTechnicians(string $lktSubCode): Collection
    {
        return DB::table('tb_afs_realisasi_teknisi')
            ->join('m_karyawan', 'tb_afs_realisasi_teknisi.actual_id_karyawan', '=', 'm_karyawan.id_karyawan')
            ->select('tb_afs_realisasi_teknisi.*', 'm_karyawan.nm_karyawan')
            ->where('tb_afs_realisasi_teknisi.lkt_sub_code', $lktSubCode)
            ->where('tb_afs_realisasi_teknisi.actual_id_karyawan', '!=', 0)
            ->get();
    }

    /**
     * Check if there are any unfinished visits (Draft or ON PROGRESS)
     */
    public function hasUnfinishedVisits(string $lktCode): bool
    {
        return DB::table('tb_afs_realisasi')
            ->join('tb_afs_lkt', 'tb_afs_realisasi.id_afs_lkt', '=', 'tb_afs_lkt.id_afs_lkt')
            ->where('tb_afs_lkt.lkt_code', $lktCode)
            ->where('tb_afs_realisasi.f_cancel', 0)
            ->whereIn('tb_afs_realisasi.status', ['Draft', 'ON PROGRESS'])
            ->exists();
    }

    /**
     * Check if all visits are cancelled
     */
    public function allVisitsCancelled(string $lktCode): bool
    {
        $visits = DB::table('tb_afs_realisasi')
            ->join('tb_afs_lkt', 'tb_afs_realisasi.id_afs_lkt', '=', 'tb_afs_lkt.id_afs_lkt')
            ->where('tb_afs_lkt.lkt_code', $lktCode)
            ->select('tb_afs_realisasi.status', 'tb_afs_realisasi.f_cancel')
            ->get();

        if ($visits->isEmpty()) {
            return false;
        }

        foreach ($visits as $visit) {
            if ($visit->status !== 'CANCEL' && $visit->f_cancel == 0) {
                return false;
            }
        }
        return true;
    }

    /**
     * Check if any visit is closed
     */
    public function anyVisitClosed(string $lktCode): bool
    {
        return DB::table('tb_afs_realisasi')
            ->join('tb_afs_lkt', 'tb_afs_realisasi.id_afs_lkt', '=', 'tb_afs_lkt.id_afs_lkt')
            ->where('tb_afs_lkt.lkt_code', $lktCode)
            ->where('tb_afs_realisasi.status', 'CLOSE')
            ->where('tb_afs_realisasi.f_cancel', 0)
            ->exists();
    }
}
