<?php

namespace App\Helpers\productpricemkt;

class KursHelper
{
    /**
     * Get the USD to IDR exchange rate.
     */
    public static function getKursUsd()
    {
        // Placeholder for real DB fetching or API call
        if (function_exists('kurs_usd')) {
            return kurs_usd();
        }
        return 15000;
    }

    /**
     * Round the exchange rate.
     */
    public static function roundKurs($amount)
    {
        if (function_exists('pembulatan_kurs')) {
            return pembulatan_kurs($amount);
        }
        return round($amount, -2); // Round to nearest 100
    }
}
