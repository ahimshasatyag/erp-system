<?php

namespace App\Actions\productsubcategory;

use App\Services\productsubcategory\ProductSubCategoryService;

class UpdateProductSubCategoryAction
{
    protected $service;

    public function __construct(ProductSubCategoryService $service)
    {
        $this->service = $service;
    }

    public function execute($id, array $data)
    {
        // Any additional cross-domain validation or business rules can go here
        return $this->service->updateProductSubCategory($id, $data);
    }
}
