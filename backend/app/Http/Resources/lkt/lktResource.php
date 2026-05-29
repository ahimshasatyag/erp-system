<?php

namespace App\Http\Resources\lkt;

use Illuminate\Http\Resources\Json\JsonResource;

class lktResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray($request): array
    {
        return [
            'id_afs_lkt'           => $this->id_afs_lkt ?? null,
            'lkt_code'             => $this->lkt_code ?? null,
            'id_afs_cst'           => $this->id_afs_cst ?? null,
            'starting_date'        => $this->starting_date ?? null,
            'estimation_day'       => $this->estimation_day ?? null,
            'service_amount'       => $this->service_amount ?? null,
            'transport_amount'     => $this->transport_amount ?? null,
            'accommodation_amount' => $this->accommodation_amount ?? null,
            'description'          => $this->description ?? null,
            'tot_detail_amount'    => $this->tot_detail_amount ?? null,
            'flag_done'            => $this->flag_done ?? null,
            'image'                => $this->image ?? null,
            'actual_transport'     => $this->actual_transport ?? null,
            'f_cancel'             => $this->f_cancel ?? 0,
            
            // CST / CSR / Customer Joins
            'cst_code'             => $this->cst_code ?? null,
            'cst_date'             => $this->cst_date ?? null,
            'cst_status'           => $this->cst_status ?? null,
            'sts_pasang'           => $this->sts_pasang ?? null,
            'csr_date'             => $this->csr_date ?? null,
            'id_customers'         => $this->id_customers ?? null,
            'id_product'           => $this->id_product ?? null,
            'id_karyawan'          => $this->id_karyawan ?? null,
            'barcode'              => $this->barcode ?? null,
            'do_code'              => $this->do_code ?? null,
            'waranty_start'        => $this->waranty_start ?? null,
            'waranty_time'         => $this->waranty_time ?? null,
            'waranty_end'          => $this->waranty_end ?? null,
            'lap_kerusakan'        => $this->lap_kerusakan ?? null,
            'lokasi'               => $this->lokasi ?? null,
            'mesin_lama'           => $this->mesin_lama ?? null,
            'so_keterangan'        => $this->so_keterangan ?? null,
            'nm_customers'         => $this->nm_customers ?? null,
            'nm_karyawan'          => $this->nm_karyawan ?? null,
            'nm_product'           => $this->nm_product ?? null,
            'id_product_kategori'  => $this->id_product_kategori ?? null,
            'nm_product_kategori'  => $this->nm_product_kategori ?? null,
        ];
    }
}
