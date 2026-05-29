<?php

namespace App\Helpers\lkt;

use Illuminate\Support\Facades\DB;

class LktHelper
{
    /**
     * Generate unique sequential LKT code
     */
    public static function generateCode(): string
    {
        $today = date("Y");
        $todayM = date("m");

        $maxLkt = DB::table('tb_afs_lkt')->max('lkt_code');

        $noUrut = 0;
        if ($maxLkt) {
            $noUrut = (int)substr($maxLkt, 16, 5);
        }
        $noUrut++;

        return 'LKT-EMM' . '/' . $today . '/' . $todayM . '/' . sprintf('%05s', $noUrut);
    }
}
