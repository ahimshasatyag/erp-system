<?php

namespace App\Services\productprice;

use App\Repositories\productprice\ProductPriceRepositoryInterface;
use App\Actions\productprice\StoreProductPriceAction;
use App\Actions\productprice\CheckProductPriceReqAction;
use Illuminate\Support\Facades\DB;

class ProductPriceService
{
    protected $repository;
    protected $storeAction;
    protected $checkReqAction;

    public function __construct(
        ProductPriceRepositoryInterface $repository,
        StoreProductPriceAction $storeAction,
        CheckProductPriceReqAction $checkReqAction
    ) {
        $this->repository = $repository;
        $this->storeAction = $storeAction;
        $this->checkReqAction = $checkReqAction;
    }

    public function storeMultiple(array $items, $username)
    {
        DB::transaction(function () use ($items, $username) {
            foreach ($items as $item) {
                if (!empty($item['id_product'])) {
                    $this->storeAction->execute($item, $username);
                }
            }
        });
    }

    public function updateSingle($id_product, array $data, array $optionsData, $username)
    {
        return DB::transaction(function () use ($id_product, $data, $optionsData, $username) {
            
            $existing = $this->repository->findDetail($id_product);
            
            $product_price = str_replace(',', '', $data['product_price'] ?? 0);
            $product_price_agent = str_replace(',', '', $data['product_price_agent'] ?? 0);
            $kurs_bank = str_replace(',', '', $data['kurs_bank'] ?? 0);
            $delivery_term = $data['delivery_term'] ?? '';

            $priceData = [
                'product_price' => $product_price,
                'product_price_agent' => $product_price_agent,
                'kurs_bank' => $kurs_bank,
                'delivery_term' => $delivery_term,
                'username' => $username,
                'date_update' => current_datetime()
            ];

            $perubahan = false;

            if ($existing) {
                // Check if changed
                if ($existing->product_price != $product_price || 
                    $existing->product_price_agent != $product_price_agent || 
                    $existing->delivery_term != $delivery_term) {
                    
                    $perubahan = true;
                    $this->repository->update($id_product, $priceData);
                    $this->checkReqAction->execute($id_product);
                }
            }

            foreach ($optionsData as $opt) {
                $id_opt = $opt['id_product_price_opt'];
                $amount = str_replace(',', '', $opt['amount'] ?? 0);
                
                $dbOpt = \App\Models\products\ProductPriceOpt::find($id_opt);
                if ($dbOpt && $dbOpt->amount != $amount) {
                    $perubahan = true;
                    $this->repository->updateOption($id_opt, $amount);
                }
            }

            return $perubahan;
        });
    }

    public function delete($id)
    {
        DB::transaction(function () use ($id) {
            $this->repository->delete($id);
        });
    }
}
