<?php

namespace App\Policies\productsubcategory;

use App\Models\User;
use App\Models\productsubcategory\ProductSubCategory;

class ProductSubCategoryPolicy
{
    public function viewAny(User $user)
    {
        return true;
    }

    public function view(User $user, ProductSubCategory $category)
    {
        return true;
    }

    public function create(User $user)
    {
        return true;
    }

    public function update(User $user, ProductSubCategory $category)
    {
        return true;
    }

    public function delete(User $user, ProductSubCategory $category)
    {
        return true;
    }
}
