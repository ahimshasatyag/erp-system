<?php

namespace App\Repositories\productbrand;

interface ProductBrandRepositoryInterface
{
    public function getDatatable($request);
    public function findById(string $idProductBrand);
}
