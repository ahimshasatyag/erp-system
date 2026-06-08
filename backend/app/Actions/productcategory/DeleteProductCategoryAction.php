<?php

namespace App\Actions\productcategory;

use App\Models\productcategory\ProductCategory;
use Illuminate\Support\Carbon;

class DeleteProductCategoryAction
{
    /**
     * Soft delete equivalent based on legacy code.
     * Updates f_karyawan_divisi_cancel to 't' and sets d_updatedate.
     */
    public function execute(string $idProductKategori): bool
    {
        $category = ProductCategory::find($idProductKategori);
        if (!$category) {
            return false;
        }

        $category->f_karyawan_divisi_cancel = 't';
        $category->d_updatedate = Carbon::now();
        return $category->save();
    }
}
