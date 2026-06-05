<?php

namespace App\Repositories\products;

interface ProductRepositoryInterface
{
    public function getDatatable($request);
    public function findById($id);
    public function create(array $data);
    public function update($id, array $data);
    public function changeStatus($id, $status);
    public function findByCode($code, $excludeId = null);
    public function getCategories();
    public function getSubCategories($categoryId = null);
    public function getBrands();
    public function getUnits();
    public function searchBrand($keyword);
    public function createBrand($id, $name);
    public function findBrandByName($name);
}
