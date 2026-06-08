<?php

namespace App\Actions\productsubcategory;

use App\Repositories\productsubcategory\ProductSubCategoryRepositoryInterface;

class DeleteProductSubCategoryAction
{
    protected $repository;

    public function __construct(ProductSubCategoryRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function execute($id)
    {
        return $this->repository->delete($id);
    }
}
