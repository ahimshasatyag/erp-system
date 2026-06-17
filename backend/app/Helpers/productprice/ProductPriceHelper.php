<?php

namespace App\Helpers\productprice;

class ProductPriceHelper
{
    public static function formatPrice($price)
    {
        return "USD " . number_format($price);
    }

    public static function formatIDR($price)
    {
        return "RP " . number_format($price);
    }

    public static function calculateEstimationIDR($price_usd, $kurs)
    {
        // Equivalent to bulatkanKeAtas1JT in CI but simplified if helper missing
        $estimation = $price_usd * $kurs;
        if(function_exists('bulatkanKeAtas1JT')){
            $estimation = bulatkanKeAtas1JT($estimation);
        }
        return self::formatIDR($estimation);
    }

    public static function isNewPrice($date)
    {
        if(!$date) return false;
        
        $diffDays = now()->diffInDays(\Carbon\Carbon::parse($date));
        $maxDays = 90; // Default or setting_value('last_modified')
        
        if(function_exists('setting_value')){
            $settingDays = setting_value('last_modified');
            if($settingDays) $maxDays = $settingDays;
        }

        return $diffDays <= $maxDays;
    }
}
