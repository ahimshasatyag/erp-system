<?php

namespace App\Repositories\customercontact;

use App\Models\customercontact\CustomerContact;
use App\Models\customers\Customer;
use Illuminate\Support\Facades\DB;

class CustomerContactRepository implements CustomerContactRepositoryInterface
{
    public function getDatatable($request)
    {
        $query = CustomerContact::with('customer');

        if ($request->has('search.value') && !empty($request->input('search.value'))) {
            $searchValue = strtoupper($request->input('search.value'));
            $words = explode(',', $searchValue);

            $query->where(function ($q) use ($words) {
                foreach ($words as $word) {
                    $word = trim($word);
                    $q->orWhereRaw("UPPER(nm_customers_contact) like ?", ["%{$word}%"])
                      ->orWhereRaw("UPPER(customers_contact_posisi) like ?", ["%{$word}%"])
                      ->orWhereRaw("UPPER(customers_contact_phone) like ?", ["%{$word}%"])
                      ->orWhereHas('customer', function ($subQ) use ($word) {
                          $subQ->whereRaw("UPPER(nm_customers) like ?", ["%{$word}%"]);
                      });
                }
            });
        }

        // Handle sorting
        $sortBy = $request->input('sort_by', 'id_customers_contact');
        $sortDir = $request->input('sort_dir', 'desc');
        
        $allowedSorts = ['nm_customers_contact', 'customers_contact_posisi', 'customers_contact_phone', 'id_customers_contact'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy('m_customers_contact.' . $sortBy, $sortDir === 'asc' ? 'asc' : 'desc');
        } elseif ($sortBy === 'customer') {
            $query->leftJoin('m_customers', 'm_customers_contact.id_customers', '=', 'm_customers.id_customers')
                  ->orderBy('m_customers.nm_customers', $sortDir === 'asc' ? 'asc' : 'desc')
                  ->select('m_customers_contact.*');
        } else {
            $query->orderBy('m_customers_contact.id_customers_contact', 'desc');
        }

        $length = $request->input('length', 10);
        return $query->paginate($length);
    }

    public function create(array $data)
    {
        return CustomerContact::create($data);
    }

    public function update($id, array $data)
    {
        $contact = CustomerContact::findOrFail($id);
        $contact->update($data);
        return $contact;
    }

    public function delete($id)
    {
        $contact = CustomerContact::findOrFail($id);
        return $contact->delete();
    }

    public function findById($id)
    {
        return CustomerContact::with('customer')->find($id);
    }

    public function getCustomers()
    {
        return Customer::all();
    }
}
