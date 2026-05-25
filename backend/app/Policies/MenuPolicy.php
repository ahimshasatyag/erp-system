<?php

namespace App\Policies;

use App\Models\Menu;
use App\Models\User;

class MenuPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasMenuReadAccess('menu_management') || $user->id_users_level === 1;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Menu $menu): bool
    {
        return $user->hasMenuReadAccess('menu_management') || $user->id_users_level === 1;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasMenuCreateAccess('menu_management') || $user->id_users_level === 1;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Menu $menu): bool
    {
        return $user->hasMenuUpdateAccess('menu_management') || $user->id_users_level === 1;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Menu $menu): bool
    {
        return $user->hasMenuDeleteAccess('menu_management') || $user->id_users_level === 1;
    }
}
