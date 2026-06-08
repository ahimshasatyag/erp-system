<?php

namespace App\Actions\productsubcategory;

use App\Services\productsubcategory\ProductSubCategoryService;

class CreateProductSubCategoryAction
{
    protected $service;

    public function __construct(ProductSubCategoryService $service)
    {
        $this->service = $service;
    }

    public function execute(array $data)
    {
        // Any additional cross-domain validation or business rules can go here
        return $this->service->createProductSubCategory($data);
    }
}
