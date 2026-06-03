<?php

namespace App\Policies\cekserialnumber;

use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Models\cekserialnumber\Mmaster;

class CekSerialNumberPolicy
{
    const MENU_ID = '10606';

    public function viewAny(Authenticatable $user): bool
    {
        if (method_exists($user, 'hasMenuReadAccess')) {
            return $user->hasMenuReadAccess(self::MENU_ID);
        }
        return false;
    }

    public function view(Authenticatable $user, Mmaster $mmaster): bool
    {
        if (method_exists($user, 'hasMenuReadAccess')) {
            return $user->hasMenuReadAccess(self::MENU_ID);
        }
        return false;
    }

    // Usually Cek Serial Number is read-only, but we can provide placeholders
    public function create(Authenticatable $user): bool
    {
        return false;
    }

    public function update(Authenticatable $user, Mmaster $mmaster): bool
    {
        return false;
    }

    public function delete(Authenticatable $user, Mmaster $mmaster): bool
    {
        return false;
    }
}
