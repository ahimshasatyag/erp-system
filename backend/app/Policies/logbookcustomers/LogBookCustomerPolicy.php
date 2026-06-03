<?php

namespace App\Policies\logbookcustomers;

use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Traits\Menu\HasMenuAccess;

class LogBookCustomerPolicy
{
    const MENU_ID = '10602';

    public function viewAny(Authenticatable $user): bool
    {
        if (method_exists($user, 'hasMenuReadAccess')) {
            return $user->hasMenuReadAccess(self::MENU_ID);
        }
        return false;
    }

    public function view(Authenticatable $user): bool
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

    public function delete(Authenticatable $user): bool
    {
        if (method_exists($user, 'hasMenuDeleteAccess')) {
            return $user->hasMenuDeleteAccess(self::MENU_ID);
        }
        return false;
    }
}
