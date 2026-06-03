<?php

namespace App\Actions\logbookproduct;

use App\Models\logbookproduct\LogBookProduct;

class UpdateLogBookProductAction
{
    /**
     * Execute the action to update an existing Log Book Product.
     */
    public function execute(LogBookProduct $logBookProduct, array $data): LogBookProduct
    {
        $logBookProduct->update([
            'id_product' => $data['id_product'] ?? $logBookProduct->id_product,
            'id_type_kerusakan' => $data['id_type_kerusakan'] ?? $logBookProduct->id_type_kerusakan,
            'date_log_book' => $data['date_log_book'] ?? $logBookProduct->date_log_book,
            'masalah' => array_key_exists('masalah', $data) ? $data['masalah'] : $logBookProduct->masalah,
            'solusi' => array_key_exists('solusi', $data) ? $data['solusi'] : $logBookProduct->solusi,
            'catatan' => array_key_exists('catatan', $data) ? $data['catatan'] : $logBookProduct->catatan,
        ]);

        return $logBookProduct;
    }
}
