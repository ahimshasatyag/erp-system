<?php

namespace App\Policies;

use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Traits\Menu\HasMenuAccess;

class CsrPolicy
{
    // The HasMenuAccess trait must be used by the User model to work properly.
    // So we will assume the User model uses it. If not, we can implement it here statically.
    
    const MENU_ID = '10603';

    public function viewAny(Authenticatable $user): bool
    {
        if (method_exists($user, 'hasMenuReadAccess')) {
            return $user->hasMenuReadAccess(self::MENU_ID);
        }
        return false;
    }

    public function create(Authenticatable $user): bool
    {
        if (method_exists($user, 'hasMenuCreateAccess')) {
            return $user->hasMenuCreateAccess(self::MENU_ID);
        }
        return false;
    }

    public function update(Authenticatable $user): bool
    {
        if (method_exists($user, 'hasMenuUpdateAccess')) {
            return $user->hasMenuUpdateAccess(self::MENU_ID);
        }
        return false;
    }
}
