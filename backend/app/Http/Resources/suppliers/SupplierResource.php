<?php

namespace App\Http\Resources\suppliers;

use Illuminate\Http\Resources\Json\JsonResource;

class SupplierResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id_suppliers' => $this->id_suppliers,
            'nm_suppliers' => $this->nm_suppliers,
            'suppliers_mobile' => $this->suppliers_mobile,
            'suppliers_email' => $this->suppliers_email,
            'suppliers_address' => $this->suppliers_address,
            'suppliers_phone' => $this->suppliers_phone,
            'suppliers_fax' => $this->suppliers_fax,
            'suppliers_website' => $this->suppliers_website,
            'suppliers_logo' => $this->suppliers_logo ? url('assets/upload/' . $this->suppliers_logo) : null,
            'id_mata_uang' => $this->id_mata_uang,
            'date_create' => $this->date_create,
            'date_update' => $this->date_update,
            'contacts' => $this->whenLoaded('contacts'),
        ];
    }
}
