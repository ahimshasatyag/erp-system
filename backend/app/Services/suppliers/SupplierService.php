<?php

namespace App\Services\suppliers;

use App\Models\suppliers\Supplier;
use App\Models\suppliers\SupplierContact;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class SupplierService
{
    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            // ID generation logic replicating runningnumber('id_suppliers')
            $lastId = DB::table('m_suppliers')->orderBy('id_suppliers', 'desc')->first();
            $newId = $lastId ? (int) $lastId->id_suppliers + 1 : 1;
            $strId = (string) $newId;

            $supplier = new Supplier();
            $supplier->id_suppliers = $strId;
            $supplier->nm_suppliers = $data['nm_suppliers'];
            $supplier->suppliers_mobile = $data['suppliers_mobile'] ?? null;
            $supplier->suppliers_email = $data['suppliers_email'] ?? null;
            $supplier->suppliers_address = $data['suppliers_address'] ?? null;
            $supplier->suppliers_phone = $data['suppliers_phone'] ?? null;
            $supplier->suppliers_fax = $data['suppliers_fax'] ?? null;
            $supplier->suppliers_website = $data['suppliers_website'] ?? null;
            $supplier->id_mata_uang = $data['id_mata_uang'] ?? null;

            if (isset($data['file'])) {
                // Mimic the legacy upload to assets/upload
                $file = $data['file'];
                $filename = time() . '_' . $file->hashName();
                $file->move(public_path('assets/upload'), $filename);
                $supplier->suppliers_logo = $filename;
            }

            $supplier->date_create = Carbon::now();
            $supplier->save();

            if (isset($data['contacts']) && is_array($data['contacts'])) {
                foreach ($data['contacts'] as $contactData) {
                    if (!empty($contactData['nm_suppliers_contact'])) {
                        SupplierContact::create([
                            'id_suppliers' => $strId,
                            'nm_suppliers_contact' => $contactData['nm_suppliers_contact'],
                            'suppliers_contact_posisi' => $contactData['suppliers_contact_posisi'] ?? null,
                            'suppliers_contact_phone' => $contactData['suppliers_contact_phone'] ?? null,
                            'suppliers_contact_email' => $contactData['suppliers_contact_email'] ?? null,
                        ]);
                    }
                }
            }

            return $supplier;
        });
    }

    public function update(string $idSuppliers, array $data)
    {
        return DB::transaction(function () use ($idSuppliers, $data) {
            $supplier = Supplier::find($idSuppliers);
            if (!$supplier) return null;

            $supplier->nm_suppliers = $data['nm_suppliers'];
            $supplier->suppliers_mobile = $data['suppliers_mobile'] ?? null;
            $supplier->suppliers_email = $data['suppliers_email'] ?? null;
            $supplier->suppliers_address = $data['suppliers_address'] ?? null;
            $supplier->suppliers_phone = $data['suppliers_phone'] ?? null;
            $supplier->suppliers_fax = $data['suppliers_fax'] ?? null;
            $supplier->suppliers_website = $data['suppliers_website'] ?? null;
            $supplier->id_mata_uang = $data['id_mata_uang'] ?? null;

            if (isset($data['file'])) {
                $file = $data['file'];
                $filename = time() . '_' . $file->hashName();
                $file->move(public_path('assets/upload'), $filename);
                $supplier->suppliers_logo = $filename;
            }

            $supplier->date_update = Carbon::now();
            $supplier->save();

            // Replace contacts
            SupplierContact::where('id_suppliers', $idSuppliers)->delete();
            if (isset($data['contacts']) && is_array($data['contacts'])) {
                foreach ($data['contacts'] as $contactData) {
                    if (!empty($contactData['nm_suppliers_contact'])) {
                        SupplierContact::create([
                            'id_suppliers' => $idSuppliers,
                            'nm_suppliers_contact' => $contactData['nm_suppliers_contact'],
                            'suppliers_contact_posisi' => $contactData['suppliers_contact_posisi'] ?? null,
                            'suppliers_contact_phone' => $contactData['suppliers_contact_phone'] ?? null,
                            'suppliers_contact_email' => $contactData['suppliers_contact_email'] ?? null,
                        ]);
                    }
                }
            }

            return $supplier;
        });
    }
}
