<?php

namespace App\Services\productsubcategory;

use App\Repositories\productsubcategory\ProductSubCategoryRepositoryInterface;

class ProductSubCategoryService
{
    protected $repository;

    public function __construct(ProductSubCategoryRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function createProductSubCategory(array $data)
    {
        $newId = $this->repository->generateNewId();
        
        $data['id_product_sub_kategori'] = $newId;
        $data['kode_product_sub_kategori'] = $newId;
        $data['date_create'] = \Illuminate\Support\Carbon::now();
        
        return $this->repository->create($data);
    }

    public function updateProductSubCategory($id, array $data)
    {
        $data['date_update'] = \Illuminate\Support\Carbon::now();
        return $this->repository->update($id, $data);
    }
}
