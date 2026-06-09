<?php

namespace App\Actions\productunit;

use App\Models\productunit\ProductUnit;
use Illuminate\Support\Carbon;

class DeleteProductUnitAction
{
    /**
     * Hard delete since soft delete columns do not exist.
     */
    public function execute(string $idProductSatuan): bool
    {
        $unit = ProductUnit::find($idProductSatuan);
        if (!$unit) {
            return false;
        }

        return $unit->delete();
    }
}
