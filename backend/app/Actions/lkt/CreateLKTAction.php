<?php

namespace App\Actions\lkt;

use App\Helpers\lkt\LktHelper;
use App\Models\lkt\Mmaster;
use App\Traits\lkt\HasLktLog;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Exception;

class CreateLKTAction
{
    use HasLktLog;

    /**
     * Create LKT sheet under transactional integrity
     */
    public function execute(array $data, $imageFile = null): Mmaster
    {
        return DB::transaction(function () use ($data, $imageFile) {
            $cstCode = $data['cst_code'];
            $startingDate = $data['starting_date'];

            // 1. Fetch CST and CSR Dates to validate
            $csrData = DB::table('tb_afs_cst')
                ->join('tb_afs_csr', 'tb_afs_cst.id_afs_csr', '=', 'tb_afs_csr.id_afs_csr')
                ->select('tb_afs_cst.id_afs_cst', 'tb_afs_cst.cst_date', 'tb_afs_csr.csr_date')
                ->where('tb_afs_cst.cst_code', $cstCode)
                ->first();

            if (!$csrData) {
                throw new Exception('Data CST / CSR tidak ditemukan.');
            }

            // 2. Validate dates
            $startingDateCheck = date('Y-m-d', strtotime($startingDate));
            $cstDateCheck = date('Y-m-d', strtotime($csrData->cst_date));
            $csrDateCheck = date('Y-m-d', strtotime($csrData->csr_date));

            if ($startingDateCheck < $cstDateCheck) {
                throw new Exception('Starting Date tidak boleh lebih kecil dari CST Date (' . date('d-m-Y', strtotime($csrData->cst_date)) . ')');
            }

            if ($startingDateCheck < $csrDateCheck) {
                throw new Exception('Starting Date tidak boleh lebih kecil dari CSR Date (' . date('d-m-Y', strtotime($csrData->csr_date)) . ')');
            }

            // 3. Generate sequential LKT Code
            $lktCode = LktHelper::generateCode();

            // 4. File uploads
            $imageName = null;
            if ($imageFile) {
                $imageName = time() . '_' . $imageFile->getClientOriginalName();
                $imageFile->move(public_path('assets/upload/afs'), $imageName);
            }

            $transportAmount = (int)str_replace(['.', ','], '', $data['transport_amount'] ?? '0');
            $accommodationAmount = (int)str_replace(['.', ','], '', $data['accommodation_amount'] ?? '0');
            $serviceAmount = (int)str_replace(['.', ','], '', $data['service_amount'] ?? '0');
            $totDetailAmount = $transportAmount + $accommodationAmount + $serviceAmount;

            // 5. Create worksheet
            $lkt = Mmaster::create([
                'lkt_code'             => $lktCode,
                'id_afs_cst'           => $csrData->id_afs_cst,
                'starting_date'        => $startingDate,
                'estimation_day'       => $data['estimation_day'] ?? null,
                'service_amount'       => $serviceAmount,
                'transport_amount'     => $transportAmount,
                'accommodation_amount' => $accommodationAmount,
                'description'          => $data['description'],
                'tot_detail_amount'    => $totDetailAmount,
                'flag_done'            => 'DRAFT',
                'image'                => $imageName,
                'actual_transport'     => trim($data['actual_transport'] ?? ''),
                'f_cancel'             => 0,
            ]);

            // 6. Insert planned technicians if provided
            if (!empty($data['nm_teknisi']) && is_array($data['nm_teknisi'])) {
                foreach ($data['nm_teknisi'] as $teknisiId) {
                    if ($teknisiId) {
                        DB::table('tb_afs_realisasi_teknisi')->insert([
                            'id_afs_cst'  => $csrData->id_afs_cst,
                            'id_afs_lkt'  => $lkt->id_afs_lkt,
                            'id_karyawan' => $teknisiId,
                        ]);
                    }
                }
            }

            // 7. Write transactional history log
            $this->logLktTransaction($lktCode, 'Insert LKT', 'tb_afs_lkt');

            return $lkt;
        });
    }
}
