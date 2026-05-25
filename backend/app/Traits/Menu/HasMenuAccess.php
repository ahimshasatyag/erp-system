<?php

namespace App\Traits\Menu;

use Illuminate\Support\Facades\DB;

trait HasMenuAccess
{
    /**
     * Check if user has access to a menu with a specific power.
     * Powers: 1 = Create, 2 = Read, 3 = Update, 4 = Delete
     */
    public function hasMenuAccess(string $menuId, int $powerId = 2): bool
    {
        if (!$this->id_users_level) {
            return false;
        }

        // Super Admin (level = 1) always has full access
        if ($this->id_users_level === 1) {
            return true;
        }

        return DB::table('m_users_role')
            ->where('id_users_level', $this->id_users_level)
            ->where('id_menu', $menuId)
            ->where('id_users_power', $powerId)
            ->exists();
    }

    public function hasMenuCreateAccess(string $menuId): bool
    {
        return $this->hasMenuAccess($menuId, 1);
    }

    public function hasMenuReadAccess(string $menuId): bool
    {
        return $this->hasMenuAccess($menuId, 2);
    }

    public function hasMenuUpdateAccess(string $menuId): bool
    {
        return $this->hasMenuAccess($menuId, 3);
    }

    public function hasMenuDeleteAccess(string $menuId): bool
    {
        return $this->hasMenuAccess($menuId, 4);
    }

    /**
     * Get a list of menu IDs accessible by the user.
     */
    public function getAccessibleMenuIds(): array
    {
        if (!$this->id_users_level) {
            return [];
        }

        if ($this->id_users_level === 1) {
            // Super Admin gets everything
            return DB::table('m_menu')->pluck('id_menu')->toArray();
        }

        return DB::table('m_users_role')
            ->where('id_users_level', $this->id_users_level)
            ->where('id_users_power', 2) // Read permission
            ->pluck('id_menu')
            ->toArray();
    }
}
