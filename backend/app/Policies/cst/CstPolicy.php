<?php

namespace App\Policies\cst;

use Illuminate\Foundation\Auth\User as Authenticatable;

class CstPolicy
{
    const MENU_ID = '10604';

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
