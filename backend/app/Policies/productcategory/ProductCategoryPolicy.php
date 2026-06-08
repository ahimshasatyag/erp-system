<?php

namespace App\Policies\productcategory;

use App\Models\User;
use App\Models\productcategory\ProductCategory;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProductCategoryPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user)
    {
        // Based on check_role($id_menu, 2) in Cform::index()
        return true; 
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ProductCategory $productCategory)
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user)
    {
        // Based on check_role($id_menu, 1) in Cform::tambah() / simpan()
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ProductCategory $productCategory)
    {
        // Based on check_role($id_menu, 3) in Cform::update()
        return true;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ProductCategory $productCategory)
    {
        // Based on check_role($id_menu, 4) in Cform::delete()
        return true;
    }
}
