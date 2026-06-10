<?php

namespace App\Policies\customercontact;

use Illuminate\Auth\Access\HandlesAuthorization;

class CustomerContactPolicy
{
    use HandlesAuthorization;

    protected $id_menu = '10302';

    public function viewAny($user)
    {
        return $user->hasMenuReadAccess($this->id_menu);
    }

    public function create($user)
    {
        return $user->hasMenuCreateAccess($this->id_menu);
    }

    public function update($user)
    {
        return $user->hasMenuUpdateAccess($this->id_menu);
    }

    public function delete($user)
    {
        return $user->hasMenuDeleteAccess($this->id_menu);
    }
}
