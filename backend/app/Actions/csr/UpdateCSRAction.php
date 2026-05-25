<?php

namespace App\Actions\csr;

use App\Models\csr\Mmaster;
use App\Traits\HasCsrLog;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\UploadedFile;

class UpdateCSRAction
{
    use HasCsrLog;

    public function execute(string $csrCode, array $data, ?UploadedFile $image, string $userId): bool
    {
        return DB::transaction(function () use ($csrCode, $data, $image, $userId) {
            $csrData = [
                'id_customers' => $data['customers'],
                'csr_date' => $data['csr_date'],
                'id_karyawan' => $data['id_karyawan'],
                'lap_kerusakan' => $data['lap_kerusakan'],
                'lokasi' => $data['lokasi'],
                'sts_pasang' => $data['sts_pasang']
            ];

            if ($image) {
                $imagePath = $image->hashName();
                $image->move(public_path('assets/upload/afs/'), $imagePath);
                $csrData['image'] = $imagePath;
            }

            Mmaster::where('csr_code', $csrCode)->update($csrData);

            $this->logCsrTransaction($csrCode, $userId, 'Ubah CSR');

            return true;
        });
    }
}
