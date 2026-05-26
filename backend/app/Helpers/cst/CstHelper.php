<?php

namespace App\Helpers\cst;

use Illuminate\Support\Facades\DB;

class CstHelper
{
    /**
     * Generate new CST Code based on legacy logic
     */
    public static function generateCstCode(): string
    {
        $today = date('Y');
        $todayM = date('m');
        
        $maxCst = DB::table('tb_afs_cst')
            ->whereRaw("cst_code LIKE 'CST-EMM/%'")
            ->selectRaw("MAX(CAST(RIGHT(cst_code, 5) AS UNSIGNED)) as maxUrut")
            ->first();
            
        $noUrut = $maxCst && $maxCst->maxUrut ? (int)$maxCst->maxUrut + 1 : 1;
        
        return 'CST-EMM/' . $today . '/' . $todayM . '/' . sprintf('%05s', $noUrut);
    }
}
