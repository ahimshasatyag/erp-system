<?php

namespace App\Policies\purchaserequisitions;

use App\Models\User;
use App\Models\purchaserequisitions\PurchaseRequisition;
use Illuminate\Auth\Access\HandlesAuthorization;

class PurchaseRequisitionPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return true;
    }

    public function view(User $user, PurchaseRequisition $pr)
    {
        return true;
    }

    public function create(User $user)
    {
        return true;
    }

    public function update(User $user, PurchaseRequisition $pr)
    {
        return true;
    }

    public function delete(User $user, PurchaseRequisition $pr)
    {
        return true;
    }
}
