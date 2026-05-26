<?php

namespace App\Actions\cst;

use App\Models\cst\Mmaster;
use App\Traits\cst\HasCstLog;
use Illuminate\Support\Facades\DB;

class UpdateCSTAction
{
    use HasCstLog;

    /**
     * Execute CST update transaction
     */
    public function execute(string $cstCode, array $data, string $userId): bool
    {
        return DB::transaction(function () use ($cstCode, $data, $userId) {
            $cstData = [];

            if (isset($data['status'])) {
                $cstData['status'] = $data['status'];
            }

            if (isset($data['cst_date'])) {
                $cstData['cst_date'] = $data['cst_date'];
            }

            if (empty($cstData)) {
                return false;
            }

            Mmaster::where('cst_code', $cstCode)->update($cstData);

            $this->logCstTransaction($cstCode, $userId, 'Ubah CST');

            return true;
        });
    }
}
