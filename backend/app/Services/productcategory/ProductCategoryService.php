<?php

namespace App\Services\productcategory;

use App\Repositories\productcategory\ProductCategoryRepositoryInterface;
use Illuminate\Support\Facades\DB;
use App\Models\productcategory\ProductCategory;

class ProductCategoryService
{
    protected $repository;

    public function __construct(ProductCategoryRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function createCategory(array $data)
    {
        return DB::transaction(function () use ($data) {
            // Legacy code uses: runningnumber('id_product_kategori')
            // Mocking the generation here. In a real scenario, use actual logic/helper.
            $nextId = $this->generateNextId();
            
            $kodeProductKategori = str_pad((string)$nextId, 3, "0", STR_PAD_LEFT);

            $data['id_product_kategori'] = $nextId;
            $data['kode_product_kategori'] = $kodeProductKategori;
            
            // date_create handled automatically by Eloquent CREATED_AT or add here
            // $data['date_create'] = now();

            return $this->repository->create($data);
        });
    }

    public function updateCategory(string $id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            return $this->repository->update($id, $data);
        });
    }

    /**
     * Simulated running number generator
     */
    private function generateNextId()
    {
        // Simple logic: get max numeric part of ID if IDs are numeric, or use auto-increment alternative
        $maxId = ProductCategory::max('id_product_kategori');
        $nextNum = intval($maxId) + 1;
        return (string)$nextNum;
    }
}
