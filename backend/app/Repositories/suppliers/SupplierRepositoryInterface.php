<?php

namespace App\Repositories\suppliers;

interface SupplierRepositoryInterface
{
    public function getDatatable($request);
    public function findById($id);
    public function create(array $data);
    public function update($id, array $data);
    public function delete($id);
}
