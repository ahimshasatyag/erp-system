<?php

namespace App\Repositories\suppliers;

use App\Models\suppliers\Supplier;

class SupplierRepository implements SupplierRepositoryInterface
{
    public function getDatatable($request)
    {
        $query = Supplier::query();

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nm_suppliers', 'ILIKE', "%{$search}%")
                  ->orWhere('suppliers_phone', 'ILIKE', "%{$search}%")
                  ->orWhere('suppliers_email', 'ILIKE', "%{$search}%")
                  ->orWhere('suppliers_address', 'ILIKE', "%{$search}%");
            });
        }

        $sortBy = $request->get('sort_by', 'date_create');
        $sortDir = $request->get('sort_dir', 'desc');
        
        $query->orderBy($sortBy, $sortDir);

        $perPage = $request->get('per_page', 10);
        return $query->paginate($perPage);
    }

    public function findById($id)
    {
        return Supplier::with('contacts')->find($id);
    }

    public function create(array $data)
    {
        return Supplier::create($data);
    }

    public function update($id, array $data)
    {
        $supplier = Supplier::find($id);
        if ($supplier) {
            $supplier->update($data);
            return $supplier;
        }
        return null;
    }

    public function delete($id)
    {
        $supplier = Supplier::find($id);
        if ($supplier) {
            return $supplier->delete();
        }
        return false;
    }
}
