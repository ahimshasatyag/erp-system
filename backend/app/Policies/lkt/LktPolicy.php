<?php

namespace App\Policies\lkt;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Auth\Access\HandlesAuthorization;

class LktPolicy
{
    use HandlesAuthorization;

    private const MENU_ID = '10605';

    /**
     * Check if user can view any LKT records.
     */
    public function viewAny(Authenticatable $user): bool
    {
        if (method_exists($user, 'hasMenuReadAccess')) {
            return $user->hasMenuReadAccess(self::MENU_ID);
        }
        return false;
    }

    /**
     * Check if user can view a single LKT record.
     */
    public function view(Authenticatable $user): bool
    {
        if (method_exists($user, 'hasMenuReadAccess')) {
            return $user->hasMenuReadAccess(self::MENU_ID);
        }
        return false;
    }

    /**
     * Check if user can create a new LKT record.
     */
    public function create(Authenticatable $user): bool
    {
        if (method_exists($user, 'hasMenuCreateAccess')) {
            return $user->hasMenuCreateAccess(self::MENU_ID);
        }
        return false;
    }

    /**
     * Check if user can update an LKT record.
     */
    public function update(Authenticatable $user): bool
    {
        if (method_exists($user, 'hasMenuUpdateAccess')) {
            return $user->hasMenuUpdateAccess(self::MENU_ID);
        }
        return false;
    }

    /**
     * Check if user can delete an LKT record.
     */
    public function delete(Authenticatable $user): bool
    {
        if (method_exists($user, 'hasMenuDeleteAccess')) {
            return $user->hasMenuDeleteAccess(self::MENU_ID);
        }
        return false;
    }
}

