<?php

namespace App\Helpers;

use Illuminate\Support\Facades\DB;

class MenuHelper
{
    /**
     * Formats powers array for a user level and menu ID
     */
    public static function getMenuPowersForLevel(string $menuId, int $levelId): array
    {
        return DB::table('m_users_role')
            ->where('id_menu', $menuId)
            ->where('id_users_level', $levelId)
            ->join('m_users_power', 'm_users_role.id_users_power', '=', 'm_users_power.id_users_power')
            ->pluck('nm_users_power')
            ->toArray();
    }
}
