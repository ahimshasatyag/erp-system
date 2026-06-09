<?php

namespace App\Services\customers;

use App\Models\customers\Customer;
use App\Models\customers\CustomerContact;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class CustomerService
{
    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            // ID generation logic replicating runningnumber('id_customers') & string padding
            $lastId = DB::table('m_customers')->orderBy('id_customers', 'desc')->first();
            $newId = $lastId ? (int) $lastId->id_customers + 1 : 1;
            $strId = (string) $newId;
            $codeCustomers = str_pad($strId, 5, "0", STR_PAD_LEFT);

            $customer = new Customer();
            $customer->id_customers = $strId;
            $customer->code_customers = $codeCustomers;
            $customer->nm_customers = $data['nm_customers'];
            $customer->customers_address = $data['customers_address'];
            $customer->customers_address_invoice = $data['customers_address_invoice'];
            $customer->customers_phone = $data['customers_phone'] ?? null;
            $customer->customers_mobile = $data['customers_mobile'] ?? null;
            $customer->customers_email = $data['customers_email'] ?? null;
            $customer->customers_fax = $data['customers_fax'] ?? null;
            $customer->provinsi = $data['provinsi'];
            $customer->kabupaten = $data['kabupaten'];
            
            $customer->f_company = $data['f_company'] ?? false;
            $customer->nama_lengkap = $data['f_company'] ? ($data['nama_lengkap'] ?? null) : $data['nm_customers'];
            $customer->nik = $data['f_company'] ? null : ($data['nik'] ?? null);
            $customer->nib = $data['f_company'] ? ($data['nib'] ?? null) : null;
            $customer->npwp = $data['f_company'] ? ($data['npwp'] ?? null) : null;
            $customer->alamat = $data['alamat'] ?? null;
            $customer->is_blacklist = $data['is_blacklist'] ?? false;
            $customer->is_external_sales = $data['is_external_sales'] ?? false;
            
            $customer->date_create = Carbon::now();
            $customer->save();

            if (isset($data['contacts']) && is_array($data['contacts'])) {
                foreach ($data['contacts'] as $contactData) {
                    if (!empty($contactData['nm_customers_contact'])) {
                        CustomerContact::create([
                            'id_customers' => $strId,
                            'nm_customers_contact' => $contactData['nm_customers_contact'],
                            'customers_contact_posisi' => $contactData['customers_contact_posisi'] ?? null,
                            'customers_contact_phone' => $contactData['customers_contact_phone'] ?? null,
                            'customers_contact_email' => $contactData['customers_contact_email'] ?? null,
                        ]);
                    }
                }
            }

            return $customer;
        });
    }

    public function update(string $idCustomers, array $data)
    {
        return DB::transaction(function () use ($idCustomers, $data) {
            $customer = Customer::find($idCustomers);
            if (!$customer) return null;

            $customer->nm_customers = $data['nm_customers'];
            $customer->customers_address = $data['customers_address'];
            $customer->customers_address_invoice = $data['customers_address_invoice'];
            $customer->customers_phone = $data['customers_phone'] ?? null;
            $customer->customers_mobile = $data['customers_mobile'] ?? null;
            $customer->customers_email = $data['customers_email'] ?? null;
            $customer->customers_fax = $data['customers_fax'] ?? null;
            $customer->provinsi = $data['provinsi'];
            $customer->kabupaten = $data['kabupaten'];

            $customer->f_company = $data['f_company'] ?? false;
            $customer->nama_lengkap = $data['f_company'] ? ($data['nama_lengkap'] ?? null) : $data['nm_customers'];
            $customer->nik = $data['f_company'] ? null : ($data['nik'] ?? null);
            $customer->nib = $data['f_company'] ? ($data['nib'] ?? null) : null;
            $customer->npwp = $data['f_company'] ? ($data['npwp'] ?? null) : null;
            $customer->alamat = $data['alamat'] ?? null;
            $customer->is_blacklist = $data['is_blacklist'] ?? false;
            $customer->is_external_sales = $data['is_external_sales'] ?? false;
            
            $customer->date_update = Carbon::now();
            $customer->save();

            // Replace contacts
            CustomerContact::where('id_customers', $idCustomers)->delete();
            if (isset($data['contacts']) && is_array($data['contacts'])) {
                foreach ($data['contacts'] as $contactData) {
                    if (!empty($contactData['nm_customers_contact'])) {
                        CustomerContact::create([
                            'id_customers' => $idCustomers,
                            'nm_customers_contact' => $contactData['nm_customers_contact'],
                            'customers_contact_posisi' => $contactData['customers_contact_posisi'] ?? null,
                            'customers_contact_phone' => $contactData['customers_contact_phone'] ?? null,
                            'customers_contact_email' => $contactData['customers_contact_email'] ?? null,
                        ]);
                    }
                }
            }

            return $customer;
        });
    }
}
