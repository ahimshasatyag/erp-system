<?php

namespace App\Http\Resources\customers;

use Illuminate\Http\Resources\Json\JsonResource;

class CustomerResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id_customers' => $this->id_customers,
            'code_customers' => $this->code_customers,
            'nm_customers' => $this->nm_customers,
            'customers_address' => $this->customers_address,
            'customers_address_invoice' => $this->customers_address_invoice,
            'customers_phone' => $this->customers_phone,
            'customers_mobile' => $this->customers_mobile,
            'customers_email' => $this->customers_email,
            'customers_fax' => $this->customers_fax,
            'f_company' => (bool)$this->f_company,
            'nama_lengkap' => $this->nama_lengkap,
            'nik' => $this->nik,
            'nib' => $this->nib,
            'npwp' => $this->npwp,
            'alamat' => $this->alamat,
            'provinsi' => $this->provinsi,
            'provinsi_name' => $this->provinsi_name, // from join
            'kabupaten' => $this->kabupaten,
            'kabupaten_name' => $this->kabupaten_name, // from join
            'is_blacklist' => (bool)$this->is_blacklist,
            'is_external_sales' => (bool)$this->is_external_sales,
            'jumlah_so' => $this->jumlah_so ?? 0,
            'date_create' => $this->date_create,
            'date_update' => $this->date_update,
            'contacts' => $this->whenLoaded('contacts', function() {
                return $this->contacts->map(function($contact) {
                    return [
                        'nm_customers_contact' => $contact->nm_customers_contact,
                        'customers_contact_posisi' => $contact->customers_contact_posisi,
                        'customers_contact_phone' => $contact->customers_contact_phone,
                        'customers_contact_email' => $contact->customers_contact_email,
                    ];
                });
            }),
        ];
    }
}
