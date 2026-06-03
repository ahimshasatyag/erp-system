<?php

namespace App\Policies\logbookproduct;

use App\Models\logbookproduct\LogBookProduct;
use App\Models\User;

class LogBookProductPolicy
{
    private const MENU_ID = '10601';

    /**
     * Check if user can view any Log Book Product records.
     */
    public function viewAny(User $user): bool
    {
        if (method_exists($user, 'hasMenuReadAccess')) {
            return $user->hasMenuReadAccess(self::MENU_ID);
        }
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, LogBookProduct $logBookProduct): bool
    {
        if (method_exists($user, 'hasMenuReadAccess')) {
            return $user->hasMenuReadAccess(self::MENU_ID);
        }
        return false;
    }

    /**
     * Check if user can create a new Log Book Product record.
     */
    public function create(User $user): bool
    {
        if (method_exists($user, 'hasMenuCreateAccess')) {
            return $user->hasMenuCreateAccess(self::MENU_ID);
        }
        return false;
    }

    /**
     * Check if user can update a Log Book Product record.
     */
    public function update(User $user, LogBookProduct $logBookProduct): bool
    {
        if (method_exists($user, 'hasMenuUpdateAccess')) {
            return $user->hasMenuUpdateAccess(self::MENU_ID);
        }
        return false;
    }

    /**
     * Check if user can delete a Log Book Product record.
     */
    public function delete(User $user, LogBookProduct $logBookProduct): bool
    {
        if (method_exists($user, 'hasMenuDeleteAccess')) {
            return $user->hasMenuDeleteAccess(self::MENU_ID);
        }
        return false;
    }
}
