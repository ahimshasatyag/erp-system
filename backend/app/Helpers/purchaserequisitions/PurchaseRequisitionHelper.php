<?php

namespace App\Helpers\purchaserequisitions;

use Illuminate\Support\Facades\DB;

class PurchaseRequisitionHelper
{
    /**
     * Helper logic from CodeIgniter's runningnumber_tahun
     */
    public static function generateCode($prefix, $periode)
    {
        // Sample implementation to replace `runningnumber_tahun('PR', $periode)`
        // Look up the last sequence or count for this prefix and period
        // For simplicity, we create a placeholder format PR-202310-0001
        
        $count = DB::table('tb_pr_hdr')
            ->where('code_pr', 'like', "{$prefix}-{$periode}-%")
            ->count() + 1;

        return sprintf('%s-%s-%04d', $prefix, $periode, $count);
    }

    public static function generatePoCode($prefix, $periode)
    {
        $count = DB::table('tb_po_hdr')
            ->where('code_po', 'like', "{$prefix}-{$periode}-%")
            ->count() + 1;

        return sprintf('%s-%s-%04d', $prefix, $periode, $count);
    }
}
