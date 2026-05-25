<?php

namespace App\Actions\csr;

use App\Models\csr\Mmaster;
use App\Helpers\CsrHelper;
use App\Traits\HasCsrLog;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Http\UploadedFile;

class CreateCSRAction
{
    use HasCsrLog;

    public function execute(array $data, ?UploadedFile $image, string $userId): Mmaster
    {
        return DB::transaction(function () use ($data, $image, $userId) {
            $csrCode = CsrHelper::generateCsrCode();
            
            // Handle image upload
            $imagePath = null;
            if ($image) {
                $imagePath = $image->hashName();
                $image->move(public_path('assets/upload/afs/'), $imagePath);
            }

            // Date calculations
            $dateRequest = Carbon::parse($data['date_request'])->format('Y-m-d');
            $tglDelivered = Carbon::parse($data['tgl_delivered'])->format('Y-m-d');
            
            $warranty = '12'; 
            $tambahThn = Carbon::parse($tglDelivered)->addYear()->format('Y-m-d');
            
            // Calculate extended warranty if any
            $soQuery = DB::table('tb_so_dtl_extend_warranty as a')
                ->join('tb_so_hdr as b', 'a.so_id', '=', 'b.id_so')
                ->join('tb_do_hdr as c', 'b.id_so', '=', 'c.id_so')
                ->where('c.code_do', $data['do_code'])
                ->where('a.status', 'CONFIRM')
                ->sum('a.name');
                
            if ($soQuery > 0) {
                $tambahThn = Carbon::parse($tambahThn)->addDays($soQuery)->format('Y-m-d');
            }

            $csrData = [
                'csr_code' => $csrCode,
                'csr_date' => $dateRequest,
                'id_customers' => $data['customers'],
                'id_karyawan' => $data['id_karyawan'],
                'barcode' => $data['sn_number'],
                'do_code' => $data['do_code'],
                'waranty_start' => $tglDelivered,
                'waranty_time' => $warranty,
                'waranty_end' => $tambahThn,
                'lap_kerusakan' => $data['lap_kerusakan'],
                'id_product' => $data['id_product'],
                'lokasi' => $data['lokasi'],
                'csr_input_date' => now(),
                'csr_by' => $userId,
                'csr_status' => 'DRAFT',
                'sts_pasang' => $data['sts_pasang'],
                'mesin_lama' => $data['mesin_lama'] ?? null,
                'image' => $imagePath
            ];
            
            $csr = Mmaster::create($csrData);
            
            // Insert empty CST
            DB::table('tb_afs_cst')->insert([
                'id_afs_csr' => $csr->id_afs_csr,
                'cst_code' => 'kosong',
                'cst_date' => null,
                'status' => null
            ]);
            
            // Translog
            $this->logCsrTransaction($csrCode, $userId, 'insert CSR');
            
            // WA Notification
            $customerName = DB::table('m_customers')->where('id_customers', $data['customers'])->value('nm_customers');
            $productCode = DB::table('m_product')->where('id_product', $data['id_product'])->value('code_product');
            
            $message = "Telah diinput oleh " . $userId . "\n";
            $message .= "tanggal : " . date('d-m-Y H:i:s') . "\n";
            $message .= "\nNo CSR : " . $csrCode . "\n";
            $message .= "\nCustomer : " . $customerName . "\n";
            $message .= "\nModel mesin : " . $productCode . "\n";
            $message .= "\nTgl Kirim Mesin : " . $tglDelivered . "\n";
            $message .= "\nTanggal Request : " . $dateRequest . "\n";
            $message .= "\nKeterangan : " . $data['lap_kerusakan'];
            
            $this->sendWaNotification('62818777535-1541378496', $message, $userId, 1);
            
            return $csr;
        });
    }
}
