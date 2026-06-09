<?php

namespace App\Repositories\customers;

use App\Models\customers\Customer;
use Illuminate\Support\Facades\DB;

class CustomerRepository implements CustomerRepositoryInterface
{
    public function getDatatable($request)
    {
        $query = Customer::query()
            ->leftJoin('m_provinsi', 'm_customers.provinsi', '=', 'm_provinsi.id')
            ->leftJoin('m_kota', 'm_customers.kabupaten', '=', 'm_kota.id')
            ->leftJoin(DB::raw('(SELECT id_customers, COUNT(id_so) AS jumlah_so FROM tb_so_hdr GROUP BY id_customers) as so'), 'm_customers.id_customers', '=', 'so.id_customers')
            ->select(
                'm_customers.*', 
                'm_provinsi.nama as provinsi_name', 
                'm_kota.nama_kabupaten as kabupaten_name',
                DB::raw('COALESCE(so.jumlah_so, 0) as jumlah_so')
            );

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('m_customers.code_customers', 'ILIKE', "%{$search}%")
                  ->orWhere('m_customers.nm_customers', 'ILIKE', "%{$search}%")
                  ->orWhere('m_customers.customers_phone', 'ILIKE', "%{$search}%");
            });
        }

        $sortBy = $request->get('sort_by', 'date_create');
        if ($sortBy == 'provinsi') $sortBy = 'provinsi_name';
        if ($sortBy == 'kabupaten') $sortBy = 'kabupaten_name';

        $sortDir = $request->get('sort_dir', 'desc');
        
        $query->orderBy($sortBy, $sortDir);

        $perPage = $request->get('per_page', 10);
        return $query->paginate($perPage);
    }

    public function findById(string $idCustomers)
    {
        return Customer::with('contacts')->find($idCustomers);
    }

    public function getProvinces()
    {
        return DB::table('m_provinsi')->get();
    }

    public function getKabupatenByProvinsi(string $provinsiId)
    {
        return DB::table('m_kota')->where('kode_provinsi', $provinsiId)->get();
    }
}
