<?php

namespace App\Policies\productprice;

use App\Models\User;
use App\Models\productprice\ProductPrice;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProductPricePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        // Equivalent to check_role($id_menu, 2)
        return true;
    }

    public function view(User $user, ProductPrice $productPrice): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        // Equivalent to check_role($id_menu, 1)
        return true;
    }

    public function update(User $user, ProductPrice $productPrice): bool
    {
        // Equivalent to check_role($id_menu, 3)
        return true;
    }

    public function delete(User $user, ProductPrice $productPrice): bool
    {
        // Equivalent to check_role($id_menu, 4)
        return true;
    }
}
