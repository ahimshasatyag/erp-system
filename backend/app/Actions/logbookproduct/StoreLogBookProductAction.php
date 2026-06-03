<?php

namespace App\Actions\logbookproduct;

use App\Models\logbookproduct\LogBookProduct;

class StoreLogBookProductAction
{
    /**
     * Execute the action to store a new Log Book Product.
     */
    public function execute(array $data): LogBookProduct
    {
        // $data should be validated by the Form Request beforehand
        return LogBookProduct::create([
            'id_product' => $data['id_product'],
            'id_type_kerusakan' => $data['id_type_kerusakan'],
            'date_log_book' => $data['date_log_book'],
            'masalah' => $data['masalah'] ?? null,
            'solusi' => $data['solusi'] ?? null,
            'catatan' => $data['catatan'] ?? null,
            // 'username' will be handled by UserSignature trait automatically if logged in
        ]);
    }
}
