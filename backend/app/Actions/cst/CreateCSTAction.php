<?php

namespace App\Actions\cst;

use App\Models\cst\Mmaster;
use App\Helpers\cst\CstHelper;
use App\Traits\cst\HasCstLog;
use Illuminate\Support\Facades\DB;

class CreateCSTAction
{
    use HasCstLog;

    /**
     * Execute CST creation transaction
     */
    public function execute(array $data, string $userId): Mmaster
    {
        return DB::transaction(function () use ($data, $userId) {
            $cstCode = CstHelper::generateCstCode();

            $cstData = [
                'id_afs_csr' => $data['id_afs_csr'],
                'cst_code' => $cstCode,
                'cst_date' => $data['cst_date'] ?? now()->format('Y-m-d'),
                'status' => $data['status'] ?? 'OUTSTANDING',
            ];

            $cst = Mmaster::create($cstData);

            $this->logCstTransaction($cstCode, $userId, 'Tambah CST');

            return $cst;
        });
    }
}
