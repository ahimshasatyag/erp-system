<?php

namespace App\Services\productbrand;

use App\Models\productbrand\ProductBrand;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ProductBrandService
{
    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            // Replicate the runningnumber('id_product_brand') logic.
            // A simple implementation or adjust to exact legacy needs if there's a custom DB function.
            $lastId = DB::table('m_product_brand')
                        ->orderBy('id_product_brand', 'desc')
                        ->first();
            
            $newId = $lastId ? (int) $lastId->id_product_brand + 1 : 1;
            // Pad if necessary (e.g., BR001), but legacy was passing directly from runningnumber()

            $brand = new ProductBrand();
            $brand->id_product_brand = (string) $newId;
            $brand->nm_product_brand = $data['nm_product_brand'];
            $brand->date_create = Carbon::now();
            $brand->save();

            return $brand;
        });
    }

    public function update(string $idProductBrand, array $data)
    {
        $brand = ProductBrand::find($idProductBrand);
        if (!$brand) return null;

        $brand->nm_product_brand = $data['nm_product_brand'];
        $brand->date_update = Carbon::now();
        $brand->save();

        return $brand;
    }
}
