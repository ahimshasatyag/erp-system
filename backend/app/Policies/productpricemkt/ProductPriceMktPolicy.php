<?php

namespace App\Policies\productpricemkt;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProductPriceMktPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user)
    {
        // Add specific permission logic here. For example, check role against menu 10402.
        return true; 
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, $productPrice)
    {
        return true;
    }
}
