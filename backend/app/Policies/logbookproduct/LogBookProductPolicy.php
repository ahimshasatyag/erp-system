<?php

namespace App\Policies\logbookproduct;

use App\Models\logbookproduct\LogBookProduct;
use App\Models\User;

class LogBookProductPolicy
{
    /**
     * In CodeIgniter, `check_role($this->id_menu, 2)` checked read access.
     */
    public function viewAny(User $user): bool
    {
        // Replace with your actual role checking logic, e.g.:
        // return $user->hasRoleForMenu('10601', 2);
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, LogBookProduct $logBookProduct): bool
    {
        return $this->viewAny($user);
    }

    /**
     * In CodeIgniter, `check_role($this->id_menu, 1)` checked create access.
     */
    public function create(User $user): bool
    {
        // return $user->hasRoleForMenu('10601', 1);
        return true;
    }

    /**
     * In CodeIgniter, `check_role($this->id_menu, 3)` checked update access.
     */
    public function update(User $user, LogBookProduct $logBookProduct): bool
    {
        // return $user->hasRoleForMenu('10601', 3);
        return true;
    }

    /**
     * In CodeIgniter, `check_role($this->id_menu, 4)` checked delete access.
     */
    public function delete(User $user, LogBookProduct $logBookProduct): bool
    {
        // return $user->hasRoleForMenu('10601', 4);
        return true;
    }
}
