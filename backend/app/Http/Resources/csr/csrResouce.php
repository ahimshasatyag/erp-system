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
        ];
    }
}
