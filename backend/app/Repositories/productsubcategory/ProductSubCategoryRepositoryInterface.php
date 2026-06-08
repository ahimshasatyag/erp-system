<?php

namespace App\Repositories\productsubcategory;

interface ProductSubCategoryRepositoryInterface
{
    public function getDatatable($request);
    public function getAll();
    public function findById($id);
    public function create(array $data);
    public function update($id, array $data);
    public function delete($id);
    public function generateNewId();
}
