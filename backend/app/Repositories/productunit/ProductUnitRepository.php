<?php

namespace App\Repositories\productunit;

use App\Models\productunit\ProductUnit;

class ProductUnitRepository implements ProductUnitRepositoryInterface
{
    public function getDatatable($request)
    {
        $query = ProductUnit::query();

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('id_product_satuan', 'ilike', "%{$search}%")
                  ->orWhere('nm_product_satuan', 'ilike', "%{$search}%");
            });
        }

        return $query->paginate($request->input('per_page', 10));
    }

    public function findById(string $id)
    {
        return ProductUnit::find($id);
    }

    public function create(array $data)
    {
        return ProductUnit::create($data);
    }

    public function update(string $id, array $data)
    {
        $unit = ProductUnit::findOrFail($id);
        $unit->update($data);
        return $unit;
    }

    public function delete($id)
    {
        $unit = $this->findById($id);
        if ($unit) {
            return $unit->delete();
        }
        return false;
    }
}
