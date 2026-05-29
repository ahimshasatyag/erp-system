<?php

namespace App\Services\lkt;

use App\Models\lkt\Mmaster;
use App\Traits\lkt\HasLktLog;
use Illuminate\Support\Facades\DB;
use Exception;

class lktService
{
    use HasLktLog;

    /**
     * Confirm LKT sheet, setting LKT and CST to ON PROGRESS state
     */
    public function confirm(string $lktCode, string $cstCode): void
    {
        DB::transaction(function () use ($lktCode, $cstCode) {
            // Update LKT status
            DB::table('tb_afs_lkt')
                ->where('lkt_code', $lktCode)
                ->update(['flag_done' => 'ON PROGRESS']);

            // Update CST status
            DB::table('tb_afs_cst')
                ->where('cst_code', $cstCode)
                ->update(['status' => 'ON PROGRESS']);

            // Write transactional audit log
            $this->logLktTransaction($lktCode, 'Confirm LKT', 'tb_afs_lkt');
        });
    }

    /**
     * Close LKT worksheet, marking it DONE
     */
    public function close(string $lktCode): void
    {
        DB::transaction(function () use ($lktCode) {
            // 1. Validate if there are any unfinished visits
            $hasUnfinished = DB::table('tb_afs_realisasi')
                ->join('tb_afs_lkt', 'tb_afs_realisasi.id_afs_lkt', '=', 'tb_afs_lkt.id_afs_lkt')
                ->where('tb_afs_lkt.lkt_code', $lktCode)
                ->where('tb_afs_realisasi.f_cancel', 0)
                ->whereIn('tb_afs_realisasi.status', ['Draft', 'ON PROGRESS'])
                ->exists();

            if ($hasUnfinished) {
                throw new Exception('LKT tidak bisa di-Close karena masih ada realisasi yang berstatus Draft atau In Progress!');
            }

            // 2. Update status to DONE
            DB::table('tb_afs_lkt')
                ->where('lkt_code', $lktCode)
                ->update(['flag_done' => 'DONE']);

            // 3. Write transactional audit log
            $this->logLktTransaction($lktCode, 'Done LKT', 'tb_afs_lkt');
        });
    }

    /**
     * Save a technician visit log (realisasi)
     */
    public function saveVisit(array $data, $imageFile = null): int
    {
        return DB::transaction(function () use ($data, $imageFile) {
            $lktCode = $data['lkt_code'];
            $cstCode = $data['cst_code'];
            $actualStartingDate = $data['actual_starting_date'];

            // 1. Fetch worksheet dates to validate
            $dateData = DB::table('tb_afs_lkt')
                ->join('tb_afs_cst', 'tb_afs_lkt.id_afs_cst', '=', 'tb_afs_cst.id_afs_cst')
                ->join('tb_afs_csr', 'tb_afs_cst.id_afs_csr', '=', 'tb_afs_csr.id_afs_csr')
                ->select('tb_afs_lkt.id_afs_lkt', 'tb_afs_lkt.starting_date', 'tb_afs_cst.cst_date', 'tb_afs_csr.csr_date')
                ->where('tb_afs_lkt.lkt_code', $lktCode)
                ->first();

            if (!$dateData) {
                throw new Exception('Data LKT / CST / CSR tidak ditemukan.');
            }

            if ($actualStartingDate < $dateData->starting_date || $actualStartingDate < $dateData->cst_date || $actualStartingDate < $dateData->csr_date) {
                throw new Exception('Actual Starting Date tidak boleh lebih kecil dari Starting Date, CST Date, atau CSR Date!');
            }

            // 2. Generate dynamic visit code (MAX sub_code + 1)
            $maxSubCode = DB::table('tb_afs_realisasi')->max(DB::raw('CAST(lkt_sub_code AS UNSIGNED)')) ?? 0;
            $newSubCode = (int)$maxSubCode + 1;

            // 3. Handle image upload
            $imageName = null;
            if ($imageFile) {
                $imageName = time() . '_' . $imageFile->getClientOriginalName();
                $imageFile->move(public_path('assets/upload/afs'), $imageName);
            }

            $actualService = (int)str_replace(['.', ','], '', $data['actual_service_amount'] ?? '0');
            $actualTransport = (int)str_replace(['.', ','], '', $data['actual_transport_amount'] ?? '0');
            $actualAccommodation = (int)str_replace(['.', ','], '', $data['actual_accommodation_amount'] ?? '0');
            $actualTraining = (int)str_replace(['.', ','], '', $data['actual_training'] ?? '0');
            $actualBongkar = (int)str_replace(['.', ','], '', $data['actual_bongkar'] ?? '0');
            $actualTot = $actualService + $actualTransport + $actualAccommodation + $actualTraining + $actualBongkar;

            // 4. Save visit row
            DB::table('tb_afs_realisasi')->insert([
                'lkt_sub_code'                => $newSubCode,
                'id_afs_lkt'                  => $dateData->id_afs_lkt,
                'actual_starting_date'        => $actualStartingDate,
                'actual_day'                  => $data['actual_day'],
                'actual_service_amount'       => $actualService,
                'actual_transport_amount'     => $actualTransport,
                'actual_accommodation_amount' => $actualAccommodation,
                'actual_description'          => $data['actual_description'],
                'actual_tot_detail_amount'    => $actualTot,
                'status'                      => 'Draft',
                'image'                       => $imageName,
                'actual_training'             => $actualTraining,
                'actual_bongkar'              => $actualBongkar,
                'flag_daring'                 => !empty($data['flag_daring']) ? 1 : 0,
            ]);

            // 5. Insert visit technicians list
            if (!empty($data['nm_teknisi']) && is_array($data['nm_teknisi'])) {
                foreach ($data['nm_teknisi'] as $teknisiId) {
                    if ($teknisiId) {
                        DB::table('tb_afs_realisasi_teknisi')->insert([
                            'id_afs_cst'         => DB::table('tb_afs_lkt')->where('id_afs_lkt', $dateData->id_afs_lkt)->value('id_afs_cst'),
                            'id_afs_lkt'         => $dateData->id_afs_lkt,
                            'lkt_sub_code'       => $newSubCode,
                            'actual_id_karyawan' => $teknisiId,
                        ]);
                    }
                }
            }

            // 6. Write log
            $this->logLktTransaction('ID VISIT : ' . $newSubCode, 'Insert VISIT', 'tb_afs_realisasi');

            return $newSubCode;
        });
    }

