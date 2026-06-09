<?php

namespace App\Actions\productbrand;

use App\Models\productbrand\ProductBrand;

class DeleteProductBrandAction
{
    /**
     * Hard delete since soft delete columns do not exist.
     */
    public function execute(string $idProductBrand): bool
    {
        $brand = ProductBrand::find($idProductBrand);
        if (!$brand) {
            return false;
        }

        return $brand->delete();
    }
}
