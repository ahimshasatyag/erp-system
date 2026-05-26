<?php

namespace App\Http\Resources\csr;

use Illuminate\Http\Resources\Json\JsonResource;

class csrResouce extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id_afs_csr' => $this->id_afs_csr ?? null,
            'csr_code' => $this->csr_code ?? null,
            'csr_date' => $this->csr_date ?? null,
            'id_customers' => $this->id_customers ?? null,
            'nm_customers' => $this->nm_customers ?? null,
            'id_karyawan' => $this->id_karyawan ?? null,
            'nm_karyawan' => $this->nm_karyawan ?? null,
            'id_product' => $this->id_product ?? null,
            'code_product' => $this->code_product ?? null,
            'nm_product' => $this->nm_product ?? null,
            'csr_status' => $this->csr_status ?? null,
            // Include dynamic fields that might be joined
            'customers_mobile' => $this->customers_mobile ?? null,
            'customers_address' => $this->customers_address ?? null,
            'id_product_kategori' => $this->id_product_kategori ?? null,
            'nm_product_kategori' => $this->nm_product_kategori ?? null,
            'keterangan' => $this->keterangan ?? null,
            'internal_notes' => $this->internal_notes ?? null,
            'lap_kerusakan' => $this->lap_kerusakan ?? null,
            'lokasi' => $this->lokasi ?? null,
            'sts_pasang' => $this->sts_pasang ?? null,
            'waranty_start' => $this->waranty_start ?? null,
            'waranty_end' => $this->waranty_end ?? null,
            'waranty_time' => $this->waranty_time ?? null,
            'barcode' => $this->barcode ?? null,
            'do_code' => $this->do_code ?? null,
            'mesin_lama' => $this->mesin_lama ?? null,
            'image' => $this->image ?? null,
            'cst_list' => \Illuminate\Support\Facades\DB::table('tb_afs_cst as a')
                ->join('tb_afs_csr as b', 'a.id_afs_csr', '=', 'b.id_afs_csr')
                ->leftJoin('m_product as c', 'b.id_product', '=', 'c.id_product')
                ->leftJoin('m_karyawan as d', 'b.id_karyawan', '=', 'd.id_karyawan')
                ->select('a.id_afs_cst', 'a.cst_code', 'a.cst_date', 'a.status', 'c.code_product', 'c.nm_product', 'd.nm_karyawan', 'b.approved_csr_by')
                ->where('a.id_afs_csr', $this->id_afs_csr)
                ->get(),
        ];
    }
}
