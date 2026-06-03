<?php

namespace App\Services\csr;

use App\Repositories\csr\csrRepository;
use App\Actions\csr\CreateCSRAction;
use App\Actions\csr\UpdateCSRAction;
use Illuminate\Support\Facades\DB;
use App\Traits\HasCsrLog;
use App\Helpers\CsrHelper;
use App\Enums\CsrStatusEnum;

class csrService
{
    use HasCsrLog;

    public function __construct(
        protected csrRepository $repository,
        protected CreateCSRAction $createAction,
        protected UpdateCSRAction $updateAction
    ) {}

    public function getAll(string $search = null, string $startDate = null, string $endDate = null, bool $all = false)
    {
        return $this->repository->getAll($search, $startDate, $endDate, $all);
    }

    public function getDetail(string $csrCode)
    {
        return $this->repository->getByCode($csrCode);
    }
    
    public function createCsr(array $data, $image, string $userId)
    {
        return $this->createAction->execute($data, $image, $userId);
    }

    public function updateCsr(string $csrCode, array $data, $image, string $userId)
    {
        return $this->updateAction->execute($csrCode, $data, $image, $userId);
    }

    public function confirmCsr(string $csrCode, string $customer, string $product, string $userId)
    {
        return DB::transaction(function () use ($csrCode, $customer, $product, $userId) {
            $csr = $this->repository->getByCode($csrCode);
            if (!$csr) return ['status' => false, 'message' => 'Data CSR tidak ditemukan'];
            if ($csr->approved_csr_by != null) return ['status' => false, 'message' => 'CSR sudah dikonfirmasi'];

            $cstCode = CsrHelper::generateCstCode();
            
            DB::table('tb_afs_csr')->where('csr_code', $csrCode)->update([
                'csr_status' => CsrStatusEnum::OUTSTANDING->value,
                'approved_csr_by' => $userId,
                'csr_approve_date' => now()
            ]);

            $cekCst = DB::table('tb_afs_cst')->where('id_afs_csr', $csr->id_afs_csr)->where('cst_code', 'kosong')->first();
            if ($cekCst) {
                DB::table('tb_afs_cst')->where('id_afs_cst', $cekCst->id_afs_cst)->update([
                    'cst_code' => $cstCode,
                    'cst_date' => now(),
                    'status' => 'OUTSTANDING'
                ]);
            } else {
                DB::table('tb_afs_cst')->insert([
                    'id_afs_csr' => $csr->id_afs_csr,
                    'cst_code' => $cstCode,
                    'cst_date' => now(),
                    'status' => 'OUTSTANDING'
                ]);
            }

            $this->logCsrTransaction($csrCode, $userId, 'Confrim CSR');

            $customerName = DB::table('m_customers')->where('id_customers', $customer)->value('nm_customers');
            $mobileCust = DB::table('m_customers')->where('id_customers', $customer)->value('customers_mobile');
            $productName = DB::table('m_product')->where('id_product', $product)->value('nm_product');
            $productCodeStr = DB::table('m_product')->where('id_product', $product)->value('code_product');

            $message = "Bpk/Ibu " . $customerName . "\nLaporan Anda berkaitan dengan *mesin " . $productCodeStr . " " . $productName . "* sudah kami Terima dengan *ID Ticket Pelaporan #" . substr($cstCode, -5) . "* \nTim kami akan menindaklanjuti dan menginformasikan kepada Anda. \nIni adalah pesan otomatis. Harap tidak menjawab pesan ini";

            $this->sendWaNotification($mobileCust ?? '', $message, $userId, 0);

            return ['status' => true, 'cst_code' => str_replace('/', '.', $cstCode)];
        });
    }

    public function cancelCsr(string $csrCode, string $customer, string $product, string $memo, string $userId)
    {
        return DB::transaction(function () use ($csrCode, $customer, $product, $memo, $userId) {
            DB::table('tb_afs_csr')->where('csr_code', $csrCode)->update([
                'csr_status' => CsrStatusEnum::CANCEL->value,
                'f_cancel' => 1,
                'alasan_cancel' => $memo
            ]);

            $this->logCsrTransaction($csrCode, $userId, 'Cancel CSR');

            $customerName = DB::table('m_customers')->where('id_customers', $customer)->value('nm_customers');
            $productCodeStr = DB::table('m_product')->where('id_product', $product)->value('code_product');

            $message = "Telah di CANCEL\nNo CSR: $csrCode\nCustomer: $customerName\nModel mesin: $productCodeStr\noleh $userId\ntanggal: " . now()->format('d-m-Y H:i:s') . "\nAlasan: $memo";
            
            $this->sendWaNotification('62818777535-1541378496', $message, $userId, 1);

            return ['status' => true];
        });
    }

    public function getBarcodeData(string $barcode)
    {
        return $this->repository->getByBarcode($barcode);
    }
}
