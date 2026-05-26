<?php

namespace App\Http\Resources\cst;

use Illuminate\Http\Resources\Json\JsonResource;

class cstResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray($request): array
    {
        return [
            'id_afs_cst' => $this->id_afs_cst ?? null,
            'id_afs_csr' => $this->id_afs_csr ?? null,
            'cst_code' => $this->cst_code ?? null,
            'cst_date' => $this->cst_date ?? null,
            'status' => $this->status ?? null,
            'approve_cst' => $this->approve_cst ?? null,
            'approved_cst_by' => $this->approved_cst_by ?? null,
            'done_cst_by' => $this->done_cst_by ?? null,
            'ignore_cst_by' => $this->ignore_cst_by ?? null,
            'cst_approve_date' => $this->cst_approve_date ?? null,
            'cst_ignore_date' => $this->cst_ignore_date ?? null,
            'cst_done_date' => $this->cst_done_date ?? null,
            'csr_code' => $this->csr_code ?? null,
            'csr_date' => $this->csr_date ?? null,
            'so_date' => $this->so_date ?? null,
            'id_customers' => $this->id_customers ?? null,
            'id_product' => $this->id_product ?? null,
            'id_karyawan' => $this->id_karyawan ?? null,
            'barcode' => $this->barcode ?? null,
            'do_code' => $this->do_code ?? null,
            'waranty_start' => $this->waranty_start ?? null,
            'waranty_time' => $this->waranty_time ?? null,
            'waranty_end' => $this->waranty_end ?? null,
            'lap_kerusakan' => $this->lap_kerusakan ?? null,
            'lokasi' => $this->lokasi ?? null,
            'sts_pasang' => $this->sts_pasang ?? null,
            'f_cancel' => $this->f_cancel ?? null,
            'image' => $this->image ?? null,
            'alasan_cancel' => $this->alasan_cancel ?? null,
            'csr_status' => $this->csr_status ?? null,
            'approved_csr_by' => $this->approved_csr_by ?? null,
            'nm_karyawan' => $this->nm_karyawan ?? null,
            'nm_customers' => $this->nm_customers ?? null,
            'customers_mobile' => $this->customers_mobile ?? null,
            'customers_address' => $this->customers_address ?? null,
            'keterangan' => $this->keterangan ?? null,
            'nm_product' => $this->nm_product ?? null,
            'code_product' => $this->code_product ?? null,
            'id_product_kategori' => $this->id_product_kategori ?? null,
            'nm_product_kategori' => $this->nm_product_kategori ?? null,
        ];
    }
}