    /**
     * Save planned spare part item
     */
    public function savePart(array $data): void
    {
        DB::transaction(function () use ($data) {
            $lktCode = $data['lkt_code'];
            $partName = $data['add_part_name'];
            $qty = (int)str_replace(['.', ','], '', $data['add_qty_part'] ?? '0');
            $harga = (int)str_replace(['.', ','], '', $data['add_harga_es'] ?? '0');
            $total = $qty * $harga;

            DB::table('tb_trans_swo_part')->insert([
                'lkt_code' => $lktCode,
                'name'     => $partName,
                'qty'      => $qty,
                'harga'    => $harga,
                'total'    => $total,
                'f_cancel' => '0',
            ]);

            $this->logLktTransaction($lktCode, 'Insert Part LKT', 'tb_trans_swo_part');
        });
    }

    /**
     * Save actual spare part item used in visit
     */
    public function savePartVisit(array $data): void
    {
        DB::transaction(function () use ($data) {
            $lktCode = $data['lkt_code'];
            $visitId = $data['id_visit'];
            $partName = $data['add_part_name'];
            $qty = (int)str_replace(['.', ','], '', $data['add_qty_part'] ?? '0');
            $harga = (int)str_replace(['.', ','], '', $data['add_harga_es'] ?? '0');
            $total = $qty * $harga;

            DB::table('tb_trans_swo_part_actual')->insert([
                'lkt_code' => $lktCode,
                'id_visit' => $visitId,
                'name'     => $partName,
                'qty'      => $qty,
                'harga'    => $harga,
                'total'    => $total,
                'f_cancel' => '0',
            ]);

            $this->logLktTransaction('ID VISIT : ' . $visitId, 'Insert Part VISIT', 'tb_trans_swo_part_actual');
        });
    }

