<?php

namespace App\Repositories\products;

use App\Models\products\Product;
use App\Models\productcategory\ProductCategory;
use App\Models\productsubcategory\ProductSubCategory;
use App\Models\productbrand\ProductBrand;
use App\Models\productunit\ProductUnit;

class ProductRepository implements ProductRepositoryInterface
{
    public function getDatatable($request)
    {
        $query = Product::with(['category', 'subCategory', 'unit', 'brand']);

        if ($request->has('search.value') && !empty($request->input('search.value'))) {
            $searchValue = strtoupper($request->input('search.value'));
            $words = explode(',', $searchValue);

            $query->where(function ($q) use ($words) {
                foreach ($words as $word) {
                    $word = trim($word);
                    $q->orWhereRaw("UPPER(code_product) like ?", ["%{$word}%"])
                      ->orWhereRaw("UPPER(nm_product) like ?", ["%{$word}%"])
                      ->orWhereHas('category', function ($subQ) use ($word) {
                          $subQ->whereRaw("UPPER(nm_product_kategori) like ?", ["%{$word}%"]);
                      })
                      ->orWhereHas('subCategory', function ($subQ) use ($word) {
                          $subQ->whereRaw("UPPER(nm_product_sub_kategori) like ?", ["%{$word}%"]);
                      })
                      ->orWhereHas('unit', function ($subQ) use ($word) {
                          $subQ->whereRaw("UPPER(nm_product_satuan) like ?", ["%{$word}%"]);
                      })
                      ->orWhereHas('brand', function ($subQ) use ($word) {
                          $subQ->whereRaw("UPPER(nm_product_brand) like ?", ["%{$word}%"]);
                      });
                }
            });
        }

        // Handle sorting
        $sortBy = $request->input('sort_by', 'date_create');
        $sortDir = $request->input('sort_dir', 'desc');
        $allowedSorts = ['code_product', 'nm_product', 'flag_active', 'date_create', 'link_brosur'];
        
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy('m_product.' . $sortBy, $sortDir === 'asc' ? 'asc' : 'desc');
        } elseif ($sortBy === 'category') {
            $query->leftJoin('m_product_kategori', 'm_product.id_product_kategori', '=', 'm_product_kategori.id_product_kategori')
                  ->orderBy('m_product_kategori.nm_product_kategori', $sortDir === 'asc' ? 'asc' : 'desc')
                  ->select('m_product.*');
        } elseif ($sortBy === 'sub_category') {
            $query->leftJoin('m_product_sub_kategori', 'm_product.id_product_sub_kategori', '=', 'm_product_sub_kategori.id_product_sub_kategori')
                  ->orderBy('m_product_sub_kategori.nm_product_sub_kategori', $sortDir === 'asc' ? 'asc' : 'desc')
                  ->select('m_product.*');
        } elseif ($sortBy === 'unit') {
            $query->leftJoin('m_product_satuan', 'm_product.id_product_satuan', '=', 'm_product_satuan.id_product_satuan')
                  ->orderBy('m_product_satuan.nm_product_satuan', $sortDir === 'asc' ? 'asc' : 'desc')
                  ->select('m_product.*');
        } elseif ($sortBy === 'brand') {
            $query->leftJoin('m_product_brand', 'm_product.id_product_brand', '=', 'm_product_brand.id_product_brand')
                  ->orderBy('m_product_brand.nm_product_brand', $sortDir === 'asc' ? 'asc' : 'desc')
                  ->select('m_product.*');
        } else {
            $query->orderBy('m_product.date_create', 'desc');
        }

        // Add a secondary deterministic sort to prevent pagination shuffling on duplicate values
        if ($sortBy !== 'date_create') {
            $query->orderBy('m_product.date_create', 'desc');
        }

        $length = $request->input('length', 10);
        return $query->paginate($length);
    }

    public function findById($id)
    {
        return Product::with(['options', 'category', 'subCategory', 'unit', 'brand'])->find($id);
    }

    public function create(array $data)
    {
        return Product::create($data);
    }

    public function update($id, array $data)
    {
        $product = Product::findOrFail($id);
        $product->update($data);
        return $product;
    }

    public function changeStatus($id, $status)
    {
        $product = Product::findOrFail($id);
        $product->flag_active = $status;
        $product->save();
        return $product;
    }

    public function findByCode($code, $excludeId = null)
    {
        $query = Product::where('code_product', $code);
        if ($excludeId) {
            $query->where('id_product', '!=', $excludeId);
        }
        return $query->first();
    }

    public function getCategories()
    {
        return ProductCategory::all();
    }

    public function getSubCategories($categoryId = null)
    {
        $query = ProductSubCategory::query();
        if ($categoryId) {
            $query->where('id_product_kategori', $categoryId);
        }
        return $query->get();
    }

    public function getBrands()
    {
        return ProductBrand::all();
    }

    public function getUnits()
    {
        return ProductUnit::all();
    }

    public function searchBrand($keyword)
    {
        $keyword = strtoupper($keyword);
        return ProductBrand::whereRaw("UPPER(nm_product_brand) like ?", ["%{$keyword}%"])
            ->orderBy('nm_product_brand', 'asc')
            ->limit(10)
            ->get();
    }

    public function createBrand($id, $name)
    {
        return ProductBrand::create([
            'id_product_brand' => strtoupper($id),
            'nm_product_brand' => strtoupper($name),
        ]);
    }

    public function findBrandByName($name)
    {
        $name = strtoupper($name);
        return ProductBrand::whereRaw("UPPER(nm_product_brand) = ?", [$name])->first();
    }
}
