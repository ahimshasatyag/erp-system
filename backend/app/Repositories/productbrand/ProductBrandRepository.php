<?php

namespace App\Repositories\productbrand;

use App\Models\productbrand\ProductBrand;

class ProductBrandRepository implements ProductBrandRepositoryInterface
{
    public function getDatatable($request)
    {
        $query = ProductBrand::query();

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('id_product_brand', 'ILIKE', "%{$search}%")
                  ->orWhere('nm_product_brand', 'ILIKE', "%{$search}%");
            });
        }

        $sortBy = $request->get('sort_by', 'date_create');
        $sortDir = $request->get('sort_dir', 'desc');
        
        $query->orderBy($sortBy, $sortDir);

        $perPage = $request->get('per_page', 10);
        return $query->paginate($perPage);
    }

    public function findById(string $idProductBrand)
    {
        return ProductBrand::find($idProductBrand);
    }
}
