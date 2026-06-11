<?php

namespace App\Actions\suppliers;

use App\Models\suppliers\Supplier;
use Illuminate\Support\Facades\DB;

class DeleteSupplierAction
{
    public function execute($id): bool
    {
        return DB::transaction(function () use ($id) {
            $supplier = Supplier::find($id);
            
            if (!$supplier) {
                return false;
            }

            // Delete associated contacts first (if not cascading in DB)
            $supplier->contacts()->delete();
            
            return $supplier->delete();
        });
    }
}
