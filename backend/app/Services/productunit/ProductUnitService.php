<?php

namespace App\Services\productunit;

use App\Repositories\productunit\ProductUnitRepositoryInterface;
use Illuminate\Support\Facades\DB;
use App\Models\productunit\ProductUnit;

class ProductUnitService
{
    protected $repository;

    public function __construct(ProductUnitRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function createUnit(array $data)
    {
        return DB::transaction(function () use ($data) {
            // Check if ID is provided, else generate one. 
            // Cform.php: $id_product_satuan = runningnumber('id_product_satuan');
            // Assuming generating a short numeric ID if not provided.
            if (!isset($data['id_product_satuan']) || empty($data['id_product_satuan'])) {
                $data['id_product_satuan'] = $this->generateNextId();
            }

            return $this->repository->create($data);
        });
    }

    public function updateUnit(string $id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            return $this->repository->update($id, $data);
        });
    }

    private function generateNextId()
    {
        $maxId = ProductUnit::max('id_product_satuan');
        $nextNum = intval($maxId) + 1;
        return (string)$nextNum;
    }
}
