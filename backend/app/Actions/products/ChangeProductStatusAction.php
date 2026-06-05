<?php

namespace App\Actions\products;

use App\Repositories\products\ProductRepositoryInterface;
use Illuminate\Support\Facades\DB;

class ChangeProductStatusAction
{
    protected $productRepository;

    public function __construct(ProductRepositoryInterface $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function execute(array $productIds, $status)
    {
        DB::transaction(function () use ($productIds, $status) {
            foreach ($productIds as $id) {
                $this->productRepository->changeStatus($id, $status);

                // Assuming m_product_price logic exists elsewhere, we update it raw or via another repo
                DB::table('m_product_price')
                    ->where('id_product', $id)
                    ->update(['flag_active' => $status]);
            }
        });
    }
}
