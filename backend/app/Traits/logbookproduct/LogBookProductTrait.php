<?php

namespace App\Traits\logbookproduct;

use Illuminate\Support\Facades\Auth;

trait LogBookProductTrait
{
    /**
     * Reusable logic specific to the Log Book Product module can be placed here.
     */
    
    public function isOwnedByCurrentUser(): bool
    {
        return $this->username === (Auth::user()->username ?? Auth::id());
    }
}
