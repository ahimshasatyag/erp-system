<?php

namespace App\Traits\csr;

use Illuminate\Support\Facades\DB;

trait HasCsrLog
{
    /**
     * Log CSR Transaction to tb_trans_swo_log
     */
    public function logCsrTransaction(string $kodeTrans, string $userId, string $action): void
    {
        $maxLogId = DB::table('tb_trans_swo_log')->max('id_trans_swo_log');
        $newLogId = $maxLogId ? $maxLogId + 1 : 1;

        DB::table('tb_trans_swo_log')->insert([
            'id_trans_swo_log' => $newLogId,
            'translog_date' => now(),
            'kode_trans' => $kodeTrans,
            'user_id' => $userId,
            'action' => $action,
            'table_name' => 'tb_afs_csr',
            'form' => 'CSR',
        ]);
    }
    
    /**
     * Insert WhatsApp notification to tb_message_wa
     */
    public function sendWaNotification(string $mobileNumber, string $message, string $userId, int $flagGroup = 1): void
    {
        $maxWaId = DB::table('tb_message_wa')->max('id_message_wa');
        $newWaId = $maxWaId ? $maxWaId + 1 : 1;

        DB::table('tb_message_wa')->insert([
            'id_message_wa' => $newWaId,
            'mobile_number' => $mobileNumber,
            'message' => $message,
            'username_create' => $userId,
            'flag_status' => '0',
            'date_create' => now(),
            'date_update' => now(),
            'flag_group' => $flagGroup,
        ]);
    }
}
