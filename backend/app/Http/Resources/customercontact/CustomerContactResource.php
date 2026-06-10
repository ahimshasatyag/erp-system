<?php

namespace App\Http\Resources\customercontact;

use Illuminate\Http\Resources\Json\JsonResource;

class CustomerContactResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id_customers_contact' => $this->id_customers_contact,
            'id_customers' => $this->id_customers,
            'nm_customers_contact' => $this->nm_customers_contact,
            'customers_contact_posisi' => $this->customers_contact_posisi,
            'customers_contact_phone' => $this->customers_contact_phone,
            'customers_contact_mobile' => $this->customers_contact_mobile,
            'customers_contact_email' => $this->customers_contact_email,
            'customers_contact_address' => $this->customers_contact_address,
            'customer' => $this->whenLoaded('customer'),
        ];
    }
}
