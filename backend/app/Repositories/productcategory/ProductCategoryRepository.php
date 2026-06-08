<?php

namespace App\Repositories\productcategory;

use App\Models\productcategory\ProductCategory;

class ProductCategoryRepository implements ProductCategoryRepositoryInterface
{
    public function getDatatable($request)
    {
        $query = ProductCategory::query();

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('kode_product_kategori', 'ilike', "%{$search}%")
                  ->orWhere('nm_product_kategori', 'ilike', "%{$search}%");
            });
        }

        return $query->paginate($request->input('per_page', 10));
    }

    public function findById(string $id)
    {
        return ProductCategory::find($id);
    }

    public function create(array $data)
    {
        return ProductCategory::create($data);
    }

    public function update(string $id, array $data)
    {
        $category = ProductCategory::findOrFail($id);
        $category->update($data);
        return $category;
    }

    public function delete($id)
    {
        $category = $this->findById($id);
        if ($category) {
            return $category->delete();
        }
        return false;
    }
}
