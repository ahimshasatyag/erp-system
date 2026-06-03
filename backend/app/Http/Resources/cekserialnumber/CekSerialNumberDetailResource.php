<?php

namespace App\Http\Resources\cekserialnumber;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class CekSerialNumberDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // $this->resource is the array ['detail' => Collection, 'history' => Collection]
        $detailCollection = $this->resource['detail'] ?? collect();
        $historyCollection = $this->resource['history'] ?? collect();

        $details = $detailCollection->map(function ($row) {
            return [
                "code_product" => $row->code_product ?: "-",
                "nm_product" => $row->nm_product ?: "-",
                "product_deskripsi" => $row->product_deskripsi ?: "-",
                "customer" => $row->nm_customers ?: "-",
                "customer_address" => $row->customers_address ?: "-",
                "provinsi" => $row->provinsi ?: "-",
                "kabupaten" => $row->kabupaten ?: "-",
                "customer_phone" => $row->customers_phone ?: "-",
                "customer_mobile" => $row->customers_mobile ?: "-",
                "do_code" => $row->do_code ?: "-",
                "waranty_start" => $row->waranty_start ? Carbon::parse($row->waranty_start)->format('d-M-Y') : "-",
                "waranty_time" => $row->waranty_time ?: "0",
                "waranty_end" => $row->waranty_end ? Carbon::parse($row->waranty_end)->format('d-M-Y') : "-",
                "waranty_end_raw" => $row->waranty_end ?: null
            ];
        });

        $histories = $historyCollection->filter(function($h) {
            return $h->status !== 'Cancel';
        })->map(function ($h) {
            return [
                "cst_code" => $h->cst_code ?: "-",
                "cst_date" => $h->cst_date ? Carbon::parse($h->cst_date)->format('d-M-Y') : "-",
                "catatan_kerusakan" => $h->catatan_kerusakan ?: "-",
                "total_realisasi" => $h->total_realisasi ?: "0",
                "laporan_akhir" => $h->laporan_akhir ?: "-",
                "teknisi" => $h->teknisi ?: "-",
                "id_afs_lkt" => $h->id_afs_lkt,
            ];
        })->values();

        return [
            'status' => $detailCollection->count() > 0,
            'data' => $details,
            'history' => $histories
        ];
    }
}
