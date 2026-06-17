<?php

namespace App\Repositories\productprice;

use Illuminate\Http\Request;

interface ProductPriceRepositoryInterface
{
    public function getDatatable(Request $request);
    public function getAvailableProducts();
    public function findById($id);
    public function findDetail($id);
    public function create(array $data);
    public function update($id, array $data);
    public function updateOption($id_opt, $amount);
    public function delete($id); // soft delete / change status
    public function getHistory($id);
    public function getLatestHistoryPrice($id);
    public function getOptions($id);
    public function checkProduct($code);
}
