<?php

namespace App\Actions\quotationsap;

use App\Repositories\quotationsap\QuotationApRepositoryInterface;
use App\Enums\quotationsap\QuotationApStatus;
use Illuminate\Support\Facades\DB;

class ConfirmQuotationApAction
{
    protected $repository;

    public function __construct(QuotationApRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function execute($id_po)
    {
        return DB::transaction(function () use ($id_po) {
            $header = $this->repository->findById($id_po);

            if ($header->status_po == QuotationApStatus::PO_PURCHASE->value) {
                throw new \Exception("Quotation is already confirmed.");
            }

            $code_po_lama = $header->code_po;
            $id_product_lokasi_destination = $header->id_product_lokasi;
            $id_product_lokasi_source = 8; // From Cform.php hardcoded

            // Generate new PO code
            $periode = date('Ym');
            $code_po = \App\Helpers\CformHelper::runningnumber_tahun('PO', $periode) ?? 'PO-'.time();

            // Update Header status and Code
            $this->repository->updateCodePo($id_po, $code_po, $code_po_lama);
            $this->repository->updateStatus($id_po, QuotationApStatus::PO_PURCHASE->value);

            // Generate incoming
            $code_incoming = \App\Helpers\CformHelper::runningnumber_tahun_angka('IN', $periode) ?? 'IN-'.time();
            $id_incoming = $this->repository->createIncomingHeader([
                'code' => $code_incoming,
                'id_po' => $id_po,
                'id_suppliers' => $header->id_suppliers,
                'status_incoming' => 'READY TO RECEIVE',
                'date_create' => now()
            ]);

            // Map detail to incoming detail based on qty (legacy behavior loops 1..qty to insert 1 per row)
            $details = $header->details;
            foreach ($details as $row) {
                $qty = $row->qty;
                for ($i = 1; $i <= $qty; $i++) {
                    $this->repository->createIncomingDetail([
                        'incoming_hdr_id' => $id_incoming,
                        'id_product' => $row->id_product,
                        'qty' => 1, // Legacy inserts 1 by 1
                        'status' => 'Available',
                        'id_product_lokasi_source' => $id_product_lokasi_source,
                        'id_product_lokasi_destination' => $id_product_lokasi_destination
                    ]);
                }
            }

            return true;
        });
    }
}
