<?php

namespace App\Services\cst;

use App\Repositories\cst\cstRepository;
use App\Actions\cst\CreateCSTAction;
use App\Actions\cst\UpdateCSTAction;
use App\Traits\cst\HasCstLog;
use Illuminate\Support\Facades\DB;

class cstService
{
    use HasCstLog;

    public function __construct(
        protected cstRepository $repository,
        protected CreateCSTAction $createAction,
        protected UpdateCSTAction $updateAction
    ) {}

    /**
     * Get paginated and filtered list of CST records
     */
    public function getAll(string $search = null, string $startDate = null, string $endDate = null, bool $all = false)
    {
        return $this->repository->getAll($search, $startDate, $endDate, $all);
    }

    /**
     * Get CST detailed record by ticket code
     */
    public function getDetail(string $cstCode)
    {
        return $this->repository->getByCode($cstCode);
    }

    /**
     * Get related technician worksheets
     */
    public function getLktList(string $cstCode)
    {
        return $this->repository->getLktList($cstCode);
    }

    /**
     * Create new CST ticket
     */
    public function createCst(array $data, string $userId)
    {
        return $this->createAction->execute($data, $userId);
    }

    /**
     * Update CST ticket properties
     */
    public function updateCst(string $cstCode, array $data, string $userId)
    {
        return $this->updateAction->execute($cstCode, $data, $userId);
    }

    /**
     * Validate and close the CST support ticket
     */
    public function closeCst(string $cstCode, string $userId): array
    {
        return DB::transaction(function () use ($cstCode, $userId) {
            // Check that at least one related LKT worksheet is marked DONE by a technician
            if ($this->repository->checkLktDone($cstCode) === 0) {
                return [
                    'status' => 'error',
                    'message' => 'LKT Belum DONE oleh Teknisi !!'
                ];
            }

            $nowStr = now()->format('Y-m-d H:i:s');

            // Update CST ticket details
            $affected = DB::table('tb_afs_cst')
                ->where('cst_code', $cstCode)
                ->update([
                    'status' => 'DONE',
                    'cst_approve_date' => $nowStr,
                    'approved_cst_by' => $userId,
                    'done_cst_by' => $userId,
                    'cst_done_date' => $nowStr,
                ]);

            // Update related CSR ticket status to DONE
            $cstRow = DB::table('tb_afs_cst')->where('cst_code', $cstCode)->first();
            if ($cstRow) {
                DB::table('tb_afs_csr')
                    ->where('id_afs_csr', $cstRow->id_afs_csr)
                    ->update(['csr_status' => 'DONE']);
            }

            // Log Done transaction
            $this->logCstTransaction($cstCode, $userId, 'Done CST');

            if ($affected > 0) {
                return [
                    'status' => 'success',
                    'message' => 'CST updated successfully.'
                ];
            } else {
                return [
                    'status' => 'error',
                    'message' => 'Error updating CST.'
                ];
            }
        });
    }

    /**
     * Cancel the CST ticket and revert related CSR to OUTSTANDING status
     */
    public function cancelCst(string $cstCode, string $userId): array
    {
        return DB::transaction(function () use ($cstCode, $userId) {
            $cstRow = DB::table('tb_afs_cst')->where('cst_code', $cstCode)->first();

            if ($cstRow) {
                // Revert CSR status to outstanding and reset cancel flag
                DB::table('tb_afs_csr')
                    ->where('id_afs_csr', $cstRow->id_afs_csr)
                    ->update([
                        'csr_status' => 'OUTSTANDING',
                        'f_cancel' => '0'
                    ]);

                // Update CST ticket status to CANCEL
                DB::table('tb_afs_cst')
                    ->where('cst_code', $cstCode)
                    ->update(['status' => 'CANCEL']);
            }

            // Log Cancellation transaction
            $this->logCstTransaction($cstCode, $userId, 'Cancel CST');

            return ['status' => true];
        });
    }
}