    /**
     * Update a technician visit log (realisasi)
     */
    public function updateVisit(string $subCode, array $data, $imageFile = null): void
    {
        DB::transaction(function () use ($subCode, $data, $imageFile) {
            $lktCode = $data['lkt_code'];
            $cstCode = $data['cst_code'];
            $actualStartingDate = $data['actual_starting_date'];

            // 1. Fetch worksheet dates to validate
            $dateData = DB::table('tb_afs_lkt')
                ->join('tb_afs_cst', 'tb_afs_lkt.id_afs_cst', '=', 'tb_afs_cst.id_afs_cst')
                ->join('tb_afs_csr', 'tb_afs_cst.id_afs_csr', '=', 'tb_afs_csr.id_afs_csr')
                ->select('tb_afs_lkt.starting_date', 'tb_afs_cst.cst_date', 'tb_afs_csr.csr_date')
                ->where('tb_afs_lkt.lkt_code', $lktCode)
                ->first();

            if ($dateData) {
                if ($actualStartingDate < $dateData->starting_date || $actualStartingDate < $dateData->cst_date || $actualStartingDate < $dateData->csr_date) {
                    throw new Exception('Actual Starting Date tidak boleh lebih kecil dari Starting Date, CST Date, atau CSR Date!');
                }
            }

            $actualService = (int)str_replace(['.', ','], '', $data['actual_service_amount'] ?? '0');
            $actualTransport = (int)str_replace(['.', ','], '', $data['actual_transport_amount'] ?? '0');
            $actualAccommodation = (int)str_replace(['.', ','], '', $data['actual_accommodation_amount'] ?? '0');
            $actualTraining = (int)str_replace(['.', ','], '', $data['actual_training'] ?? '0');
            $actualBongkar = (int)str_replace(['.', ','], '', $data['actual_bongkar'] ?? '0');
            $actualTot = $actualService + $actualTransport + $actualAccommodation + $actualTraining + $actualBongkar;

            $updateData = [
                'actual_starting_date'        => $actualStartingDate,
                'actual_day'                  => $data['actual_day'],
                'actual_service_amount'       => $actualService,
                'actual_transport_amount'     => $actualTransport,
                'actual_accommodation_amount' => $actualAccommodation,
                'actual_description'          => $data['actual_description'],
                'actual_tot_detail_amount'    => $actualTot,
                'actual_training'             => $actualTraining,
                'actual_bongkar'              => $actualBongkar,
                'flag_daring'                 => !empty($data['flag_daring']) ? 1 : 0,
            ];

            // Handle image upload if a new file is provided
            if ($imageFile) {
                $imageName = time() . '_' . $imageFile->getClientOriginalName();
                $imageFile->move(public_path('assets/upload/afs'), $imageName);
                $updateData['image'] = $imageName;
            }

            DB::table('tb_afs_realisasi')
                ->where('lkt_sub_code', $subCode)
                ->update($updateData);

            // Re-sync technicians
            DB::table('tb_afs_realisasi_teknisi')
                ->where('lkt_sub_code', $subCode)
                ->delete();

            if (!empty($data['nm_teknisi']) && is_array($data['nm_teknisi'])) {
                $idAfsLkt = DB::table('tb_afs_lkt')->where('lkt_code', $lktCode)->value('id_afs_lkt');
                $idAfsCst = DB::table('tb_afs_cst')->where('cst_code', $cstCode)->value('id_afs_cst');
                foreach ($data['nm_teknisi'] as $teknisiId) {
                    if ($teknisiId) {
                        DB::table('tb_afs_realisasi_teknisi')->insert([
                            'id_afs_cst'         => $idAfsCst,
                            'id_afs_lkt'         => $idAfsLkt,
                            'lkt_sub_code'       => $subCode,
                            'actual_id_karyawan' => $teknisiId,
                        ]);
                    }
                }
            }

            $this->logLktTransaction('ID VISIT : ' . $subCode, 'Ubah VISIT', 'tb_afs_realisasi');
        });
    }

    /**
     * Cancel an LKT worksheet
     */
    public function cancel(string $lktCode): void
    {
        DB::transaction(function () use ($lktCode) {
            DB::table('tb_afs_lkt')
                ->where('lkt_code', $lktCode)
                ->update(['f_cancel' => 1]);

            $this->logLktTransaction($lktCode, 'Cancel LKT', 'tb_afs_lkt');
        });
    }

    /**
     * Cancel a visit (realisasi)
     */
    public function cancelVisit(string $lktSubCode): void
    {
        DB::transaction(function () use ($lktSubCode) {
            DB::table('tb_afs_realisasi')
                ->where('lkt_sub_code', $lktSubCode)
                ->update([
                    'f_cancel' => 1,
                    'status' => 'CANCEL'
                ]);

            $this->logLktTransaction('ID VISIT : ' . $lktSubCode, 'Cancel VISIT', 'tb_afs_realisasi');
        });
    }
}
