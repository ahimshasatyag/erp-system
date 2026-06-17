<?php

namespace App\Enums\productpricemkt;

enum ProductPriceMktStatusEnum: string
{
    case BARU = '3.Baru';
    case ASAL = '1.Asal';
    
    // Status helpers
    public function label(): string
    {
        return match($this) {
            self::BARU => 'Harga Baru',
            self::ASAL => 'Harga Lama',
        };
    }
}
