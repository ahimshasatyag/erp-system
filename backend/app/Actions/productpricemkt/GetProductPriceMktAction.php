<?php

namespace App\Actions\productpricemkt;

use App\Services\productpricemkt\ProductPriceMktService;

class GetProductPriceMktAction
{
    protected $service;

    public function __construct(ProductPriceMktService $service)
    {
        $this->service = $service;
    }

    public function execute()
    {
        return $this->service->getList();
    }
}
