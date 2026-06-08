<?php

namespace App\Repositories\productcategory;

interface ProductCategoryRepositoryInterface
{
    public function getDatatable($request);
    public function findById(string $id);
    public function create(array $data);
    public function update(string $id, array $data);
    public function delete(string $id);
}
