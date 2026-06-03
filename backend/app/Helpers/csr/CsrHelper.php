<?php

namespace App\Helpers;

use Illuminate\Support\Facades\DB;

class CsrHelper
{
    /**
     * Generate new CSR Code based on legacy logic
     */
    public static function generateCsrCode(): string
    {
        $today = date('Y');
        $todayM = date('m');
        
        $kodeCSR = DB::table('tb_afs_csr')->max('csr_code');
        
        $noUrut = 0;
        if ($kodeCSR) {
            $noUrut = (int)substr($kodeCSR, 16, 5);
        }
        $noUrut++;
        
        return 'CSR-EMM/' . $today . '/' . $todayM . '/' . sprintf('%05s', $noUrut);
    }
    
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
