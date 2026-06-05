<?php

namespace App\Helpers\products;

use Illuminate\Support\Str;

class ProductHelper
{
    /**
     * Helper to generate a running number (placeholder).
     * Replaces the CodeIgniter `runningnumber('id_product')`.
     *
     * @param string $type
     * @return string
     */
    public static function runningNumber(string $type): string
    {
        // TODO: Implement your actual running number logic here.
        // For now, generating a unique string.
        return 'PRD' . strtoupper(Str::random(8));
    }
}
