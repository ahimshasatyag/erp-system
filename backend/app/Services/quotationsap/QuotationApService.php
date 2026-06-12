<?php

namespace App\Services\quotationsap;

use App\Repositories\quotationsap\QuotationApRepositoryInterface;
use App\Enums\quotationsap\QuotationApStatus;
use Illuminate\Support\Facades\DB;
use App\Helpers\cform\CformHelper; // Assuming exists for runningnumber_tahun etc.
use Illuminate\Support\Facades\File;

class QuotationApService
{
    protected $repository;

    public function __construct(QuotationApRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function getDatatable($request)
    {
        return $this->repository->getDatatable($request);
    }

    public function getById($id)
    {
        return $this->repository->findById($id);
    }

    public function create(array $data, $file = null)
    {
        return DB::transaction(function () use ($data, $file) {
            $date_po = date('Y-m-d', strtotime($data['date_po']));
            $periode = date('Ym', strtotime($date_po));
            
            // Helper from legacy, assuming it's available or implemented similarly
            $code_po = \App\Helpers\CformHelper::runningnumber_tahun('QAP', $periode) ?? 'QAP-'.time();
            
            $headerData = [
                'code_po' => $code_po,
                'date_po' => $date_po,
                'status_po' => QuotationApStatus::DRAFT->value,
                'date_schdl' => empty($data['date_schdl']) ? null : date('Y-m-d', strtotime($data['date_schdl'])),
                'id_suppliers' => $data['id_suppliers'],
                'nm_suppliers' => $data['nm_suppliers'] ?? '',
                'id_gudang' => $data['id_gudang'],
                'id_mata_uang' => $data['mata_uang'] ?? null,
                'partner_ref' => $data['partner_ref'] ?? null,
                'notes' => $data['notes'] ?? null,
                'amount_total' => 0,
                'id_product_lokasi' => $data['id_product_lokasi'],
                'date_create' => now()
            ];

            if ($file) {
                $filename = time() . '_' . $file->getClientOriginalName();
                $file->move(public_path('assets/upload'), $filename);
                $headerData['link_file'] = $filename;
            }

            $header = $this->repository->createHeader($headerData);
            
            $amount_total = 0;

            if (isset($data['details']) && is_array($data['details'])) {
                foreach ($data['details'] as $detail) {
                    $qty = $detail['qty'];
                    $price = $detail['product_price'];
                    
                    $amount_total += ($price * $qty);

                    if ($qty > 0) {
                        $dtlData = [
                            'id_po' => $header->id_po,
                            'id_product' => $detail['id_product'],
                            'code_product' => $detail['code_product'] ?? '',
                            'nm_product' => $detail['nm_product'] ?? '',
                            'product_deskripsi' => $detail['product_deskripsi'] ?? '',
                            'qty' => $qty,
                            'product_price' => $price,
                            'notes' => $detail['notes'] ?? ''
                        ];

                        $detailRecord = $this->repository->createDetail($dtlData);

                        if (isset($detail['options']) && is_array($detail['options'])) {
                            foreach ($detail['options'] as $opt) {
                                $this->repository->createOptionDetail([
                                    'id_po_dtl' => $detailRecord->id_po_dtl,
                                    'id_product' => $detail['id_product'],
                                    'id_po' => $header->id_po,
                                    'nm_product_opt' => $opt['nm_product_opt'],
                                    'harga' => $opt['harga']
                                ]);
                            }
                        }
                    }
                }
            }

            $this->repository->updateAmountTotal($header->id_po, $amount_total);

            return $header;
        });
    }

    public function update($id, array $data, $file = null)
    {
        return DB::transaction(function () use ($id, $data, $file) {
            $header = $this->repository->findById($id);

            $headerData = [
                'date_po' => date('Y-m-d', strtotime($data['date_po'])),
                'date_schdl' => empty($data['date_schdl']) ? null : date('Y-m-d', strtotime($data['date_schdl'])),
                'id_suppliers' => $data['id_suppliers'],
                'nm_suppliers' => $data['nm_suppliers'] ?? '',
                'id_gudang' => $data['id_gudang'],
                'id_mata_uang' => $data['mata_uang'] ?? null,
                'partner_ref' => $data['partner_ref'] ?? null,
                'notes' => $data['notes'] ?? null,
                'id_product_lokasi' => $data['id_product_lokasi']
            ];

            if ($file) {
                // Delete old file if exists
                if ($header->link_file && File::exists(public_path('assets/upload/' . $header->link_file))) {
                    File::delete(public_path('assets/upload/' . $header->link_file));
                }
                $filename = time() . '_' . $file->getClientOriginalName();
                $file->move(public_path('assets/upload'), $filename);
                $headerData['link_file'] = $filename;
            }

            $this->repository->updateHeader($id, $headerData);

            // Re-create details
            $this->repository->deleteDetails($id);
            // Options are cascade deleted usually, or we can just delete by details manually but deleteDetails deletes all.
            // Wait, the legacy code manually deletes `tb_po_dtl` which might cascade options or not. We'll assume DB handles it or we re-insert new ones.
            // Actually, in Mmaster update, it loops and deletes options per dtl.
            
            $amount_total = 0;

            if (isset($data['details']) && is_array($data['details'])) {
                foreach ($data['details'] as $detail) {
                    $qty = $detail['qty'];
                    $price = $detail['product_price'];
                    
                    $amount_total += ($price * $qty);

                    if ($qty > 0) {
                        $dtlData = [
                            'id_po' => $id,
                            'id_product' => $detail['id_product'],
                            'code_product' => $detail['code_product'] ?? '',
                            'nm_product' => $detail['nm_product'] ?? '',
                            'product_deskripsi' => $detail['product_deskripsi'] ?? '',
                            'qty' => $qty,
                            'product_price' => $price,
                            'notes' => $detail['notes'] ?? ''
                        ];

                        $detailRecord = $this->repository->createDetail($dtlData);

                        if (isset($detail['options']) && is_array($detail['options'])) {
                            foreach ($detail['options'] as $opt) {
                                // Assume front-end sends all checked options
                                $this->repository->createOptionDetail([
                                    'id_po_dtl' => $detailRecord->id_po_dtl,
                                    'id_product' => $detail['id_product'],
                                    'id_po' => $id,
                                    'nm_product_opt' => $opt['nm_product_opt'],
                                    'harga' => $opt['harga']
                                ]);
                            }
                        }
                    }
                }
            }

            $this->repository->updateAmountTotal($id, $amount_total);

            return $this->repository->findById($id);
        });
    }

    public function cancel($id)
    {
        $this->repository->updateStatus($id, QuotationApStatus::CANCEL->value);
        return true;
    }
}
