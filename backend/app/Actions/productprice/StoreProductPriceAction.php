<?php

namespace App\Actions\productprice;

use App\Repositories\productprice\ProductPriceRepositoryInterface;

class StoreProductPriceAction
{
    protected $repository;
    protected $checkReqAction;

    public function __construct(ProductPriceRepositoryInterface $repository, CheckProductPriceReqAction $checkReqAction)
    {
        $this->repository = $repository;
        $this->checkReqAction = $checkReqAction;
    }

    public function execute(array $data, $username)
    {
        $id_product = $data['id_product'];
        $product_price = str_replace(',', '', $data['product_price'] ?? 0);
        $product_price_agent = str_replace(',', '', $data['product_price_agent'] ?? 0);
        $kurs_bank = str_replace(',', '', $data['kurs_bank'] ?? 0);
        $delivery_term = $data['delivery_term'] ?? '';

        $existing = $this->repository->findDetail($id_product);
        
        $date = current_datetime(); // assuming helper exists
        
        $priceData = [
            'id_product' => $id_product,
            'product_price' => $product_price,
            'product_price_agent' => $product_price_agent,
            'kurs_bank' => $kurs_bank,
            'delivery_term' => $delivery_term,
            'username' => $username,
            'date_update' => $date
        ];

        if (!$existing) {
            $priceData['date_create'] = $date;
            $this->repository->create($priceData);
        } else {
            $this->repository->update($id_product, $priceData);
        }

        $this->checkReqAction->execute($id_product);

        return $id_product;
    }
}
