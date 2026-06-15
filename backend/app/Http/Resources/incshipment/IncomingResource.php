<?php

namespace App\Http\Resources\incshipment;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IncomingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        return [
            'id_incoming' => $this->id,
            'code' => $this->code,
            'id_po' => $this->id_po,
            'code_po' => $this->po ? $this->po->code_po : null,
            'id_suppliers' => $this->id_suppliers,
            'nm_suppliers' => $this->supplier ? $this->supplier->nm_suppliers : null,
            'date_receive' => $this->date_receive,
            'status_incoming' => $this->status_incoming,
            'date_create' => $this->date_create,
            'f_assign_barcode' => $this->f_assign_barcode,
            'f_print_barcode' => $this->f_print_barcode,
            'f_ok_receive' => $this->f_ok_receive,
            'details' => IncomingDetailResource::collection($this->whenLoaded('details'))
        ];
    }
}
