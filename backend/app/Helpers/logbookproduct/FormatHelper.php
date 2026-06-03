<?php

namespace App\Helpers\logbookproduct;

class FormatHelper
{
    /**
     * General helper to format strings, handle legacy htmlspecialchars, etc.
     */
    public static function cleanInput(?string $input): ?string
    {
        if ($input === null) {
            return null;
        }
        return htmlspecialchars(trim($input));
    }
}
