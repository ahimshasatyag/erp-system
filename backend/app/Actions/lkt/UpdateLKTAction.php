<?php

namespace App\Actions\lkt;

use App\Models\lkt\Mmaster;
use App\Traits\lkt\HasLktLog;
use Illuminate\Support\Facades\DB;
use Exception;

class UpdateLKTAction
{
    use HasLktLog;

    /**
     * Update LKT sheet under transactional integrity
     */
    public function execute(string $lktCode, array $data, $imageFile = null): bool
    {
        return DB::transaction(function () use ($lktCode, $data, $imageFile) {
            $lkt = Mmaster::where('lkt_code', $lktCode)->first();
            if (!$lkt) {
                throw new Exception('Data LKT tidak ditemukan.');
            }

            // 1. Calculate totals
            $transportAmount = (int)str_replace(['.', ','], '', $data['transport_amount'] ?? '0');
            $accommodationAmount = (int)str_replace(['.', ','], '', $data['accommodation_amount'] ?? '0');
            $serviceAmount = (int)str_replace(['.', ','], '', $data['service_amount'] ?? '0');
            $totDetailAmount = $transportAmount + $accommodationAmount + $serviceAmount;

            // 2. Handle image file replacement
            $imageName = $lkt->image;
            if ($imageFile) {
                // Delete previous file if exists
                if ($lkt->image && file_exists(public_path('assets/upload/afs/' . $lkt->image))) {
                    @unlink(public_path('assets/upload/afs/' . $lkt->image));
                }
                $imageName = time() . '_' . $imageFile->getClientOriginalName();
                $imageFile->move(public_path('assets/upload/afs'), $imageName);
            }

            // 3. Update main worksheet row
            $lkt->update([
                'starting_date'        => $data['starting_date'] ?? $lkt->starting_date,
                'description'          => $data['description'] ?? $lkt->description,
                'estimation_day'       => $data['estimation_day'] ?? $lkt->estimation_day,
                'transport_amount'     => $transportAmount,
                'accommodation_amount' => $accommodationAmount,
                'service_amount'       => $serviceAmount,
                'tot_detail_amount'    => $totDetailAmount,
                'actual_transport'     => trim($data['actual_transport'] ?? $lkt->actual_transport),
                'image'                => $imageName,
            ]);

            // 4. Update planned technicians list (Delete & Re-insert)
            DB::table('tb_afs_realisasi_teknisi')
                ->where('id_afs_lkt', $lkt->id_afs_lkt)
                ->where('id_karyawan', '!=', 0)
                ->delete();

            if (!empty($data['nm_teknisi']) && is_array($data['nm_teknisi'])) {
                foreach ($data['nm_teknisi'] as $teknisiId) {
                    if ($teknisiId) {
                        DB::table('tb_afs_realisasi_teknisi')->insert([
                            'id_afs_cst'  => $lkt->id_afs_cst,
                            'id_afs_lkt'  => $lkt->id_afs_lkt,
                            'id_karyawan' => $teknisiId,
                        ]);
                    }
                }
            }

            // 5. Write log
            $this->logLktTransaction($lktCode, 'Ubah LKT', 'tb_afs_lkt');

            return true;
        });
    }
}
