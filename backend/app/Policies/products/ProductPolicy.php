<?php

namespace App\Policies\products;

use Illuminate\Auth\Access\HandlesAuthorization;
use App\Models\User; // Adjust if your user model is different

class ProductPolicy
{
    use HandlesAuthorization;

    // Placeholder ID menu from CodeIgniter ($this->id_menu = '10501')
    const MENU_ID = '10501';

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user)
    {
        // Replace with your actual role checking logic
        // return check_role(self::MENU_ID, 2);
        return true; 
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user)
    {
        // Replace with your actual role checking logic
        // return check_role(self::MENU_ID, 1);
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user)
    {
        // Replace with your actual role checking logic
        // return check_role(self::MENU_ID, 3);
        return true;
    }

    /**
     * Determine whether the user can change status.
     */
    public function changeStatus(User $user)
    {
        // Replace with your actual role checking logic
        // return check_role(self::MENU_ID, 3);
        return true;
    }
}
