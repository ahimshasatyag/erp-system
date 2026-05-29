<?php

namespace App\Traits\lkt;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

trait HasLktLog
{
    /**
     * Write transactional log to tb_trans_swo_log
     */
    protected function logLktTransaction(string $kodeTrans, string $actionLog, string $tableName, string $formLog = 'LKT'): void
    {
        $maxId = DB::table('tb_trans_swo_log')->max('id_trans_swo_log') ?? 0;
        $newId = $maxId + 1;

        DB::table('tb_trans_swo_log')->insert([
            'id_trans_swo_log' => $newId,
            'translog_date' => date('Y-m-d H:i:s'),
            'kode_trans' => $kodeTrans,
            'user_log' => Auth::user()?->username ?? 'system',
            'action_log' => $actionLog,
            'table_name' => $tableName,
            'form_log' => $formLog,
        ]);
    }
}
