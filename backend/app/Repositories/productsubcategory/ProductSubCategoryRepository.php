<?php

namespace App\Repositories\productsubcategory;

use App\Models\productsubcategory\ProductSubCategory;
use Illuminate\Support\Facades\DB;

class ProductSubCategoryRepository implements ProductSubCategoryRepositoryInterface
{
    public function getDatatable($request)
    {
        $query = ProductSubCategory::with('category');

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('kode_product_sub_kategori', 'ilike', "%{$search}%")
                  ->orWhere('nm_product_sub_kategori', 'ilike', "%{$search}%")
                  ->orWhereHas('category', function ($q) use ($search) {
                      $q->where('nm_product_kategori', 'ilike', "%{$search}%");
                  });
            });
        }

        return $query->paginate($request->input('per_page', 10));
    }

    public function getAll()
    {
        return ProductSubCategory::all();
    }

    public function findById($id)
    {
        return ProductSubCategory::where('id_product_sub_kategori', $id)->first();
    }

    public function create(array $data)
    {
        return ProductSubCategory::create($data);
    }

    public function update($id, array $data)
    {
        $category = ProductSubCategory::findOrFail($id);
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

    public function generateNewId()
    {
        // Legacy code:
        // $id_product_sub_kategori = runningnumber('id_product_sub_kategori');
        // Because runningnumber is a database function in legacy system, we might need a fallback or DB call
        // For standard translation, we can just fetch max id and increment.
        $maxId = DB::table('m_product_sub_kategori')->max('id_product_sub_kategori');
        $nextIdNumber = $maxId ? ((int)$maxId) + 1 : 1;
        return str_pad($nextIdNumber, 5, '0', STR_PAD_LEFT);
    }
}
